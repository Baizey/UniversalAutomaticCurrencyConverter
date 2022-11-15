import React from 'react'
import { InputProps, NumberInput, ReadonlyInput, TextInput } from './Input'

const baseProps: InputProps<string | number> = {
	onEnter: e => console.log( `Enter ${ e }` ),
	onChange: e => console.log( `Change ${ e }` ),
	borderHoverColor: 'red',
	placeholder: 'placeholder',
	value: 0,
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
	return ( <NumberInput { ...( args as InputProps<number> ) } value={ 0 }/> )
}

export const textInput = ( args ) => {
	return ( <TextInput { ...( args as InputProps<string> ) } value={ '' }/> )
}