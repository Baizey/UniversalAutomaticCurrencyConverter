import styled from 'styled-components'
import { A, H2, Label, Span } from '../Styled'
import { Percent, Pixel, ThemeHolder } from '../utils'

export const FooterText = styled( Span )<ThemeHolder>( ( props ) => ( {
	color: props.theme.footerText,
	fontWeight: 400,
	width: Percent.all,
	fontSize: Pixel.small,
	display: 'inline-block',
} ) )

export const HeaderText = styled( Label )<ThemeHolder>( ( props ) => ( {
	color: props.theme.headerText,
	fontWeight: 600,
	width: Percent.all,
	display: 'inline-block',
	fontSize: Pixel.medium,
} ) )

export const Text = styled( Span )<ThemeHolder>( ( props ) => ( {
	width: Percent.all,
	fontSize: Pixel.medium,
	display: 'inline-block',
} ) )

export const Title = styled( H2 )<ThemeHolder>( ( props ) => ( {
	color: props.theme.titleText,
	fontWeight: 700,
	fontSize: Pixel.large,
	height: Pixel.field,
	lineHeight: Pixel.field,
	width: Percent.all,
} ) )

export type LinkProps = { href: string; target: string };
export const Link = styled( A )<LinkProps & ThemeHolder>( ( props ) => ( {
	color: props.theme.link,
	cursor: 'pointer',
	textDecoration: 'none',
	width: Percent.all,
	'&:hover': {
		color: props.theme.linkHover,
	},
} ) )