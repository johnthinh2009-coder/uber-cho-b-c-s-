import type { AdherenceDay, Medication, MedicationDose, Prescription } from '@/domain';
import { atDayOffset, dateKey, todayKey } from '@/utils/date';

/**
 * Fictional demo medications only. Names and doses are illustrative and are
 * not medical advice.
 */
export const MEDICATIONS: Medication[] = [
  {
    id: 'med-salbutamol',
    patientId: 'person-minh-anh',
    name: 'Salbutamol dạng hít',
    strength: '100 mcg/liều',
    dose: '2 nhát xịt',
    route: 'Inhaled',
    frequencyLabel: 'Ngày 2 lần',
    times: ['08:00', '20:00'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    durationDays: null,
    startDate: atDayOffset(-120, '08:00'),
    instructions: 'Lắc kỹ. Thở ra hết, rồi hít vào chậm trong lúc ấn bình xịt.',
    source: { type: 'prescription', prescriptionId: 'rx-0001', doctorId: 'prov-thu-ha', doctorName: 'BS. Nguyễn Thu Hà' },
    colorKey: 'pine',
    isActive: true,
  },
  {
    id: 'med-vitamin-d',
    patientId: 'person-minh-anh',
    name: 'Vitamin D3',
    strength: '1000 IU',
    dose: '1 viên',
    route: 'Oral',
    frequencyLabel: 'Ngày 1 lần',
    times: ['08:00'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    durationDays: null,
    startDate: atDayOffset(-60, '08:00'),
    instructions: 'Uống cùng bữa sáng.',
    source: { type: 'self' },
    colorKey: 'apricot',
    isActive: true,
  },
  {
    id: 'med-cetirizine',
    patientId: 'person-hoang-nam',
    name: 'Cetirizine (siro trẻ em)',
    strength: '1 mg/ml',
    dose: '2,5 ml',
    route: 'Oral',
    frequencyLabel: 'Ngày 1 lần',
    times: ['18:00'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    durationDays: 14,
    startDate: atDayOffset(-4, '18:00'),
    instructions: 'Đong bằng xi-lanh đi kèm. Cho uống vào đầu buổi tối.',
    source: { type: 'prescription', prescriptionId: 'rx-0002', doctorId: 'prov-ngoc-mai', doctorName: 'BS. Trần Ngọc Mai' },
    colorKey: 'rose',
    isActive: true,
  },
  {
    id: 'med-amlodipine',
    patientId: 'person-ba-lan',
    name: 'Amlodipine',
    strength: '5 mg',
    dose: '1 viên',
    route: 'Oral',
    frequencyLabel: 'Ngày 1 lần',
    times: ['09:00'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    durationDays: null,
    startDate: atDayOffset(-400, '09:00'),
    instructions: 'Uống vào cùng một giờ mỗi sáng.',
    source: { type: 'prescription', prescriptionId: 'rx-0003', doctorId: 'prov-van-hung', doctorName: 'BS.CKII Phạm Văn Hùng' },
    colorKey: 'plum',
    isActive: true,
  },
];

const today = todayKey();

/** Today's dose schedule – the morning doses have been taken already. */
export const DOSES: MedicationDose[] = [
  { id: 'dose-1', medicationId: 'med-salbutamol', date: today, time: '08:00', status: 'taken', takenAt: atDayOffset(0, '08:05') },
  { id: 'dose-2', medicationId: 'med-vitamin-d', date: today, time: '08:00', status: 'taken', takenAt: atDayOffset(0, '08:05') },
  { id: 'dose-3', medicationId: 'med-salbutamol', date: today, time: '20:00', status: 'scheduled' },
  { id: 'dose-4', medicationId: 'med-cetirizine', date: today, time: '18:00', status: 'scheduled' },
  { id: 'dose-5', medicationId: 'med-amlodipine', date: today, time: '09:00', status: 'taken', takenAt: atDayOffset(0, '09:12') },
];

export const ADHERENCE_HISTORY: AdherenceDay[] = Array.from({ length: 14 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - index));
  const scheduled = 3;
  const pattern = [3, 3, 2, 3, 3, 3, 1, 3, 3, 3, 2, 3, 3, 3];
  return { date: dateKey(date), scheduled, taken: pattern[index] ?? 3 };
});

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-0001',
    patientId: 'person-minh-anh',
    patientName: 'Nguyễn Minh Anh',
    doctorId: 'prov-thu-ha',
    doctorName: 'BS. Nguyễn Thu Hà',
    issuedAt: atDayOffset(-120, '11:30'),
    status: 'added_to_schedule',
    items: [
      {
        id: 'rxi-1',
        medicationName: 'Salbutamol dạng hít',
        strength: '100 mcg/liều',
        dose: '2 nhát xịt',
        route: 'Inhaled',
        frequencyLabel: 'Ngày 2 lần',
        times: ['08:00', '20:00'],
        durationDays: 180,
        instructions: 'Dùng đều đặn và khi có triệu chứng.',
      },
    ],
    notes: 'Kiểm tra lại kỹ thuật hít ở lần khám sau.',
  },
  {
    id: 'rx-0002',
    patientId: 'person-hoang-nam',
    patientName: 'Nguyễn Hoàng Nam',
    doctorId: 'prov-ngoc-mai',
    doctorName: 'BS. Trần Ngọc Mai',
    issuedAt: atDayOffset(-4, '16:10'),
    status: 'added_to_schedule',
    items: [
      {
        id: 'rxi-2',
        medicationName: 'Cetirizine (siro trẻ em)',
        strength: '1 mg/ml',
        dose: '2,5 ml',
        route: 'Oral',
        frequencyLabel: 'Ngày 1 lần',
        times: ['18:00'],
        durationDays: 14,
        instructions: 'Cho uống vào đầu buổi tối trong hai tuần.',
      },
    ],
    notes: 'Triệu chứng viêm mũi dị ứng theo mùa. Ngưng nếu bé buồn ngủ rõ rệt.',
  },
  {
    id: 'rx-0004',
    patientId: 'person-minh-anh',
    patientName: 'Nguyễn Minh Anh',
    doctorId: 'prov-thu-ha',
    doctorName: 'BS. Nguyễn Thu Hà',
    issuedAt: atDayOffset(-1, '15:40'),
    status: 'issued',
    items: [
      {
        id: 'rxi-3',
        medicationName: 'Montelukast',
        strength: '10 mg',
        dose: '1 viên',
        route: 'Oral',
        frequencyLabel: 'Ngày 1 lần, buổi tối',
        times: ['21:00'],
        durationDays: 30,
        instructions: 'Uống vào buổi tối. Tiếp tục dùng thuốc hít như trước.',
      },
    ],
    notes: 'Bổ sung để kiểm soát hen suyễn trong mùa phấn hoa. Tái khám sau bốn tuần.',
  },
];
