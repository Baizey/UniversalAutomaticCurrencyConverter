import { useProvider } from '../../../di'
import {  Pixel, useTheme } from '../../atoms'
import {PropsWithChildren} from "preact/compat";
import {Div} from "@baizey/styled-preact";

export function TitleAlert() {
	const { browser } = useProvider()
	return (
		<Container>
			<MenuTitle>{ browser.extensionName }</MenuTitle>
		</Container>
	)
}

const Container = ( props: PropsWithChildren ) => <Div { ...props } style={ {
	borderTopLeftRadius: Pixel.of( 5 ),
	borderTopRightRadius: Pixel.of( 5 ),
	paddingTop: '10px',
	paddingBottom: '10px',
	borderWidth: '1px',
	backgroundColor: useTheme().containerBorder,
	color: useTheme().headerText,
	textAlign: 'center',
	height: 'fit-content',
} }/>

const MenuTitle = ( props: PropsWithChildren ) => <Div { ...props } style={ {
	color: useTheme().normalText,
	backgroundColor: useTheme().containerBorder,
} }/>