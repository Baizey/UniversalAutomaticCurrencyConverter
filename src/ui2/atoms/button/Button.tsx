import { useTheme } from '../contexts'
import { basicStyle, WithActions, WithStyle } from '../core'
import { createClassName, Percent, Pixel } from '../utils'

type ButtonProps = { text?: string } & WithActions

export const ButtonBase = ( { css, text, children, style, ...props }: ButtonProps & WithStyle ) => {
	const classname = createClassName()
	return <button
		{ ...props }
		className={ classname }
		style={ {
			color: useTheme().buttonText,
			width: Percent.all,
			cursor: 'pointer',
			padding: `${ Pixel.of( 2 ) } ${ Pixel.of( 25 ) }`,
			userSelect: 'none',
			height: Pixel.field,
			lineHeight: Pixel.field,
			borderWidth: Pixel.one,
			...style,
		} }>
		{ basicStyle( classname ) }
		<style jsx>{ `
          .${ classname }:hover {
            filter: brightness(${ Percent.of( 90 ) })
          }
		` }</style>
		{ css && css( classname ) }
		{ text ?? children }
	</button>
}

export const ErrorButton = ( props: ButtonProps ) =>
	<ButtonBase { ...props } style={ { backgroundColor: useTheme().errorBackground } }/>
export const PrimaryButton = ( props: ButtonProps ) =>
	<ButtonBase { ...props } style={ { backgroundColor: useTheme().buttonPrimaryBackground } }/>
export const SecondaryButton = ( props: ButtonProps ) =>
	<ButtonBase { ...props } style={ { backgroundColor: useTheme().buttonSecondaryBackground } }/>
export const SuccessButton = ( props: ButtonProps ) =>
	<ButtonBase { ...props } style={ { backgroundColor: useTheme().successBackground } }/>