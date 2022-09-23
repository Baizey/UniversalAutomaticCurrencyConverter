import * as React from 'react'
import { Input, InputProps } from './Input'

export function NumberInput( props: InputProps<number> ) {
	return <Input<number> { ...props } type="number" mapper={ ( e ) => +e }/>
}
