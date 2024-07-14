import {propertyOf, singleton} from '@baizey/dependency-injection'
import {ActiveLocalization, ActiveLocalizationDi} from './ActiveLocalization'
import {CurrencyLocalization, CurrencyLocalizationDi, CurrencyLocalizationProps} from './CurrencyLocalization'
import {factory} from "../../infrastructure/DiFactory";

export {ActiveLocalization} from './ActiveLocalization'
export type {IActiveLocalization} from './ActiveLocalization'
export {Localizations} from './Localization'

export type LocalizationDiTypes = ActiveLocalizationDi & CurrencyLocalizationDi

const {
    activeLocalization,
    currencyLocalization,
} = propertyOf<LocalizationDiTypes>()

export const LocalizationDi = {
    [activeLocalization]: singleton(ActiveLocalization),
    [currencyLocalization]: factory<CurrencyLocalizationProps, CurrencyLocalization>(CurrencyLocalization),
}