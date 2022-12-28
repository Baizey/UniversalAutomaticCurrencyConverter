import React, { useState } from 'react'
import styled from 'styled-components'
import { Div } from '../Basics'
import { ReadonlyInput, TextInput } from './Input'

export enum DropdownListLocation {
	top = 'top',
	bottom = 'bottom'
}

export type DropdownOption = {
	value: string
	label: string
}

export type DropdownProps = {
	options: DropdownOption[],
	initialValue?: string,
	listLocation?: DropdownListLocation
}

export function Dropdown( {
	                          options,
	                          initialValue = '',
	                          listLocation = DropdownListLocation.bottom,
                          }: DropdownProps ) {
	const [ searchValue, setSearchValue ] = useState( '' )
	const [ visibleDropdown, setVisibleDropdown ] = useState( false )

	const list = <DropdownList isVisible={ visibleDropdown }>
		{ options
			.filter( option => option.value.includes( searchValue ) )
			.map( option => (
				<ReadonlyInput key={ option.value }
				               onClick={ () => {

				               } }
				               defaultValue={ option.label }
				/>
			) ) }
	</DropdownList>

	return (
		<Container
			onMouseEnter={ () => setVisibleDropdown( true ) }
			onMouseLeave={ () => setVisibleDropdown( false ) }>
			{ listLocation === DropdownListLocation.top && list }
			<TextInput
				defaultValue={ initialValue }
				onChange={ setSearchValue }
			/>
			{ listLocation === DropdownListLocation.bottom && list }
		</Container>
	)
}

const Container = styled( Div )`
  position: relative;
  width: 100%;
  margin: 0 auto;
`

type DropdownListProps = { isVisible: boolean }
const DropdownList = styled.ul<DropdownListProps>`
  display: ${ ( { isVisible }: DropdownListProps ) => isVisible ? '' : 'none' };
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`

const DropdownListItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }
`