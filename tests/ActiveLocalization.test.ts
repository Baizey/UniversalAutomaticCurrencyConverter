import {CurrencyLocalization} from '../src/currencyConverter/Localization/CurrencyLocalization';
import {SyncSetting} from '../src/infrastructure/Configuration/SyncSetting';
import useMockContainer from './Container.mock';
import {ActiveLocalization} from '../src/currencyConverter/Localization';
import chai, {expect} from 'chai'

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
        const provider = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, '', setting);

        // Act
        localization.override(test.input)

        // Assert
        expect(localization.value).to.be.eql(test.expect)
    }));

    [
        {input: 'AAA', expect: true},
        {input: '', expect: false},
    ].forEach(test => it(`Conflict ${test.input} => ${test.expect}`, () => {
        // Setup
        const provider = useMockContainer();
        const setting = new SyncSetting<string>(provider, '', '', () => true)
        const localization = new CurrencyLocalization(provider, '', setting);
        localization.setDetected(test.input)

        // Assert
        expect(localization.hasConflict()).to.be.eql(test.expect)
    }));

    it(`Save`, async () => {
        // Setup
        const provider = useMockContainer();
        const localization = provider.activeLocalization;
        const kroneSpy = chai.spy.on(localization.krone, 'save')
        const yenSpy = chai.spy.on(localization.yen, 'save')
        const dollarSpy = chai.spy.on(localization.dollar, 'save')

        // Act
        await localization.save();

        // Assert
        expect(kroneSpy).to.have.been.called.once
        expect(yenSpy).to.have.been.called.once
        expect(dollarSpy).to.have.been.called.once
    })
});