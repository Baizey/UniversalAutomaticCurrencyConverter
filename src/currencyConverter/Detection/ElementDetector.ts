import {Stateful} from '@baizey/dependency-injection'
import {BackgroundMessenger, InfrastructureDiTypes} from '../../infrastructure'
import {BackendApiDiTypes} from '../BackendApi/BackendApi'
import {CurrencyDiTypes, CurrencyElement} from '../Currency'
import {ActiveLocalizationDi} from '../Localization/ActiveLocalization'
import {ITextDetector, TextDetectorDi} from './TextDetector'
import {PseudoDom, PseudoDomDi} from "./pseudoDom";
import {PseudoDetector, PseudoDetectorDi} from "./PseudoDetector";
import {log} from "../../di";

export type ElementDetectorDi = { elementDetector: ElementDetector }
type ElementDetectorDep =
    InfrastructureDiTypes
    & BackendApiDiTypes
    & ActiveLocalizationDi
    & TextDetectorDi
    & CurrencyDiTypes
    & PseudoDomDi
    & PseudoDetectorDi

export class ElementDetector {
    private readonly textDetector: ITextDetector
    private readonly currencyElement: Stateful<HTMLElement, CurrencyElement>
    private readonly backgroundMessenger: BackgroundMessenger;
    private readonly pseudoDomFactory: Stateful<HTMLElement, PseudoDom>;
    private pseudoDetector: PseudoDetector;

    constructor({
                    textDetector,
                    currencyElement,
                    pseudoDom,
                    pseudoDetector,
                    backgroundMessenger,
                }: ElementDetectorDep) {
        this.pseudoDomFactory = pseudoDom
        this.pseudoDetector = pseudoDetector;
        this.backgroundMessenger = backgroundMessenger
        this.currencyElement = currencyElement
        this.textDetector = textDetector
    }

    async find(element: HTMLElement): Promise<CurrencyElement[]> {
        if (!this.detect(element)) return []
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
            const ids = this.pseudoDetector.find(dom.root, {})
            const elements = ids.map(id => dom.element(id)).map(e => e) as HTMLElement[]
            return elements.filter(e => dom.isNotWatched(e))
        }
    }

    private detect(element: HTMLElement) {
        return this.textDetector.detect(element.textContent || '')
    }
}