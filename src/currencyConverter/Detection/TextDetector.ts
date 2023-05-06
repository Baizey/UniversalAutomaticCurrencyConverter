import {IActiveLocalization} from '../Localization'
import {ActiveLocalizationDi} from '../Localization/ActiveLocalization'
import {CurrencyRegex, RegexResult} from './CurrencyRegex'

export interface ITextDetector {
    detect(text: string): boolean;

    find(text: string): RegexResult[];
}

export type TextDetectorDi = { textDetector: TextDetector }

type TextDetectorDep = ActiveLocalizationDi

export class TextDetector implements ITextDetector {
    private localization: IActiveLocalization

    constructor({activeLocalization,}: TextDetectorDep) {
        this.localization = activeLocalization
    }

    find(text: string): RegexResult[] {
        const result: RegexResult[] = []
        const regex = new CurrencyRegex(text)
        while (true) {
            const r = regex.next()
            if (!r) return result
            if (this.isCurrency(r)) result.push(r)
        }
    }

    detect(text: string) {
        const regex = new CurrencyRegex(text)

        if (!regex.test()) return false

        while (true) {
            const result = regex.next()

            if (!result) return false

            if (this.isCurrency(result)) return true
        }
    }

    private isCurrency(data: { currencies: string[] }): boolean {
        const currencies = data.currencies.map((e) =>
            this.localization.parseCurrency(e),
        )
        const currency = currencies.filter((e) => e)[0]
        return !!currency
    }
}
