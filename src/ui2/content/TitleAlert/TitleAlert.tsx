import { useProvider } from '../../../di'
import { Div, useTheme, WithChildren } from '../../atoms'

export function TitleAlert() {
	const { browser } = useProvider()
	return (
		<Container>
			<MenuTitle>{ browser.extensionName }</MenuTitle>
		</Container>
	)
}

const Container = ( props: WithChildren ) => <Div { ...props } style={ {
	paddingTop: '10px',
	paddingBottom: '10px',
	borderWidth: '1px',
	backgroundColor: useTheme().containerBorder,
	color: useTheme().headerText,
	textAlign: 'center',
	height: 'fit-content',
} }/>

const MenuTitle = ( props: WithChildren ) => <Div { ...props } style={ {
	color: useTheme().normalText,
	backgroundColor: useTheme().containerBorder,
} }/>