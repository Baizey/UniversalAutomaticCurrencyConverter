import { propertyOf, ServiceCollection, singleton } from 'sharp-dependency-injection'
import type { ElementDetectorDi } from './ElementDetector'
import { ElementDetector } from './ElementDetector'
import type { SiteAllowanceDi } from './SiteAllowance'
import { SiteAllowance } from './SiteAllowance'
import type { TextDetectorDi } from './TextDetector'
import { TextDetector } from './TextDetector'

export { ElementDetector, SiteAllowance, TextDetector }
export type{ ITextDetector, TextDetectorDi } from './TextDetector'
export type{ IElementDetector, ElementDetectorDi } from './ElementDetector'
export type { ISiteAllowance, SiteAllowanceDi } from './SiteAllowance'

export type DetectionDi = SiteAllowanceDi & TextDetectorDi & ElementDetectorDi

const {
	siteAllowance,
	textDetector,
	elementDetector,
} = propertyOf<DetectionDi>()

export const addDetectionDi = <T>( services: ServiceCollection<T> ) => services.add( {
	[siteAllowance]: singleton( SiteAllowance ),
	[textDetector]: singleton( TextDetector ),
	[elementDetector]: singleton( ElementDetector ),
} )