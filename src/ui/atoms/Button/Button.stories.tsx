import React from 'react'
import { ButtonBase, ErrorButton, PrimaryButton, SecondaryButton, SuccessButton } from './Button'
import { ButtonGrid } from './ButtonGrid'

const args = { isRow: true }
type Args = typeof args

export default {
	title: 'Atoms/Buttons',
	component: ButtonBase,
	args: args,
}

// noinspection JSUnusedGlobalSymbols
export const successButton = ( { isRow }: Args ) => {
	return <ButtonGrid isColumn={ isRow }> <SuccessButton>SuccessButton</SuccessButton> </ButtonGrid>
}
// noinspection JSUnusedGlobalSymbols
export const errorButton = ( { isRow }: Args ) => {
	return <ButtonGrid isColumn={ isRow }> <ErrorButton>ErrorButton</ErrorButton> </ButtonGrid>
}
// noinspection JSUnusedGlobalSymbols
export const primaryButton = ( { isRow }: Args ) => {
	return <ButtonGrid isColumn={ isRow }> <PrimaryButton>PrimaryButton</PrimaryButton> </ButtonGrid>
}
// noinspection JSUnusedGlobalSymbols
export const secondaryButton = ( { isRow }: Args ) => {
	return <ButtonGrid isColumn={ isRow }> <SecondaryButton>SecondaryButton</SecondaryButton> </ButtonGrid>
}
// noinspection JSUnusedGlobalSymbols
export const buttonGrid = ( { isRow }: Args ) => {
	return <ButtonGrid isColumn={ isRow }>
		<SuccessButton>SuccessButton</SuccessButton>
		<SecondaryButton>SecondaryButton</SecondaryButton>
		<PrimaryButton>PrimaryButton</PrimaryButton>
		< ErrorButton> ErrorButton </ErrorButton>
	</ButtonGrid>
}