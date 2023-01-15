import React from 'react'
import { Checkbox, CheckboxProps } from './Checkbox'

const defaultProps: CheckboxProps = {
	key: false,
	onChange: e => console.log( `Change ${ e }` ),
	onClick: () => console.log( `Click` ),
}
type Props = typeof defaultProps

export default {
	title: 'Atoms/Input',
	component: Checkbox,
	args: defaultProps,
}

export const checkbox = ( args: Props ) => {
	return ( <Checkbox { ...args }/> )
}