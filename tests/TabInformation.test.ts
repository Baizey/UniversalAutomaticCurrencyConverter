import { TabState } from "../src/currencyConverter/Live/TabState";
import { CurrencyElement } from "../src/currencyConverter/Currency";
import useMockContainer from "./Container.mock";
import { HtmlMock } from "./Html.mock";

;

describe("TabInformation", () => {
  it(`is allowed`, () => {
    // Setup
    const tabInfo = new TabState();
    tabInfo.setIsAllowed(true);

    expect(tabInfo.isAllowed).toBe(true);
    // Assert
    expect(tabInfo.isAllowed).toBe(true);
  });
  it(`is not allowed`, () => {
    // Setup
    const tabInfo = new TabState();
    tabInfo.setIsAllowed(false);

    // Assert
    expect(tabInfo.isAllowed).toBe(false);
  });

  it(`is showing conversions`, () => {
    // Setup
    const tabInfo = new TabState();
    tabInfo.setIsShowingConversions(true);

    // Assert
    expect(tabInfo.isShowingConversions).toBe(true);
  });

  it(`is not showing conversions after flip`, () => {
    // Setup
    const provider = useMockContainer();
    const tabInformation = provider.tabState;
    tabInformation.conversions.push(new CurrencyElement(provider, HtmlMock.empty()));
    tabInformation.setIsShowingConversions(true);

    // Act
    tabInformation.flipAllConversions();

    // Assert
    expect(tabInformation.isShowingConversions).toBe(false);
  });

  it(`is not showing hovered conversions after flip`, () => {
    // Setup
    const provider = useMockContainer();
    provider.convertHoverShortcut.setValue("Shift");
    const tabInfo = provider.tabState;
    const element = new CurrencyElement(provider, HtmlMock.empty());
    element.setupListener();
    tabInfo.conversions.push(element);
    element.isHovered = true;
    tabInfo.setIsShowingConversions(true);

    // Act
    tabInfo.flipHovered();

    // Assert
    expect(element.isShowingConversion).toBe(false);
  });
});