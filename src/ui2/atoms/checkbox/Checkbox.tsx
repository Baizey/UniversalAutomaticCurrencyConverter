import { effect, useSignal } from '@preact/signals'
import { useEffect } from 'preact/compat'
import { useTheme } from '../contexts'
import { Div, WithActions } from '../core'
import { InputProp } from '../utils/InputProp'

export type CheckboxProps = InputProp<boolean>

type ContainerProps = WithActions & { checked: boolean; onClick: () => void };
const Container = ( { checked, ...props }: ContainerProps ) => {
	const theme = useTheme()
	return <Div { ...props } css={ classname => <style jsx>{ `
      .${ classname } {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-width: 1px;
        position: relative;
        display: block;
      }

      .${ classname }:hover {
        transition: border-color 0.3s ease-in-out;
        border-color: ${ theme.formBorderFocus };
      }

      .${ classname } div {
        position: absolute;
        height: 5px;
        background-color: ${ theme.successBackground };
        transition: opacity 0.3s ease-in-out;
        opacity: ${ checked ? 1 : 0 };
      }

      .${ classname } div:nth-child(3) {
        margin-top: 15px;
        margin-left: 0;
        width: 16px;
        transform: rotate(45deg);
      }

      .${ classname } div:last-child {
        margin-top: 14px;
        margin-left: 9px;
        width: 20px;
        transform: rotate(135deg);
      }
	` }</style> }/>
}

export function Checkbox( { value, onInput }: CheckboxProps ) {
	const isChecked = useSignal( value )
	useEffect( () => {isChecked.value = value}, [ value ] )
	effect( () => onInput( isChecked.value ) )

	return (
		<Container checked={ isChecked.value } onClick={ () => isChecked.value = !isChecked.value }>
			<div/>
			<div/>
		</Container>
	)
}