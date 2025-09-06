import {createDiv} from "./Utils";
import {DropdownOption, Input} from "./Input";
import {useProvider} from "../di";
import {LoggingSettingType} from "../infrastructure/Configuration/setting";
import {ThemeHandler} from "./ThemeHandler";

type OptionsSectionProps = {
    title: string,
}

export class OptionsUi {

    static createOptionsBackground(): HTMLDivElement {
        const div = createDiv()
        div.className = "uacc-options-background-wrapper";
        return div
    }

    static createOptionsSection({title}: OptionsSectionProps): HTMLDivElement {
        const div = createDiv()
        div.className = "uacc-options-background-section";

        const header = document.createElement("h1");
        header.className = "uacc-options-section-header";
        header.textContent = title;
        div.appendChild(header);

        return div
    }

    static createFilterOptionsSection(updateFilter: (v: string) => void) {
        const searchSection = OptionsUi.createOptionsSection({title: "Search for options"});
        searchSection.appendChild(Input.createWrapper({
            title: "Search for what you need",
            subtitle: "Leave empty to show all options",
            value: Input.createTextInput({
                placeholder: "Search for what you want to find here...",
                value: "",
                onChange: updateFilter
            })
        }));
        return searchSection
    }

    static createCurrencyOptionSection(symbols: Record<string, string>) {
        const {config} = useProvider()
        const currencySection = OptionsUi.createOptionsSection({title: 'Currency'});
        const currencyOptions: DropdownOption[] = Object.entries(symbols)
            .map(([symbol, value]) => ({label: value, value: symbol}))
        const initialValue = config.currencyTag.convertTo.value
        currencySection.appendChild(Input.createWrapper({
            title: "Convert to",
            value: Input.createDropdown({
                value: {value: initialValue, label: symbols[initialValue]},
                options: currencyOptions,
                onChange: v => {
                    config.currencyTag.convertTo.setAndSaveValue(v.value);

                }
            })
        }));
        currencySection.appendChild(Input.createWrapper({
            title: "Convert pages automatically on load",
            value: Input.createToggle({
                value: config.meta.useAutoConvertOnPageLoad.value,
                onChange: v => {
                    config.meta.useAutoConvertOnPageLoad.setAndSaveValue(v);
                }
            })
        }));
        return currencySection
    }

    static createLocalizationOptionSection(symbols: Record<string, string>) {
        const {config} = useProvider()
        const krone = [
            {value: 'SEK', label: symbols['SEK']},
            {value: 'DKK', label: symbols['DKK']},
            {value: 'NOK', label: symbols['NOK']},
            {value: 'ISK', label: symbols['ISK']},
            {value: 'CZK', label: symbols['CZK']},]
        const yen = [
            {value: 'CNY', label: symbols['CNY']},
            {value: 'JPY', label: symbols['JPY']},]
        const dollar = [
            {value: 'USD', label: symbols['USD']},
            {value: 'CAD', label: symbols['CAD']},
            {value: 'AUD', label: symbols['AUD']},
            {value: 'MXN', label: symbols['MXN']},
            {value: 'NZD', label: symbols['NZD']},
            {value: 'SGP', label: symbols['SGP']},
            {value: 'HKD', label: symbols['HKD']},
            {value: 'ARS', label: symbols['ARS']},]
        const initYen = config.localization.yen.value
        const initKrone = config.localization.krone.value
        const initDollar = config.localization.dollar.value
        const localizationSection = OptionsUi.createOptionsSection({title: 'Preferred Localization'});
        const yenOption = Input.createWrapper({
            title: "Yen",
            value: Input.createDropdown({
                value: {value: initYen, label: symbols[initYen]},
                options: yen,
                onChange: v => {
                    config.localization.yen.setAndSaveValue(v.value);
                }
            })
        })
        const kroneOption = Input.createWrapper({
            title: "Krone",
            value: Input.createDropdown({
                value: {value: initKrone, label: symbols[initKrone]},
                options: krone,
                onChange: v => {
                    config.localization.krone.setAndSaveValue(v.value);
                }
            })
        })
        const dollarOption = Input.createWrapper({
            title: "Dollar",
            value: Input.createDropdown({
                value: {value: initDollar, label: symbols[initDollar]},
                options: dollar,
                onChange: v => {
                    config.localization.dollar.setAndSaveValue(v.value);
                }
            })
        })
        localizationSection.appendChild(Input.createWrapperRow({
            values: [dollarOption, kroneOption, yenOption]
        }))
        localizationSection.appendChild(Input.createWrapper({
                title: "Show localization alerts",
                value: Input.createToggle({
                    value: config.localization.usingAlert.value,
                    onChange: v => {
                        config.localization.usingAlert.setAndSaveValue(v);
                    }
                })
            })
        );
        return localizationSection
    }

    static createShortcutsOptionSection() {
        const {config} = useProvider()
        const section = OptionsUi.createOptionsSection({title: 'Keyboard shortcuts'});

        const hoveredShortcut = Input.createWrapper({
            title: "Convert-hovered shortcut",
            subtitle: 'Left-click to clear, then click your desired shortcut key',
            value: Input.createShortcutInput({
                value: config.qualityOfLife.keyPressOnHoverFlipConversion.value,
                onChange: (v) => config.qualityOfLife.keyPressOnHoverFlipConversion.setAndSaveValue(v)
            })
        })
        const allShortcut = Input.createWrapper({
            title: "Convert-all shortcut",
            subtitle: 'Left-click to clear, then click your desired shortcut key',
            value: Input.createShortcutInput({
                value: config.qualityOfLife.keyPressOnAllFlipConversion.value,
                onChange: (v) => config.qualityOfLife.keyPressOnAllFlipConversion.setAndSaveValue(v)
            })
        })
        const leftClickToggle = Input.createWrapper({
            title: 'Convert prices by left clicking',
            value: Input.createToggle({
                value: config.qualityOfLife.leftClickOnHoverFlipConversion.value,
                onChange: (v) => config.qualityOfLife.leftClickOnHoverFlipConversion.setAndSaveValue(v)
            })
        })

        const hoverToggle = Input.createWrapper({
            title: 'Convert prices on hover over',
            value: Input.createToggle({
                value: config.qualityOfLife.onHoverFlipConversion.value,
                onChange: (v) => config.qualityOfLife.onHoverFlipConversion.setAndSaveValue(v)
            })
        })

        section.appendChild(Input.createWrapperRow({values: [hoveredShortcut, allShortcut]}))
        section.appendChild(Input.createWrapperRow({values: [leftClickToggle, hoverToggle]}))
        return section
    }

    static createMiscOptionSection() {
        const {config} = useProvider()
        const section = OptionsUi.createOptionsSection({title: 'Misc'});

        const loggingOptions: DropdownOption[] = [
            {value: LoggingSettingType.nothing, label: 'Nothing'},
            {value: LoggingSettingType.error, label: 'Error'},
            {value: LoggingSettingType.info, label: 'Info'},
            {value: LoggingSettingType.debug, label: 'Everything'},
            {value: LoggingSettingType.profile, label: 'Everything with profiling'},
        ]
        const loggingWrapper = Input.createWrapper({
            title: 'Allowed logging level',
            subtitle: 'You can see logs via F12 > Console',
            value: Input.createDropdown({
                value: {value: config.meta.logging.value as unknown as string, label: '' + config.meta.logging.value},
                options: loggingOptions,
                onChange: (opt) => {
                    // opt.value is of type string; cast to LoggingSettingType
                    config.meta.logging.setAndSaveValue(opt.value as unknown as LoggingSettingType)
                }
            })
        })

        const bracketsWrapper = Input.createWrapper({
            title: 'Display conversion in brackets beside original price',
            value: Input.createToggle({
                value: config.currencyTag.showConversionInBrackets.value,
                onChange: (v) => config.currencyTag.showConversionInBrackets.setAndSaveValue(v)
            })
        })

        section.appendChild(Input.createWrapperRow({values: [loggingWrapper, bracketsWrapper]}))
        return section
    }

    static createThemeOptionSection() {
        const {config} = useProvider()
        const section = OptionsUi.createOptionsSection({title: 'Theme'});

        const themeKeys = ThemeHandler.getThemeNames()
        const options: DropdownOption[] = themeKeys.map(k => ({
            value: k,
            label: k.substring(0, 1).toUpperCase() +
                k.substring(1).replace(/[A-Z]/g, e => ` ${e}`)
        }))
        const initial = config.meta.colorTheme.value
        const selected = options.find(k => k.value === initial) ?? options[0]
        const themeDropdown = Input.createWrapper({
            title: 'Color theme',
            value: Input.createDropdown({
                value: selected,
                options: options,
                onChange: (opt) => {
                    config.meta.colorTheme.setAndSaveValue(opt.value as any)
                    ThemeHandler.updateTheme(opt.value)
                }
            })
        })

        section.appendChild(Input.createWrapperRow({values: [themeDropdown]}))
        return section
    }
}