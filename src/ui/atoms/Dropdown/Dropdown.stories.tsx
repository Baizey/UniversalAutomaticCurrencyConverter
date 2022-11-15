import React from 'react'
import { Dropdown } from './Dropdown'


export default {
	title: 'Atoms/Input',
	component: Dropdown,
}

export const dropdown = () => {
	return ( <Dropdown maxOptions={ 4 } onChange={ console.log } options={ [
		{ value: 'A', label: 'A' },
		{ value: 'B', label: 'B' },
		{ value: 'C', label: 'C' },
		{ value: 'D', label: 'D' },
		{ value: 'E', label: 'E' },
		{ value: 'F', label: 'F' },
	] }></Dropdown> )
}
