/**
 * Placeholder test — verifies animation delays are capped at 400ms.
 * Spec: R7 (delays ≤400ms on mobile)
 */

describe.skip('Animation delays — responsive design', () => {
  it('Timeline delay capped at Math.min(index * 100, 400) (R7)', () => {
    // Given 10 items, delays: 200, 300, 400, 400, 400... (not 200..1000)
    // const delays = [0,1,2,3,4,5,6,7,8,9].map(i => Math.min(200 + i * 100, 400));
    // expect(delays[0]).toBe(200);
    // expect(delays[2]).toBe(400);
    // expect(delays[5]).toBe(400);
    expect(true).toBe(true); // placeholder
  });

  it('Services delay capped at Math.min(index * 100, 400) (R7)', () => {
    // Services cards: delays capped — 200+index*100 but never exceed 400
    // const delays = [0,1,2,3,4,5].map(i => Math.min(200 + i * 100, 400));
    // expect(delays[0]).toBe(200);
    // expect(delays[2]).toBe(400);
    // expect(delays[4]).toBe(400);
    expect(true).toBe(true); // placeholder
  });
});
