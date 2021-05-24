import {CurrencyLocalization} from '../src/currencyConverter/Localization/CurrencyLocalization';
import {SyncSetting} from '../src/infrastructure/Configuration/SyncSetting';
import useMockContainer from './Container.mock';
import {ActiveLocalization} from '../src/currencyConverter/Localization';

describe('ActiveLocalization', () => {
    [
        {input: 'AAA', expect: 'AAA'},
        {input: 'AAAA', expect: ''},
        {input: 'AA', expect: ''},
        {input: 'Q.Q', expect: ''},
        {input: 'USD', expect: 'USD'},
        {input: '123', expect: ''},
        {input: 'aaa', expect: ''},
        {input: 'aaaa', expect: ''},
    ].forEach(test => it(`Override ${test.input} => ${test.expect}`, () => {
        // Setup
        const [container, provider] = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, '', setting);

        // Act
        localization.override(test.input)

        // Assert
        expect(localization.value).toBe(test.expect)
    }));

    [
        {input: 'AAA', expect: true},
        {input: '', expect: false},
    ].forEach(test => it(`Conflict ${test.input} => ${test.expect}`, () => {
        // Setup
        const [container, provider] = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, '', setting);
        localization.setDetected(test.input)

        // Assert
        expect(localization.hasConflict()).toBe(test.expect)
    }));

    it(`Save`, async () => {
        // Setup
        const [container, provider] = useMockContainer();
        const localization = provider.activeLocalization;
        spyOn(localization.krone, 'save')
        spyOn(localization.yen, 'save')
        spyOn(localization.dollar, 'save')

        // Act
        await localization.save();

        // Assert
        expect(localization.krone.save).toHaveBeenCalled()
        expect(localization.yen.save).toHaveBeenCalled()
        expect(localization.dollar.save).toHaveBeenCalled()
    })
});