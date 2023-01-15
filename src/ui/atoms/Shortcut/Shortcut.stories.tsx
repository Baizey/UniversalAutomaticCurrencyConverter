import React from 'react'
import { Shortcut, ShortcutProps } from './Shortcut'

const baseProps: ShortcutProps = {
	key: '',
	onChange: console.log,
	onClick: () => {},
}

export default {
	title: 'Atoms/Input',
	component: Shortcut,
	args: baseProps,
}

export const shortcut = ( args ) => ( <Shortcut { ...args }></Shortcut> )