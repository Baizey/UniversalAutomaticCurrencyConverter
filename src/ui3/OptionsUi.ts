import {createDiv} from "./Utils";
import {DropdownOption, Input} from "./Input";
import {useProvider} from "../di";

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
}