import { useTheme } from '../contexts'
import { A, Fun, H2, Label, Span, WithStyle } from '../core'
import { Percent, Pixel } from '../utils'

type Props = { text?: string } & WithStyle
export type LinkProps = Props & { href: string; target: string }

export const HeaderText: Fun = ( { text, children, ...props }: Props ) =>
	<Label { ...props }>{ text ?? children }</Label>

export const FooterText = ( { text, children, style, ...props }: Props ) =>
	<Span { ...props } style={ {
		color: useTheme().footerText,
		fontWeight: 400,
		width: Percent.all,
		fontSize: Pixel.small,
		display: 'inline-block',
		...style,
	} }>{ text ?? children }</Span>

export const Text = ( { text, children, style }: Props ) =>
	<Span style={ {
		style: {
			width: Percent.all,
			fontSize: Pixel.medium,
			display: 'inline-block',
			...style,
		},
	} }>{ text ?? children }</Span>

export const Title = ( { text, children, style }: Props ) =>
	<H2 style={ {
		color: useTheme().titleText,
		fontWeight: 700,
		fontSize: Pixel.large,
		height: Pixel.field,
		lineHeight: Pixel.field,
		width: Percent.all,
		...style,
	} }>{ text ?? children }</H2>


export const Link = ( { text, children, style, ...props }: LinkProps ) => {
	return <A  { ...props }
	           css={ ( classname ) => <style jsx>{ `
                 .${ classname }:hover {
                   color: ${ useTheme().linkTextHover }
                 }
	           ` }</style> }
	           style={ {
		           color: useTheme().linkText,
		           cursor: 'pointer',
		           textDecoration: 'none',
		           width: Percent.all,
		           ...style,
	           } }>{ text ?? children }</A>
}