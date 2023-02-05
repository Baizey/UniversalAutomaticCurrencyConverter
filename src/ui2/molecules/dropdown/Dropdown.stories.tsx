import React from 'react'
import { storybookEnum } from '../../../ui/storybook/utils'
import { ReadonlyInput } from '../../atoms'
import { Dropdown, DropdownListLocation } from './Dropdown'


export default {
	title: 'Molecules/Input',
	component: Dropdown,
	args: {
		listLocation: DropdownListLocation.bottom,
	},
	argTypes: {
		listLocation: storybookEnum( DropdownListLocation ),
	},
}

export const dropdown = ( args: any ) => {
	return ( <>
		<ReadonlyInput value={ 'Field above dropdown' }/>
		<ReadonlyInput value={ 'Field above dropdown' }/>
		<ReadonlyInput value={ 'Field above dropdown' }/>
		<ReadonlyInput value={ 'Field above dropdown' }/>
		<ReadonlyInput value={ 'Field above dropdown' }/>
		<Dropdown { ...args }
		          onSelection={ console.log }
		          initialValue={ '' }
		          options={ [
			          { key: 'A', text: 'A' },
			          { key: 'B', text: 'B' },
			          { key: 'C', text: 'C' },
			          { key: 'D', text: 'D' },
			          { key: 'E', text: 'E' },
			          { key: 'F', text: 'F' },
		          ] }/>
		<ReadonlyInput value={ 'Field below dropdown' }/>
		<ReadonlyInput value={ 'Field below dropdown' }/>
		<ReadonlyInput value={ 'Field below dropdown' }/>
		<ReadonlyInput value={ 'Field below dropdown' }/>
		<ReadonlyInput value={ 'Field below dropdown' }/>
	</> )
}
