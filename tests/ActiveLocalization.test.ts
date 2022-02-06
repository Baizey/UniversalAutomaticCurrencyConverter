import { CurrencyLocalization } from '../src/currencyConverter/Localization/CurrencyLocalization';
import { SyncSetting } from '../src/infrastructure/Configuration/SyncSetting';
import useMockContainer from './Container.mock';
import { ActiveLocalization } from '../src/currencyConverter/Localization';

describe('ActiveLocalization', () => {
  [
    { input: 'AAA', expect: 'AAA' },
    { input: 'AAAA', expect: '' },
    { input: 'AA', expect: '' },
    { input: 'Q.Q', expect: '' },
    { input: 'USD', expect: 'USD' },
    { input: '123', expect: '' },
    { input: 'aaa', expect: '' },
    { input: 'aaaa', expect: '' },
  ].forEach((test) =>
    it(`Override ${test.input} => ${test.expect}`, () => {
      // Setup
      const provider = useMockContainer();
      const setting = new SyncSetting<string>(provider, '', '', () => true);
      const localization = new CurrencyLocalization(provider, '', setting);

      // Act
      localization.override(test.input);

      // Assert
      expect(localization.value).toBe(test.expect);
    })
  );

  [
    { input: 'AAA', expect: true },
    { input: '', expect: false },
  ].forEach((test) =>
    it(`Conflict ${test.input} => ${test.expect}`, () => {
      // Setup
      const provider = useMockContainer();
      const setting = new SyncSetting<string>(provider, '', '', () => true);
      const localization = new CurrencyLocalization(provider, '', setting);
      localization.setDetected(test.input);

      // Assert
      expect(localization.hasConflict()).toBe(test.expect);
    })
  );

  it(`Save`, async () => {
    // Setup
    const provider = useMockContainer();
    const localization = provider.activeLocalization;
    jest.spyOn(localization.krone, 'save');
    const kroneSpy = jest.spyOn(localization.krone, 'save');
    const yenSpy = jest.spyOn(localization.yen, 'save');
    const dollarSpy = jest.spyOn(localization.dollar, 'save');

    // Act
    await localization.save();

    // Assert
    expect(kroneSpy).toBeCalledTimes(1);
    expect(yenSpy).toBeCalledTimes(1);
    expect(dollarSpy).toBeCalledTimes(1);
  });
});
