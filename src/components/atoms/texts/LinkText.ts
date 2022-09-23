import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { basicStyle } from '../Basics'

export type LinkProps = { href: string; target: string } & ThemeProps;
export const Link = styled.a<LinkProps>( ( props ) => ( {
	...basicStyle( props ),
	cursor: 'pointer',
	color: props.theme.link,
	textDecoration: 'none',
	width: '100%',
	'&:hover': {
		color: props.theme.linkHover,
	},
} ) )
