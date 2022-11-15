import * as React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { Div } from '../Styled'
import { InputProp } from '../utils/InputProp'

export type ShortcutProps = InputProp<string>

export function Shortcut( { value, onChange }: ShortcutProps ) {
	const [ v, setValue ] = useState( value )
	return (
		<Container
			tabIndex={ 0 }
			onClick={ () => {
				setValue( '' )
				onChange( '' )
			} }
			onKeyDown={ ( event: any ) => {
				setValue( event.key )
				onChange( event.key )
			} }
		>
			{ v }
		</Container>
	)
}

type ContainerProps = {} & ThemeProps;

const Container = styled( Div )( ( props: ContainerProps ) => ( {
	display: 'block',
	lineHeight: '33px',
	height: '33px',
	borderBottomWidth: '1px',
	borderRadius: 0,
	cursor: 'pointer',
	'-webkit-appearance': 'none',
	'-moz-appearance': 'none',
	'&:hover': {
		borderColor: props.theme.formBorderFocus,
	},
} ) )
