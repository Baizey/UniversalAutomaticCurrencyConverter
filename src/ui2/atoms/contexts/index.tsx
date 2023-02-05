import { WithChildren } from '../core'
import { ConfigurationProvider, useSymbols } from './ConfigurationProvider'
import { FilterProvider, useFilter } from './FilterProvider'
import { UACCThemeProvider, useTheme } from './ThemeProvider'

export { useTheme, useFilter, useSymbols }

export function HookProvider( { children }: WithChildren ) {
	return (
		<ConfigurationProvider>
			<UACCThemeProvider>
				<FilterProvider>
					{ children }
				</FilterProvider>
			</UACCThemeProvider>
		</ConfigurationProvider>
	)
}