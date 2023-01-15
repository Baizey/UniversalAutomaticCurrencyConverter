import * as React from 'react'
import { useEffect, useState } from 'react'
import { RawNumberInput, RawTextInput } from '../Styled'

type InputStyleProps = {
	borderHoverColor?: string;
	align?: 'left' | 'center' | 'right';
	placeholder?: string;
}

export type InputProps<T> = InputStyleProps & {
	value?: T
	onChange?: ( value: T ) => void
	onEnter?: ( value: T ) => void
	onClick?: () => void
	onMouseOver?: () => void
};

export const ReadonlyInput = ( { value, onClick, onMouseOver, align }: InputProps<string> ) =>
	<RawTextInput value={ value }
	              onClick={ onClick }
	              onMouseOver={ onMouseOver }
	              align={ align }
	              readOnly/>

export const NumberInput = ( {
	                             onEnter = () => {},
	                             onChange = () => {},
	                             value = 0,
	                             ...rest
                             }: InputProps<number> ) => {
	const [ currentValue, setCurrentValue ] = useState( value )
	useEffect( () => {setCurrentValue( value )}, [ value ] )

	return <RawNumberInput { ...rest }
	                       value={ currentValue }
	                       onChange={ p => {
		                       const v = Number( p.target.value )
		                       setCurrentValue( v )
		                       onChange( v )
	                       } }
	                       onKeyUp={ p => p.key === 'Enter' && onEnter( Number( currentValue ) ) }
	/>
}

export const TextInput = ( {
	                           onEnter = () => {},
	                           onChange = () => {},
	                           value = '',
	                           ...rest
                           }: InputProps<string> ) => {
	const [ currentValue, setCurrentValue ] = useState( value )
	useEffect( () => {setCurrentValue( value )}, [ value ] )

	return <RawTextInput { ...rest }
	                     value={ currentValue }
	                     onChange={ p => {
		                     const v = p.target.value
		                     setCurrentValue( v )
		                     onChange( v )
	                     } }
	                     onKeyUp={ p => p.key === 'Enter' && onEnter( currentValue ) }
	/>
}