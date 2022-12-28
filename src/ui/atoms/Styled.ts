import { Property } from '@storybook/theming/dist/ts3.9/_modules/@emotion-react-node_modules-csstype-index'
import styled from 'styled-components'
import { MyTheme } from '../../infrastructure'
import { Percent, Pixel, ThemeHolder } from './utils'

const basicStyle = ( theme: MyTheme ): any => ( {
	backgroundColor: theme.containerBackground,
	color: theme.normalText,
	borderColor: theme.formBorder,
	transition: 'border-color 0.2s ease-in-out',
	borderStyle: 'solid',
	borderWidth: 0,
	fontFamily: 'Calibri, monospace',
	fontSize: Pixel.medium,
	fontWeight: 500,
	textAlign: 'center',
	textAlignLast: 'center',
	appearance: 'none',
	margin: '0 auto',
	padding: 0,
} )


const inputStyle = ( theme: MyTheme ) => ( {
	...basicStyle( theme ),
	height: Pixel.halfField,
	lineHeight: Pixel.halfField,
	borderBottomWidth: Pixel.one,
	appearance: 'none',
	width: Percent.all,
	'&:hover': { borderColor: theme.formBorderFocus },
	'&:focus': { borderColor: theme.formBorderFocus },
} )

type InputStyleProps = {
	borderHoverColor?: string;
	align?: Property.TextAlign;
}

export const RawNumberInput = styled.input.attrs( {
	type: 'number',
} )<InputStyleProps>( ( p: InputStyleProps & ThemeHolder ) => ( {
	...inputStyle( p.theme ),
	'&[type="number"]': {
		...inputStyle( p.theme ),
		textAlign: p.align,
		textAlignLast: p.align,
		lineHeight: Pixel.fieldWithUnderline,
		height: Pixel.fieldWithUnderline,
		fontSize: Pixel.medium,
		'&:hover': {
			filter: `brightness(110%)`,
			borderColor: p.borderHoverColor || p.theme.formBorderFocus,
		},
		'&:focus': {
			filter: `brightness(110%)`,
			borderColor: p.borderHoverColor || p.theme.formBorderFocus,
			outline: 0,
		},
	},
} ) )

export const RawTextInput = styled.input.attrs( {
	type: 'text',
} )<InputStyleProps>( ( p: InputStyleProps & ThemeHolder ) => ( {
	...inputStyle( p.theme ),
	'&[type="text"]': {
		...inputStyle( p.theme ),
		textAlign: p.align,
		textAlignLast: p.align,
		lineHeight: Pixel.fieldWithUnderline,
		height: Pixel.fieldWithUnderline,
		fontSize: Pixel.medium,
		'&:hover': {
			filter: `brightness(110%)`,
			borderColor: p.borderHoverColor || p.theme.formBorderFocus,
		},
		'&:focus': {
			filter: `brightness(110%)`,
			borderColor: p.borderHoverColor || p.theme.formBorderFocus,
			outline: 0,
		},
	},
} ) )


export const Div = styled.div( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const Ul = styled.ul( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const Li = styled.li( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const Span = styled.span( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const Label = styled.label( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const H2 = styled.h2( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const A = styled.a( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const Option = styled.option( ( props: ThemeHolder ) => basicStyle( props.theme ) )
export const Select = styled.select( ( props: ThemeHolder ) => basicStyle( props.theme ) )
