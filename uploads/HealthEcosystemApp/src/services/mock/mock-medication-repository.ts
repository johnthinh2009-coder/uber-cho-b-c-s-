import type { AdherenceDay, DoseStatus, Medication, MedicationDose, Prescription } from '@/domain';
import { ADHERENCE_HISTORY, DOSES, MEDICATIONS, PRESCRIPTIONS } from '@/mocks/medication';
import { todayKey } from '@/utils/date';

import type { MedicationRepository } from '../repositories';
import { clone, delay, nextId } from './utils';

const colorCycle: Medication['colorKey'][] = ['plum', 'pine', 'apricot', 'rose', 'sky'];

export class MockMedicationRepository implements MedicationRepository {
  private medications: Medication[] = clone(MEDICATIONS);
  private doses: MedicationDose[] = clone(DOSES);
  private prescriptionsState: Prescription[] = clone(PRESCRIPTIONS);

  async list(): Promise<Medication[]> {
    await delay(250);
    return clone(this.medications);
  }

  async add(medication: Omit<Medication, 'id'>): Promise<Medication> {
    await delay(400);
    const created: Medication = { ...medication, id: nextId('med') };
    this.medications = [...this.medications, created];
    this.generateDoses(created);
    return clone(created);
  }

  async update(id: string, patch: Partial<Medication>): Promise<Medication> {
    await delay(300);
    const index = this.medications.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Medication ${id} not found`);
    const updated = { ...this.medications[index]!, ...patch };
    this.medications[index] = updated;
    return clone(updated);
  }

  async dosesForDate(date: string): Promise<MedicationDose[]> {
    await delay(200);
    return clone(this.doses.filter((d) => d.date === date));
  }

  async setDoseStatus(id: string, status: DoseStatus, snoozedUntil?: string): Promise<MedicationDose> {
    await delay(200);
    const dose = this.doses.find((d) => d.id === id);
    if (!dose) throw new Error(`Dose ${id} not found`);
    dose.status = status;
    dose.takenAt = status === 'taken' ? new Date().toISOString() : undefined;
    dose.snoozedUntil = status === 'snoozed' ? snoozedUntil : undefined;
    return clone(dose);
  }

  async adherence(): Promise<AdherenceDay[]> {
    await delay(200);
    const today = todayKey();
    const todayDoses = this.doses.filter((d) => d.date === today);
    return [
      ...ADHERENCE_HISTORY.filter((d) => d.date !== today),
      { date: today, scheduled: todayDoses.length, taken: todayDoses.filter((d) => d.status === 'taken').length },
    ];
  }

  async prescriptions(): Promise<Prescription[]> {
    await delay(250);
    return clone(this.prescriptionsState).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  }

  async getPrescription(id: string): Promise<Prescription | undefined> {
    await delay(150);
    const rx = this.prescriptionsState.find((p) => p.id === id);
    return rx ? clone(rx) : undefined;
  }

  async issuePrescription(prescription: Omit<Prescription, 'id' | 'issuedAt' | 'status'>): Promise<Prescription> {
    await delay(500);
    const created: Prescription = {
      ...prescription,
      id: nextId('rx'),
      issuedAt: new Date().toISOString(),
      status: 'issued',
    };
    this.prescriptionsState = [created, ...this.prescriptionsState];
    return clone(created);
  }

  async addPrescriptionToSchedule(id: string): Promise<{ prescription: Prescription; medications: Medication[] }> {
    await delay(500);
    const rx = this.prescriptionsState.find((p) => p.id === id);
    if (!rx) throw new Error(`Prescription ${id} not found`);
    const created = rx.items.map((item, index) => {
      const medication: Medication = {
        id: nextId('med'),
        patientId: rx.patientId,
        name: item.medicationName,
        strength: item.strength,
        dose: item.dose,
        route: item.route,
        frequencyLabel: item.frequencyLabel,
        times: item.times,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        durationDays: item.durationDays,
        startDate: new Date().toISOString(),
        instructions: item.instructions,
        source: { type: 'prescription', prescriptionId: rx.id, doctorId: rx.doctorId, doctorName: rx.doctorName },
        colorKey: colorCycle[(this.medications.length + index) % colorCycle.length]!,
        isActive: true,
      };
      this.generateDoses(medication);
      return medication;
    });
    this.medications = [...this.medications, ...created];
    rx.status = 'added_to_schedule';
    return { prescription: clone(rx), medications: clone(created) };
  }

  /** Creates today's dose slots for a new medication (future days are derived on demand). */
  private generateDoses(medication: Medication) {
    const today = todayKey();
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    medication.times.forEach((time) => {
      const [h = 0, m = 0] = time.split(':').map(Number);
      if (h * 60 + m >= nowMinutes - 60) {
        this.doses.push({ id: nextId('dose'), medicationId: medication.id, date: today, time, status: 'scheduled' });
      }
    });
  }
}
