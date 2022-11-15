import Button from '@storybook/react/dist/ts3.9/demo/Button'
import React from 'react'
import { ButtonBase, ErrorButton, PrimaryButton, SecondaryButton, SuccessButton } from './Button'

const defaultProps = {
	connect: {
		left: true,
		right: true,
		up: true,
		down: true,
	},
	text: 'Button',
}
type Props = typeof defaultProps

export default {
	title: 'Atoms/Buttons',
	component: ButtonBase,
	args: defaultProps,
}

export const successButton = ( { text, ...args }: Props ) => {
	return ( <SuccessButton { ...args }>{ text }</SuccessButton> )
}
export const errorButton = ( { text, ...args }: Props ) => {
	return ( <ErrorButton { ...args }>{ text }</ErrorButton> )
}
export const primaryButton = ( { text, ...args }: Props ) => {
	return ( <PrimaryButton { ...args }>{ text }</PrimaryButton> )
}
export const secondaryButton = ( { text, ...args }: Props ) => {
	return ( <SecondaryButton { ...args }>{ text }</SecondaryButton> )
}