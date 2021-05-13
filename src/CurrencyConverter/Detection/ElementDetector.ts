import {ITextDetector} from "./TextDetector";
import {Configuration, ILogger} from "../../Infrastructure";
import {IBackendApi} from "../BackendApi";
import {CurrencyElement} from "../Currency/CurrencyElement";
import {IActiveLocalization} from "../Localization";
import {DependencyProvider} from '../../Infrastructure/DependencyInjection';

export interface IElementDetector {

    find(element: HTMLElement): CurrencyElement[]

    detect(element: HTMLElement): boolean
}

export class ElementDetector implements IElementDetector {
    private readonly textDetector: ITextDetector;
    private readonly backendApi: IBackendApi;
    private readonly config: Configuration;
    private readonly localization: IActiveLocalization;
    private readonly provider: DependencyProvider;
    private readonly logger: ILogger;

    constructor({configuration, provider, backendApi, textDetector, activeLocalization, logger}: DependencyProvider) {
        this.provider = provider;
        this.logger = logger;
        this.config = configuration;
        this.localization = activeLocalization;
        this.backendApi = backendApi;
        this.textDetector = textDetector;
    }

    find(element: HTMLElement) {
        if(!element) return [];

        if(this.detectConverterTagUp(element)) return []

        if(!this.detect(element)) return []

        let result: CurrencyElement[] = []
        for (let i = 0; i < element.children.length; i++)
            result = result.concat(this.find(element.children[i] as HTMLElement))

        if(result.length > 0)
            return result;

        if(this.isElementUnavailable(element, 3)) return []

        element.setAttribute('uacc:watched', 'true')
        return [new CurrencyElement(this.provider, element)]
    }

    detect(element: HTMLElement) {
        return this.textDetector.detect(element.innerText)
    }

    private isElementUnavailable(element: Element, maxDepth: number): boolean {
        if(maxDepth < 0) return true;
        if(element.hasAttribute('uacc:watched')) return true;
        for (let i = 0; i < element.children.length; i++) {
            if(this.isElementUnavailable(element.children[i], maxDepth - 1))
                return true;
        }
        return false;
    }

    private detectConverterTagUp(element: Element | null): boolean {
        if(!element) return false;
        if(element.hasAttribute('uacc:watched')) return true;
        return this.detectConverterTagUp(element.parentElement)
    }

}