import React from 'react'
import { FooterText, HeaderText, Link, Text, Title } from './Text'

const defaultProps = {
	text: 'lorem ipsum',
}
type Props = typeof defaultProps

export default {
	title: 'Atoms/Texts',
	component: Text,
	args: defaultProps,
}

export const text = ( { text, ...args }: Props ) => {
	return ( <Text>{ text }</Text> )
}
export const link = ( { text, ...args }: Props ) => {
	return ( <Link href="" target="">{ text }</Link> )
}
export const title = ( { text, ...args }: Props ) => {
	return ( <Title>{ text }</Title> )
}
export const header = ( { text, ...args }: Props ) => {
	return ( <HeaderText>{ text }</HeaderText> )
}
export const footer = ( { text, ...args }: Props ) => {
	return ( <FooterText>{ text }</FooterText> )
}