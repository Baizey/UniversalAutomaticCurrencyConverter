import React from 'react'
import { Shortcut, ShortcutProps } from './Shortcut'

const baseProps: ShortcutProps = {
	value: '',
	onChange: console.log,
	onClick: () => {},
}

export default {
	title: 'Atoms/Input',
	component: Shortcut,
	args: baseProps,
}

export const shortcut = ( args ) => {
	return ( <Shortcut { ...args }></Shortcut> )
}