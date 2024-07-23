import {propertyOf, singleton} from '@baizey/dependency-injection'
import type {ElementDetectorDi} from './ElementDetector'
import {ElementDetector} from './ElementDetector'
import type {SiteAllowanceDi} from './SiteAllowance'
import {SiteAllowance} from './SiteAllowance'
import type {TextDetectorDi} from './TextDetector'
import {TextDetector} from './TextDetector'
import {PseudoDom, PseudoDomDi} from "./pseudoDom";
import {PseudoDetector, PseudoDetectorDi} from "./PseudoDetector";
import {factory} from "../../infrastructure/DiFactory";
import {PseudoFlat, PseudoFlatDi} from "./PseudoFlat";
import {TextFlat, TextFlatDi} from "./TextFlat";

export {ElementDetector, SiteAllowance, TextDetector}
export type{TextDetectorDi} from './TextDetector'
export type{ElementDetectorDi} from './ElementDetector'
export type {ISiteAllowance, SiteAllowanceDi} from './SiteAllowance'

export type DetectionDiTypes =
    SiteAllowanceDi
    & TextDetectorDi
    & ElementDetectorDi
    & PseudoDetectorDi
    & PseudoDomDi
    & PseudoFlatDi
    & TextFlatDi

const {
    pseudoDom,
    pseudoDetector,
    siteAllowance,
    textDetector,
    elementDetector,
    pseudoFlat,
    textFlat
} = propertyOf<DetectionDiTypes>()


export const DetectionDi = {
    [siteAllowance]: singleton(SiteAllowance),
    [textDetector]: singleton(TextDetector),
    [pseudoDetector]: singleton(PseudoDetector),
    [elementDetector]: singleton(ElementDetector),
    [pseudoDom]: factory<HTMLElement, PseudoDom>(PseudoDom),
    [pseudoFlat]: singleton(PseudoFlat),
    [textFlat]: singleton(TextFlat),
}