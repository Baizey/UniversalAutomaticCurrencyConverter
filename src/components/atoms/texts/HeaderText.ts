import styled from 'styled-components'
import { basicStyle } from '../Basics'
import { TextSize } from '../Constants'

export const HeaderText = styled.label( ( props ) => ( {
	...basicStyle( props ),
	width: '100%',
	display: 'inline-block',
	fontSize: TextSize.pixel,
	color: props.theme.headerText,
	fontWeight: 600,
} ) )
