import { Property } from '@storybook/theming/dist/ts3.9/_modules/@emotion-react-node_modules-csstype-index'
import { ComponentChildren, JSX } from 'preact'
import { JSXInternal } from 'preact/src/jsx'
import { useTheme } from './contexts'
import { createClassName, Percent, Pixel } from './utils'

export interface WithChildren {
	children?: ComponentChildren
	tabIndex?: number
}

export interface WithStyle extends WithChildren {
	style?: Record<string, string | number>
	css?: ( classname: string ) => JSX.Element
}

export interface WithActions<T = any> extends WithChildren {
	onClick?: () => void;
	onKeyDown?: ( event: JSXInternal.TargetedKeyboardEvent<any> ) => void;
	onKeyUp?: ( event: JSXInternal.TargetedKeyboardEvent<any> ) => void;
	onInput?: ( change: T | null | undefined ) => void;
	onMouseOver?: () => void
	onMouseLeave?: () => void
}

export interface WithEverything<T = any> extends WithActions<T>, WithStyle {}

export type Fun<P = any> = ( props: P ) => JSX.Element

type InputStyleProps<T = any> = WithEverything<T> & {
	borderHoverColor?: string;
	align?: Property.TextAlign;
	placeholder?: string
	placeholderColor?: string
}

export const basicStyle = ( classname: string ) => {
	const theme = useTheme()
	return <style jsx>{ `
      .${ classname } {
        background-color: ${ theme.containerBackground };
        color: ${ theme.normalText };
        border-color: ${ theme.formBorder };
        transition: border-color 0.2s ease-in-out;
        border-style: solid;
        border-width: 0;
        font-family: Calibri, monospace;
        font-size: ${ Pixel.medium };
        font-weight: 500;
        text-align: center;
        text-align-last: center;
        appearance: none;
        margin: 0 auto;
        padding: 0;
      }
	` }</style>
}

const inputStyle = ( classname: string, extra: string = '' ) => {
	const theme = useTheme()
	return <>
		{ basicStyle( classname ) }
		<style jsx>{ `
          .${ classname }${ extra } {
            height: ${ Pixel.halfField };
            line-height: ${ Pixel.halfField };
            border-bottom-width: ${ Pixel.one };
            appearance: none;
            width: ${ Percent.all };
          }

          .${ classname }${ extra }:hover {
            border-color: ${ theme.formBorderFocus }
          }

          .${ classname }${ extra }:focus {
            outline: none;
            border-color: ${ theme.formBorderFocus }
          }
		` }</style>
	</>
}

export const Div: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <div { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</div>
}

export const Ul: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <ul { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</ul>
}

export const Li: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <li { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</li>
}

export const Span: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <span { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</span>
}

export const Label: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <label { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</label>
}

export const H2: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <h2 { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</h2>
}

export const A: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <a { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</a>
}

export const Option: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <option { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</option>
}

export const Select: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <select { ...props } className={ classname }>
		{ basicStyle( classname ) }
		{ css && css( classname ) }
		{ children }
	</select>
}

export const RawTextInput: Fun = ( {
	                                   css,
	                                   align = 'center',
	                                   borderHoverColor,
	                                   placeholderColor,
	                                   onInput,
	                                   ...props
                                   }: InputStyleProps<string> ) => {
	const classname = createClassName()
	const theme = useTheme()
	return <input
		{ ...props }
		type="text"
		className={ classname }
		onInput={ e => onInput && onInput( String( ( e.target as any )?.value ) ) }>
		{ inputStyle( classname, `[type="text"]` ) }
		<style jsx>{ `
          .${ classname }[type="text"] {
            text-align: ${ align };
            text-align-last: ${ align };
            line-height: ${ Pixel.fieldWithUnderline };
            height: ${ Pixel.fieldWithUnderline };
            font-size: ${ Pixel.medium };

          }

          .${ classname }[type="text"]::placeholder {
            color: ${ placeholderColor || theme.footerText }
          }

          .${ classname }[type="text"]:hover {
            filter: brightness(110%);
            border-color: ${ borderHoverColor || theme.formBorderFocus };
          }

          .${ classname }[type="text"]:focus {
            filter: brightness(110%);
            border-color: ${ borderHoverColor || theme.formBorderFocus };
            outline: 0;
          }
		` }
		</style>
		{ css && css( classname ) }
	</input>
}
export const RawNumberInput: Fun = ( {
	                                     css,
	                                     placeholderColor,
	                                     align = 'center',
	                                     onInput,
	                                     borderHoverColor,
	                                     ...props
                                     }: InputStyleProps<number> ) => {
	const classname = createClassName()
	const theme = useTheme()
	return <input
		{ ...props }
		type="number"
		className={ classname }
		onInput={ e => {
			onInput && onInput( Number( ( ( e.target as any )?.value ) ) )
		} }>
		{ inputStyle( classname, `[type="number"]` ) }
		<style jsx>{ `
          .${ classname }[type="number"] {
            text-align: ${ align };
            text-align-last: ${ align };
            line-height: ${ Pixel.fieldWithUnderline };
            height: ${ Pixel.fieldWithUnderline };
            font-size: ${ Pixel.medium };
          }

          .${ classname }[type="number"]::placeholder {
            color: ${ placeholderColor || theme.footerText }
          }

          .${ classname }[type="number"]:hover {
            filter: brightness(110%);
            border-color: ${ borderHoverColor || theme.formBorderFocus };
          }

          .${ classname }[type="number"]:focus {
            filter: brightness(110%);
            border-color: ${ borderHoverColor || theme.formBorderFocus };
            outline: 0;
          }
		` }</style>
		{ css && css( classname ) }
	</input>
}

export const RawRangeInput: Fun = ( { css, onInput, ...props }: InputStyleProps<number> ) => {
	const classname = createClassName()
	return <input
		{ ...props }
		type="range"
		className={ classname }
		onInput={ e => onInput && onInput( Number( ( e.target as any )?.value ) ) }>
		{ inputStyle( classname, `[type="range"]` ) }
		<style jsx>{ `
          .${ classname } {
            border-bottom-width: 0;
          }

          .${ classname }[type="range"] {
            line-height: ${ Pixel.fieldWithUnderline };
            height: ${ Pixel.fieldWithUnderline };
            font-size: ${ Pixel.medium };
            border-bottom-width: 0;
          }` }
		</style>
		{ css && css( classname ) }
	</input>
}