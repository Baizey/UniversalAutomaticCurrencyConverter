import { useState } from 'preact/compat'
import { useTheme } from '../contexts'
import { Div, WithActions } from '../core'
import { InputProp } from '../utils/InputProp'

export type ShortcutProps = InputProp<string>

export function Shortcut( { value, onInput }: ShortcutProps ) {
	const [ v, setValue ] = useState( value )
	return (
		<Container
			tabIndex={ 0 }
			onClick={ () => {
				setValue( '' )
				onInput( '' )
			} }
			onKeyDown={ event => {
				setValue( event.key )
				onInput( event.key )
			} }
		>
			{ v }
		</Container>
	)
}


const Container = ( props: WithActions ) => {
	const theme = useTheme()
	return <Div { ...props } css={ classname => <style jsx>{ `
      .${ classname } {
        display: block;
        line-height: 33px;
        height: 33px;
        border-bottom-width: 1px;
        border-radius: 0;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
      }

      .${ classname }:hover {
        border-color: ${ theme.formBorderFocus };
      }
	` }</style> }/>
}