import { careStatusOrder, isActiveCareStatus, nextCareStatus } from './care';

describe('care request state machine', () => {
  it('moves forward one step at a time through the full visit lifecycle', () => {
    let status = careStatusOrder[0]!;
    const visited = [status];
    for (;;) {
      const next = nextCareStatus(status);
      if (!next) break;
      status = next;
      visited.push(status);
    }
    expect(visited).toEqual([
      'REQUESTED',
      'SEARCHING',
      'MATCHED',
      'DOCTOR_EN_ROUTE',
      'DOCTOR_ARRIVED',
      'VISIT_IN_PROGRESS',
      'VISIT_COMPLETED',
    ]);
  });

  it('has no transition out of a completed or cancelled visit', () => {
    expect(nextCareStatus('VISIT_COMPLETED')).toBeNull();
    expect(nextCareStatus('CANCELLED')).toBeNull();
  });

  it('treats only in-flight statuses as active', () => {
    expect(isActiveCareStatus('DOCTOR_EN_ROUTE')).toBe(true);
    expect(isActiveCareStatus('VISIT_COMPLETED')).toBe(false);
    expect(isActiveCareStatus('CANCELLED')).toBe(false);
  });
});
