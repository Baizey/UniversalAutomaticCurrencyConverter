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

export const joinStyles = ( ...styles: ( JSX.Element | undefined )[] ) => {
	return <style jsx>{ `${
		styles.filter( e => e )
		      .flatMap( e => e?.props.children )
		      .join( '\n' )
	}` }</style>
}

export const basicStyle = ( classname: string ) => {
	const theme = useTheme()
	return <style jsx>{ `
      .${ classname } {
        background-color: ${ theme.containerBackground };
        color: ${ theme.normalText };
        border-color: ${ theme.formBorder };
        transition: border-color 0.2s ease-in-out;
        border: 0 solid ${ theme.formBorder };
        font-family: Calibri, monospace;
        font-size: ${ Pixel.medium };
        font-weight: 500;
        text-align: center;
        text-align-last: center;
        appearance: none;
        margin: 0 auto;
        padding: 0;
        border-radius: 0;
        box-shadow: none;
        outline: none;
        vertical-align: auto;
      }

      .${ classname }:focus {
        outline: none;
        box-shadow: none;
      }
	` }</style>
}

const inputStyle = ( classname: string ) => {
	const theme = useTheme()
	return <style jsx>{ `
      .${ classname } {
        height: ${ Pixel.halfField };
        line-height: ${ Pixel.halfField };
        border-bottom-width: ${ Pixel.one };
        appearance: none;
        width: ${ Percent.all };
      }

      .${ classname }:placeholder {
        color: ${ theme.normalText };
      }

      .${ classname }:hover {
        border-color: ${ theme.formBorderFocus };
      }

      .${ classname }:focus {
        outline: none;
        background-color: ${ theme.containerBackground };
        border-color: ${ theme.formBorderFocus };
      }
	` }</style>
}

export const Div: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <div { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
	</div>
}

export const Ul: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <ul { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
	</ul>
}

export const Li: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <li { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
	</li>
}

export const Span: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <span { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
		</span>
}

export const Label: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <label { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
	</label>
}

export const H2: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <h2 { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
	</h2>
}

export const A: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <a { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
	</a>
}

export const Option: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <option { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
		{ children }
	</option>
}

export const Select: Fun = ( { css, children, ...props }: WithEverything ) => {
	const classname = createClassName()
	return <select { ...props } className={ classname }>
		{ joinStyles( basicStyle( classname ), css && css( classname ) ) }
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
	const type = `${ classname }[type="text"]`
	const theme = useTheme()
	return <input
		{ ...props }
		type="text"
		className={ classname }
		onInput={ e => onInput && onInput( String( ( e.target as any )?.value ) ) }>
		{ joinStyles(
			basicStyle( type ),
			inputStyle( type ),
			<style jsx>{ `
              .${ type } {
                text-align: ${ align };
                text-align-last: ${ align };
                line-height: ${ Pixel.fieldWithUnderline };
                height: ${ Pixel.fieldWithUnderline };
                font-size: ${ Pixel.medium };

              }

              .${ type }::placeholder {
                color: ${ placeholderColor || theme.footerText }
              }

              .${ type }:hover {
                filter: brightness(110%);
                border-color: ${ borderHoverColor || theme.formBorderFocus };
              }

              .${ type }:focus {
                filter: brightness(110%);
                border-color: ${ borderHoverColor || theme.formBorderFocus };
                outline: 0;
              }
			` }
			</style>,
			css && css( type ) ) }
	</input>
}
export const RawNumberInput: Fun = ( {
	                                     css,
	                                     placeholderColor,
	                                     align = 'center',
	                                     onInput,
	                                     borderHoverColor,
	                                     ...props
                                     }: InputStyleProps<number>,
) => {
	const classname = createClassName()
	const type = `${ classname }[type="number"]`
	const theme = useTheme()
	return <input
		{ ...props }
		type="number"
		className={ classname }
		onInput={ e => {
			onInput && onInput( Number( ( ( e.target as any )?.value ) ) )
		} }>
		{ joinStyles(
			basicStyle( type ),
			inputStyle( type ),
			<style jsx>{ `
              .${ type } {
                text-align: ${ align };
                text-align-last: ${ align };
                line-height: ${ Pixel.fieldWithUnderline };
                height: ${ Pixel.fieldWithUnderline };
                font-size: ${ Pixel.medium };
              }

              .${ type }::placeholder {
                color: ${ placeholderColor || theme.footerText }
              }

              .${ type }:hover {
                filter: brightness(110%);
                border-color: ${ borderHoverColor || theme.formBorderFocus };
              }

              .${ type }:focus {
                filter: brightness(110%);
                border-color: ${ borderHoverColor || theme.formBorderFocus };
                outline: 0;
              }
			` }</style>,
			css && css( type ),
		) }
	</input>
}

export const RawRangeInput: Fun = ( { css, onInput, ...props }: InputStyleProps<number>,
) => {
	const classname = createClassName()
	const type = `${ classname }[type="range"]`
	return <input
		{ ...props }
		type="range"
		className={ classname }
		onInput={ e => onInput && onInput( Number( ( e.target as any )?.value ) ) }>
		{ joinStyles(
			basicStyle( type ),
			inputStyle( type ),
			<style jsx>{ `
              .${ type } {
                border-bottom-width: 0;
              }

              .${ type } {
                line-height: ${ Pixel.fieldWithUnderline };
                height: ${ Pixel.fieldWithUnderline };
                font-size: ${ Pixel.medium };
                border-bottom-width: 0;
              }` }
			</style>,
			css && css( type ),
		) }
	</input>
}