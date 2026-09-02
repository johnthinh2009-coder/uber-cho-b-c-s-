import { computeSettlement } from './common';

describe('computeSettlement', () => {
  it('takes the platform commission from the provider share, never on top of the customer price', () => {
    const settlement = computeSettlement(1_000_000, 0.2, 'USD');
    expect(settlement.gross).toBe(1_000_000);
    expect(settlement.platformFee).toBe(200_000);
    expect(settlement.providerNet).toBe(800_000);
    expect(settlement.platformFee + settlement.providerNet).toBe(settlement.gross);
  });

  it('rounds to cents', () => {
    const settlement = computeSettlement(16.5, 0.2, 'USD');
    expect(settlement.platformFee).toBe(3.3);
    expect(settlement.providerNet).toBe(13.2);
  });
});
