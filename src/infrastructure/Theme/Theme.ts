import { darkTheme } from './DarkTheme'
import { lightTheme } from './LightTheme'
import { MyTheme } from './MyTheme'

export const themes = Object.freeze( { lightTheme, darkTheme } )

export const mapToTheme = ( theme: keyof typeof themes ): MyTheme =>
	themes[theme] || lightTheme
