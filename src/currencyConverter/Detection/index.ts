import {propertyOf, singleton} from '@baizey/dependency-injection'
import type {ElementDetectorDi} from './ElementDetector'
import {ElementDetector} from './ElementDetector'
import type {SiteAllowanceDi} from './SiteAllowance'
import {SiteAllowance} from './SiteAllowance'
import type {TextDetectorDi} from './TextDetector'
import {TextDetector} from './TextDetector'
import {PseudoDom, PseudoDomDi} from "./pseudoDom";
import {PseudoDetector, PseudoDetectorDi} from "./PseudoDetector";
import {MagicDetector, MagicDetectorDi} from "./magicDetector";
import {factory} from "../../infrastructure/DiFactory";

export {ElementDetector, SiteAllowance, TextDetector}
export type{ITextDetector, TextDetectorDi} from './TextDetector'
export type{ElementDetectorDi} from './ElementDetector'
export type {ISiteAllowance, SiteAllowanceDi} from './SiteAllowance'

export type DetectionDiTypes =
    SiteAllowanceDi
    & TextDetectorDi
    & ElementDetectorDi
    & PseudoDetectorDi
    & PseudoDomDi
    & MagicDetectorDi

const {
    magicDetector,
    pseudoDom,
    pseudoDetector,
    siteAllowance,
    textDetector,
    elementDetector,
} = propertyOf<DetectionDiTypes>()


export const DetectionDi = {
    [magicDetector]: singleton(MagicDetector),
    [siteAllowance]: singleton(SiteAllowance),
    [textDetector]: singleton(TextDetector),
    [elementDetector]: singleton(ElementDetector),
    [pseudoDom]: factory<HTMLElement, PseudoDom>(PseudoDom),
    [pseudoDetector]: singleton(PseudoDetector),
}