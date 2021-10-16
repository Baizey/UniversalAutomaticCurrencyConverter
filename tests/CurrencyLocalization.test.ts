import {CurrencyLocalization} from '../src/currencyConverter/Localization/CurrencyLocalization';
import {SyncSetting} from '../src/infrastructure/Configuration/SyncSetting';
import useMockContainer from './Container.mock';
import chai, {expect} from 'chai';

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
        const provider = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, '', setting);

        // Act
        localization.override(test.input)

        // Assert
        expect(localization.value).to.be.eql(test.expect)
    }));

    [
        {input: 'AAA', default: 'BBB', expect: true},
        {input: 'CCC', default: 'CCC', expect: false},
    ].forEach(test => it(`Conflict ${test.input} => ${test.expect}`, () => {
        // Setup
        const provider = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, '', setting);
        localization.defaultValue = test.default;
        localization.setDetected(test.input)

        // Assert
        expect(localization.hasConflict()).to.be.eql(test.expect)
    }));

    it(`Save`, async () => {
        // Setup
        const provider = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, 'key', setting);
        const spy = chai.spy.on(provider.browser, 'saveLocal');

        // Act
        await localization.save();

        // Assert
        expect(spy).to.have.called.once.with('key', '')
    })
});