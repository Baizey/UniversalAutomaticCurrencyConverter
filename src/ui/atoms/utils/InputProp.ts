export type InputProp<T> = {
	value: T
	onChange: ( value: T ) => void
	onClick: () => void
}