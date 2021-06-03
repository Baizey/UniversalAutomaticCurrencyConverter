import {TabInformation} from "../src/currencyConverter/Live/TabInformation";
import {CurrencyElement} from "../src/currencyConverter/Currency";
import useMockContainer from "./Container.mock";

describe('TabInformation', () => {
    it(`is allowed`, () => {
        // Setup
        const tabInfo = new TabInformation()
        tabInfo.setIsAllowed(true);

        // Assert
        expect(tabInfo.isAllowed).toBeTrue()
    });
    it(`is not allowed`, () => {
        // Setup
        const tabInfo = new TabInformation()
        tabInfo.setIsAllowed(false);

        // Assert
        expect(tabInfo.isAllowed).toBeFalse()
    });

    it(`is showing conversions`, () => {
        // Setup
        const tabInfo = new TabInformation()
        tabInfo.setIsShowingConversions(true)

        // Assert
        expect(tabInfo.isShowingConversions).toBeTrue()
    });

    it(`is not showing conversions after flip`, () => {
        // Setup
        const [container, provider] = useMockContainer();
        const tabInfo = new TabInformation()
        tabInfo.conversions.push(new CurrencyElement(provider, document.createElement('div')))
        tabInfo.setIsShowingConversions(true)

        // Act
        tabInfo.flipAllConversions()

        // Assert
        expect(tabInfo.conversions.map(e => e.isShowingConversion)[0]).toBeFalse()
        expect(tabInfo.isShowingConversions).toBeFalse()
    });

    it(`is not showing hovered conversions after flip`, () => {
        // Setup
        const [container, provider] = useMockContainer();
        const tabInfo = new TabInformation()
        tabInfo.conversions.push(new CurrencyElement(provider, document.createElement('div')))
        tabInfo.conversions[0].isHovered = true;
        tabInfo.setIsShowingConversions(true)

        // Act
        tabInfo.flipHovered()

        // Assert
        expect(tabInfo.conversions.map(e => e.isShowingConversion)[0]).toBeFalse()
        expect(tabInfo.isShowingConversions).toBeTrue()
    });
});