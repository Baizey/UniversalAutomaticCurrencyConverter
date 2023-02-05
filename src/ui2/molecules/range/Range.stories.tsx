import React from 'react'
import { Range, RangeProps } from './Range'

// noinspection JSUnusedGlobalSymbols
export default {
	title: 'Molecules/Range',
	component: Range,
	argTypes: {},
}

// noinspection JSUnusedGlobalSymbols
export const range = ( {}: RangeProps ) => {
	const options = [
		'https://google.com/w/images',
		'https://google.com/w',
		'https://google.com',
		'google.com',
		'google',
	].reverse()
	return <Range options={ options }
	              initialValue={ options[1] }
	              onChange={ console.log }/>
}