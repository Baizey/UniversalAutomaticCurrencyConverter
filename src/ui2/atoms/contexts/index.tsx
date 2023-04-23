import { ConfigurationProvider, useSymbols } from './ConfigurationProvider'
import { FilterProvider, useFilter } from './FilterProvider'
import { UACCThemeProvider, useTheme } from './ThemeProvider'
import {PropsWithChildren} from "preact/compat";

export { useTheme, useFilter, useSymbols }

export function HookProvider( { children }: PropsWithChildren ) {
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