import { useProvider } from '../../../di'
import { FooterText } from '../../atoms'
import { OptionRow, OptionsSection, SettingOption } from '../shared'

export function TitleCard() {
	const { browser } = useProvider()
	return (
		<OptionsSection title={ browser.extensionName }>
			<OptionRow key="footer-option">
				<SettingOption title="Options page">
					<FooterText>{ `Version ${ browser.extensionVersion } created by ${ browser.author }` }</FooterText>
				</SettingOption>
			</OptionRow>
		</OptionsSection>
	)
}