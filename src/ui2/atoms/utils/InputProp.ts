export type InputProp<T> = {
	value: T
	onInput: ( value: T ) => void
	onClick: () => void
}