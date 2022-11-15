import * as React from 'react'
import { useState } from 'react'
import { RawNumberInput, RawTextInput } from '../Styled'

type InputStyleProps = {
	borderHoverColor?: string;
	align?: 'left' | 'center' | 'right';
	placeholder?: string;
}

export type InputProps<T> = InputStyleProps & {
	value?: T;
	onChange?: ( value: T ) => void;
	onEnter?: ( value: T ) => void;
};

export const ReadonlyInput = ( { value }: InputProps<string> ) =>
	<RawTextInput value={ value } readOnly/>

export const NumberInput = ( { onEnter, onChange, value, ...rest }: InputProps<number> ) => {
	value ??= 0
	const [ current, setCurrent ] = useState( value )
	onChange ??= () => {}
	onEnter ??= () => {}
	return <RawNumberInput { ...rest }
	                       defaultValue={ current }
	                       onChange={ p => {
		                       setCurrent( Number( p.target.value ) )
		                       onChange && onChange( Number( p.target.value ) )
	                       } }
	                       onKeyUp={ p => onEnter && p.key === 'Enter' && onEnter( Number( current ) ) }
	/>
}

export const TextInput = ( { onEnter, onChange, value, ...rest }: InputProps<string> ) => {
	value ??= ''
	const [ current, setCurrent ] = useState( value )
	onChange ??= () => {}
	onEnter ??= () => {}
	return <RawTextInput { ...rest }
	                     defaultValue={ current }
	                     onChange={ p => {
		                     setCurrent( p.target.value )
		                     onChange && onChange( p.target.value )
	                     } }
	                     onKeyUp={ p => onEnter && p.key === 'Enter' && onEnter( current ) }
	/>
}