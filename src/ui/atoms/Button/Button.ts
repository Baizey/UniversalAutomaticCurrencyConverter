import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { Percent, Pixel, ThemeHolder } from '../utils'

export type ButtonProps = {
	text?: string
};

export const ButtonBase = styled.button<ButtonProps & ThemeHolder>( ( props ) => ( {
	color: props.theme.buttonText,
	width: Percent.all,
	cursor: 'pointer',
	padding: `${ Pixel.of( 2 ) } ${ Pixel.of( 25 ) }`,
	'user-select': 'none',
	height: Pixel.field,
	lineHeight: Pixel.field,
	borderWidth: Pixel.one,
	'&:hover': {
		filter: `brightness(${ Percent.of( 90 ) })`,
	},
} ) )

export const ErrorButton = styled( ButtonBase )(
	( { theme: { errorBackground } }: ThemeProps ) => ( {
		backgroundColor: errorBackground,
	} ),
)
export const PrimaryButton = styled( ButtonBase )(
	( { theme: { buttonPrimaryBackground } }: ThemeProps ) => ( {
		backgroundColor: buttonPrimaryBackground,
	} ),
)
export const SecondaryButton = styled( ButtonBase )(
	( { theme: { buttonSecondaryBackground } }: ThemeProps ) => ( {
		backgroundColor: buttonSecondaryBackground,
	} ),
)

export const SuccessButton = styled( ButtonBase )(
	( { theme: { successBackground } }: ThemeProps ) => ( {
		backgroundColor: successBackground,
	} ),
)