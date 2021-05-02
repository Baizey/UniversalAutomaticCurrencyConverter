import useMockContainer from './Container.mock';
import {Configuration} from 'karma-typescript/dist/shared/configuration';
import {ActiveLocalization} from '../src/CurrencyConverter/Localization';

describe('Startup', () => {
    it(`load`, async () => {
        // Setup
        const [container, provider] = useMockContainer()

        // Act
        await provider.startup.load()
    });
});