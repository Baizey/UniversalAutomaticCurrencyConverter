import { CurrencyRate } from '../src/currencyConverter/BackendApi/CurrencyRate';

describe('CurrencyRate', () => {
  it(`very old is expired`, () => {
    // Setup
    const rate = new CurrencyRate('', '', 0, 5, []);
    // Assert
    expect(rate.isExpired).toBe(true);
  });
  it(`just expired`, () => {
    // Setup
    const rate = new CurrencyRate(
      '',
      '',
      0,
      Date.now() - 1000 * 60 * 60 * 24,
      []
    );
    // Assert
    expect(rate.isExpired).toBe(true);
  });
  it(`just exactly not expired`, () => {
    // Setup
    const rate = new CurrencyRate(
      '',
      '',
      0,
      Date.now() - 1000 * 60 * 60 * 24 + 1000,
      []
    );
    // Assert
    expect(rate.isExpired).toBe(false);
  });
  it(`new isn't expired`, () => {
    // Setup
    const rate = new CurrencyRate('', '', 0, Date.now(), []);
    // Assert
    expect(rate.isExpired).toBe(false);
  });
});
