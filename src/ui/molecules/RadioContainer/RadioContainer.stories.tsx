import React, { useState } from 'react'
import { RadioBoxProps } from '../../atoms'
import { storybookEnum } from '../../storybook/utils'
import { RadioContainer, RadioContainerProps, RadioDisplay } from './index'

const args: RadioContainerProps = {
	display: RadioDisplay.row,
	options: [],
}

// noinspection JSUnusedGlobalSymbols
export default {
	title: 'Molecules/Radio',
	component: RadioContainer,
	args: args,
	argTypes: {
		display: storybookEnum( RadioDisplay ),
	},
}

// noinspection JSUnusedGlobalSymbols
export const radioBox = ( { display }: RadioContainerProps ) => {
	const [ selected, setSelected ] = useState( 0 )
	const options: RadioBoxProps[] = [ 0, 1, 2, 3, 4, 5 ].map( i => ( {
		value: i === selected,
		onClick: () => setSelected( i ),
		onChange: () => undefined,
	} ) )
	return <RadioContainer display={ display } options={ options }/>
}