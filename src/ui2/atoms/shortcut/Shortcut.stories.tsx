import React from 'react'
import { Shortcut } from './Shortcut'


export default {
	title: 'Atoms/Input',
	component: Shortcut,
}

export const shortcut = () =>
	<Shortcut onInput={ console.log }
	          onClick={ console.log } value={ 'a' }/>