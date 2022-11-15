import { EffectCallback, useEffect } from 'react'
import { MyTheme } from '../../../infrastructure'

export { Space } from './Space'
export type { SpaceProps } from './Space'
export { Pixel, Percent } from './Size'

export function useEffectOnce( effect: EffectCallback ) {
	useEffect( effect, [] )
}

export function useEffectAlways( effect: EffectCallback ) {
	useEffect( effect )
}

export type ThemeHolder = { theme: MyTheme }