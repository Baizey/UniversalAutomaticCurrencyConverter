import {CurrencyLocalization} from '../src/CurrencyConverter/Localization/CurrencyLocalization';
import {SyncSetting} from '../src/Infrastructure/Configuration/SyncSetting';
import useMockContainer from './Container.mock';

describe('CurrencyLocalization', () => {
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
        {input: 'AAA', default: 'BBB', expect: true},
        {input: 'CCC', default: 'CCC', expect: false},
    ].forEach(test => it(`Conflict ${test.input} => ${test.expect}`, () => {
        // Setup
        const [container, provider] = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, '', setting);
        localization.defaultValue = test.default;
        localization.setDetected(test.input)

        // Assert
        expect(localization.hasConflict()).toBe(test.expect)
    }));

    it(`Save`, async () => {
        // Setup
        const [container, provider] = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, 'key', setting);
        spyOn(provider.browser, 'saveLocal').and.callThrough()

        // Act
        await localization.save();

        // Assert
        expect(provider.browser.saveLocal).toHaveBeenCalledOnceWith('key', '');
    })
});