import useMockContainer from './Container.mock';

describe('Startup', () => {
    it(`load`, async () => {
        // Setup
        const [container, provider] = useMockContainer()
        spyOn(provider.configuration, 'load').and.resolveTo()
        spyOn(provider.activeLocalization, 'load').and.resolveTo()

        // Act
        await provider.startup.load()

        // Assert
        expect(provider.configuration.load).toHaveBeenCalled()
        expect(provider.activeLocalization.load).toHaveBeenCalled()
    });
});