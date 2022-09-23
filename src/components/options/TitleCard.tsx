import * as React from 'react'
import styled from 'styled-components'
import { useProvider } from '../../di'
import { ThemeProps } from '../../infrastructure'
import { FooterText } from '../atoms'
import { OptionRow, OptionsSection, SettingOption } from './Shared'

export function TitleCard() {
	const { browser } = useProvider()
	return (
		<OptionsSection title={ browser.extensionName }>
			<OptionRow key="footer-option">
				<SettingOption title="Options page">
					<Footer>{ `Version ${ browser.extensionVersion } created by ${ browser.author }` }</Footer>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}

const Footer = styled( FooterText )`
  color: ${ ( props: ThemeProps ) => props.theme.footerText };
`
