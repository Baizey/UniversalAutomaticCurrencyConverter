import React, { PropsWithChildren } from 'react'
import { ConfigurationProvider, useConfiguration } from './ConfigurationProvider'
import { FilterProvider, useFilter } from './FilterProvider'
import { UACCThemeProvider, useThemeChanger } from './ThemeProvider'

export { useThemeChanger, useFilter, useConfiguration }

type Props = {}

export function HookProvider( { children }: PropsWithChildren<Props> ) {
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