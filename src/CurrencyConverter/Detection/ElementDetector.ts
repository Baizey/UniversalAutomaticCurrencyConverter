import {ITextDetector} from "./TextDetector";
import {Configuration} from "../../Infrastructure";
import {IBackendApi} from "../BackendApi";
import {CurrencyElement} from "../Currency/CurrencyElement";
import {IActiveLocalization} from "../Localization";
import {DependencyProvider} from '../../Infrastructure/DependencyInjection/DependencyInjector';

export interface IElementDetector {

    find(element: HTMLElement): CurrencyElement[]

    detect(element: HTMLElement): boolean
}

export class ElementDetector implements IElementDetector {
    private readonly detector: ITextDetector;
    private readonly backendApi: IBackendApi;
    private readonly config: Configuration;
    private localization: IActiveLocalization;

    constructor({configuration, backendApi, textDetector, activeLocalization}: DependencyProvider) {
        this.config = configuration;
        this.localization = activeLocalization;
        this.backendApi = backendApi;
        this.detector = textDetector;
    }

    find(element: HTMLElement) {
        if (this.detectConverterTagUp(element))
            return []
        if (!this.detect(element))
            return []

        let result: CurrencyElement[] = []
        for (let i = 0; i < element.children.length; i++)
            // @ts-ignore
            result = result.concat(this.find(element.children[i]))

        if (result.length > 0)
            return result;

        if (this.detectConverterTagDown(element))
            return []

        element.setAttribute('uacc:watched', 'true')
        return [new CurrencyElement(element, this.config, this.backendApi, this.detector, this.localization)]
    }

    detect(element: HTMLElement) {
        return this.detector.detect(element.innerText)
    }

    private detectConverterTagDown(element: Element): boolean {
        if (element.hasAttribute('uacc:watched')) return true;
        for (let i = 0; i < element.children.length; i++) {
            if (this.detectConverterTagDown(element.children[0]))
                return true;
        }
        return false;
    }

    private detectConverterTagUp(element: Element | null): boolean {
        if (!element) return false;
        if (element.hasAttribute('uacc:watched')) return true;
        return this.detectConverterTagUp(element.parentElement)
    }

}