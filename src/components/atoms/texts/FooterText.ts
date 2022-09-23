import styled from 'styled-components'
import { basicStyle } from '../Basics'
import { SmallTextSize } from '../Constants'

export const FooterText = styled.span( ( props ) => ( {
	...basicStyle( props ),
	width: '100%',
	display: 'inline-block',
	fontSize: SmallTextSize.pixel,
	color: props.theme.footerText,
	fontWeight: 400,
} ) )
