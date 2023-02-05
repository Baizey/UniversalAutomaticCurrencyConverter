import { InputProps, NumberInput, ReadonlyInput, TextInput } from './Input'

const baseProps: InputProps<string | number> = {
	onEnter: e => console.log( `Enter ${ e }` ),
	onInput: e => console.log( `Change ${ e }` ),
	placeholder: 'placeholder',
	align: 'center',
}

export default {
	title: 'Atoms/Input',
	component: ReadonlyInput,
	args: baseProps,
}

export const readonlyInput = ( args ) => {
	return ( <ReadonlyInput { ...( args as InputProps<string> ) }></ReadonlyInput> )
}

export const numberInput = ( args ) => {
	return ( <NumberInput { ...( args as InputProps<number> ) }/> )
}

export const textInput = ( args ) => {
	return ( <TextInput { ...( args as InputProps<string> ) }/> )
}