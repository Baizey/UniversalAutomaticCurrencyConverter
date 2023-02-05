import { Div, FooterText, HeaderText, Percent, useTheme, WithChildren } from '../../atoms'

export type SettingOptionProps = WithChildren & {
	title: string;
	help?: string;
};

const Container = Div

const Label = ( props: WithChildren ) =>
	<HeaderText{ ...props }
	           style={ {
		           width: Percent.all,
		           textAlign: 'center',
		           display: 'block',
	           } }/>

const Help = ( props: WithChildren ) =>
	<FooterText { ...props }
	            style={ {
		            display: ' block',
		            width: Percent.all,
		            textAlign: 'center',
		            color: useTheme().footerText,
	            } }/>

export function SettingOption( { title, children, help }: SettingOptionProps ) {
	return (
		<Container>
			<Label>{ title }</Label>
			{ children ? children : <></> }
			{ help ? <Help>{ help }</Help> : <></> }
		</Container>
	)
}
