import {BackgroundMessenger, InfrastructureDiTypes} from '../../infrastructure'
import {BackendApiDiTypes} from '../BackendApi/BackendApi'
import {CurrencyDiTypes, CurrencyElement} from '../Currency'
import {ActiveLocalizationDi} from '../Localization/ActiveLocalization'
import {PseudoDom, PseudoDomDi, PseudoDomType} from "./pseudoDom";
import {log} from "../../di";
import {FactoryDi} from "../../infrastructure/DiFactory";
import {TextFlat, TextFlatDi} from "./TextFlat";
import {PseudoFlat, PseudoFlatDi} from "./PseudoFlat";

export type ElementDetectorDi = { elementDetector: ElementDetector }
type ElementDetectorDep =
    InfrastructureDiTypes
    & BackendApiDiTypes
    & ActiveLocalizationDi
    & CurrencyDiTypes
    & PseudoDomDi
    & PseudoFlatDi
    & TextFlatDi

export class ElementDetector {
    private readonly textDetector: TextFlat
    private readonly currencyElement: FactoryDi<HTMLElement, CurrencyElement>
    private readonly backgroundMessenger: BackgroundMessenger;
    private readonly pseudoDomFactory: PseudoDomType;
    private pseudoDetector: PseudoFlat;

    constructor({
                    textFlat,
                    currencyElement,
                    pseudoDom,
                    pseudoFlat,
                    backgroundMessenger,
                }: ElementDetectorDep) {
        this.pseudoDomFactory = pseudoDom
        this.pseudoDetector = pseudoFlat;
        this.backgroundMessenger = backgroundMessenger
        this.currencyElement = currencyElement
        this.textDetector = textFlat
    }

    async find(element: HTMLElement): Promise<CurrencyElement[]> {
        const pseudoDom = this.pseudoDomFactory.create(element)
        const elements = await this.tryFind(pseudoDom)
        elements.forEach(e => e.setAttribute('uacc:watched', 'true'))
        return elements.map(e => this.currencyElement.create(e))
    }

    private async tryFind(dom: PseudoDom): Promise<HTMLElement[]> {
        try {
            return (await this.backgroundMessenger.findCurrencyHolders(dom)).filter(e => dom.isNotWatched(e))
        } catch (e) {
            const error = e as Error
            log.debug(`Service worker unavailable: ${error.message}`)
            log.debug(`Falling back to using UI thread`)
            const ids = this.pseudoDetector.find(dom.root)
            const elements = ids.map(id => dom.element(id)).map(e => e) as HTMLElement[]
            return elements.filter(e => dom.isNotWatched(e))
        }
    }

    private detect(element: HTMLElement) {
        return this.textDetector.detect(element.textContent || '')
    }
}