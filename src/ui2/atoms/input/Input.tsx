import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/compat'
import { RawNumberInput, RawTextInput } from '../core'

type InputStyleProps = {
	borderHoverColor?: string;
	align?: 'left' | 'center' | 'right';
	placeholder?: string;
	placeholderColor?: string;
}

export type InputProps<T> = InputStyleProps & {
	value?: T
	onInput?: ( value: T ) => void
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
	                             onInput = () => {},
	                             value = 0,
	                             ...rest
                             }: InputProps<number> ) => {
	const currentValue = useSignal( value )
	useEffect( () => {currentValue.value = value}, [ value ] )

	return <RawNumberInput { ...rest }
	                       value={ currentValue.value }
	                       onInput={ v => {
		                       currentValue.value = v
		                       onInput( v )
	                       } }
	                       onKeyUp={ p => p.key === 'Enter' && onEnter( Number( currentValue.value ) ) }
	/>
}

export const TextInput = ( {
	                           onEnter = () => {},
	                           onInput = () => {},
	                           value = '',
	                           ...rest
                           }: InputProps<string> ) => {
	const currentValue = useSignal( value )
	useEffect( () => {currentValue.value = value}, [ value ] )

	return <RawTextInput { ...rest }
	                     value={ currentValue.value }
	                     onInput={ v => {
		                     currentValue.value = v
		                     onInput( v )
	                     } }
	                     onKeyUp={ p => p.key === 'Enter' && onEnter( currentValue.value ) }
	/>
}