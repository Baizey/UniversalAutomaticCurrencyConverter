import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { Percent, Pixel, ThemeHolder } from '../utils'

export type ButtonProps = {
	connect?: {
		left?: boolean;
		right?: boolean;
		up?: boolean;
		down?: boolean;
	};
};
const cornerRounding = Pixel.of( 5 )
export const ButtonBase = styled.button<ButtonProps & ThemeHolder>( ( props ) => ( {
	color: props.theme.buttonText,
	width: Percent.all,
	cursor: 'pointer',
	padding: `${ Pixel.of( 2 ) } ${ Pixel.of( 25 ) }`,
	'user-select': 'none',
	height: Pixel.field,
	lineHeight: Pixel.field,
	borderWidth: Pixel.one,
	borderBottomLeftRadius: props.connect?.left || props.connect?.down ? '0' : cornerRounding,
	borderBottomRightRadius: props.connect?.right || props.connect?.down ? '0' : cornerRounding,
	borderTopLeftRadius: props.connect?.left || props.connect?.up ? '0' : cornerRounding,
	borderTopRightRadius: props.connect?.right || props.connect?.up ? '0' : cornerRounding,
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