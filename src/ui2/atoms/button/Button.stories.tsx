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
export const successButton = ( props: Args ) =>
	<ButtonGrid { ...props }> <SuccessButton text="SuccessButton"/> </ButtonGrid>

// noinspection JSUnusedGlobalSymbols
export const errorButton = ( props: Args ) =>
	<ButtonGrid { ...props }> <ErrorButton text="ErrorButton"/> </ButtonGrid>

// noinspection JSUnusedGlobalSymbols
export const primaryButton = ( props: Args ) =>
	<ButtonGrid  { ...props }> <PrimaryButton text="PrimaryButton"/></ButtonGrid>
// noinspection JSUnusedGlobalSymbols

export const secondaryButton = ( props: Args ) =>
	<ButtonGrid  { ...props }> <SecondaryButton text="SecondaryButton"/> </ButtonGrid>

// noinspection JSUnusedGlobalSymbols
export const buttonGrid = ( props: Args ) =>
	<ButtonGrid { ...props }>
		<SuccessButton text="SuccessButton"/>
		<SecondaryButton text="SecondaryButton"/>
		<PrimaryButton text="PrimaryButton"/>
		< ErrorButton text="ErrorButton"/>
	</ButtonGrid>