import { ServiceCollection, singleton } from 'sharp-dependency-injection'
import { ElementDetector, ElementDetectorDi } from './ElementDetector'
import { SiteAllowance, SiteAllowanceDi } from './SiteAllowance'
import { TextDetector, TextDetectorDi } from './TextDetector'

export { TextDetector, ITextDetector } from './TextDetector'
export { ElementDetector, IElementDetector } from './ElementDetector'
export { SiteAllowance, ISiteAllowance } from './SiteAllowance'

export type DetectionDi = SiteAllowanceDi & TextDetectorDi & ElementDetectorDi

export const addDetectionDi = <T>( services: ServiceCollection<T> ) => services.add( {
	siteAllowance: singleton( SiteAllowance ),
	textDetector: singleton( TextDetector ),
	elementDetector: singleton( ElementDetector ),
} )