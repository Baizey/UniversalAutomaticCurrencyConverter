import React, { useState } from 'react'
import styled from 'styled-components'
import { ReadonlyInput, TextInput } from '../Input'
import { Option, Select } from '../Styled'
import { Percent, Pixel, ThemeHolder } from '../utils'

type OptionData = { label: string; value: string }
export type DropdownProps = {
	options: OptionData[]
	maxOptions?: number
	value?: string
	onChange: ( value: OptionData ) => void
};

export const Dropdown = ( { options, value, onChange, maxOptions }: DropdownProps ) => {
	const [ selected, setSelected ] = useState<OptionData | undefined>(
		options.filter( ( e ) => e.value === value )[0] )
	const [ remainingOptions, setRemainingOptions ] = useState( options )

	const visibleOptions = maxOptions || 4
	const optionHeight = 40
	const menuHeight = Pixel.of( visibleOptions * optionHeight )

	return ( <>
		<TextInput value={ selected?.value }
		           onChange={ v => setRemainingOptions( options.filter( e => matches( e, v ) ) )
		           }/>
		{ remainingOptions.length == 0 && <ReadonlyInput value={ 'No matches' }/> }
		{ remainingOptions.length > 0 &&
          <SelectWrap height={ menuHeight }>
			  { remainingOptions.map( e => ( <OptionItem onClick={ ( e ) => {
				  onChange( e )
				  setSelected( e )
			  } } item={ e }/> ) ) }
          </SelectWrap> }
	</> )
}

function matches( option: OptionData, filter: string ) {
	return option.value.indexOf( filter ) >= 0 || option.label.indexOf( filter ) >= 0
}

type SelectWrapProps = { height: string } & ThemeHolder
const SelectWrap = styled( Select )<SelectWrapProps>( ( { height }: SelectWrapProps ) => ( {
	maxHeight: height,
} ) )

type OptionProps = { item: OptionData, onClick: ( value: OptionData ) => void }
const OptionItem = ( { item, onClick }: OptionProps ) => {
	return (
		<OptionWrap value={ item.value } onClick={ () => onClick( item ) }>
			{ item.label }
		</OptionWrap>
	)
}

const OptionWrap = styled( Option )( ( { theme }: ThemeHolder ) => ( {
	width: Percent.all,
	maxWidth: Percent.all,
	height: Pixel.field,
	lineHeight: Pixel.field,
	verticalAlign: 'center',
	backgroundColor: theme.containerBackground,
	cursor: 'pointer',
	'&:focus': { backgroundColor: theme.backgroundBorderFocus },
	'&:hover': { backgroundColor: theme.backgroundBorderFocus },
} ) )