import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Pixel, ReadonlyInput, TextInput } from '../../atoms'
import { Div, Ul } from '../../atoms/Styled'
import { Size } from '../../atoms/utils/Size'

export enum DropdownListLocation {
	top = 'top',
	bottom = 'bottom'
}

export type DropdownOption = {
	key: string
	text: string
}

type Props = {
	options: DropdownOption[]
	initialValue: string
	onSelection: ( option: string ) => void
	listLocation?: DropdownListLocation
}

function isPossible( query: string, option: DropdownOption ): boolean {
	return option.key.toLowerCase().includes( query )
	       || option.text.toLowerCase().includes( query )
}

export function Dropdown( { options, initialValue, onSelection, listLocation }: Props ) {
	const [ isFocused, setIsFocused ] = useState( false )
	const [ query, setQuery ] = useState( initialValue )
	const visibleOptions = options.filter( option => isPossible( query, option ) )

	const handleSelection = ( option: DropdownOption ) => {
		onSelection( option.key )
		setQuery( option.text )
	}

	useEffect( () => {
		if ( !isFocused ) return
		const handler = ( e: { key: string } ) => {
			if ( e.key !== 'Enter' ) return
			const choice = visibleOptions[0]
			if ( !choice ) return
			handleSelection( choice )
		}
		document.addEventListener( 'keyup', handler )
		return () => document.removeEventListener( 'keyup', handler )
	}, [ isFocused, visibleOptions ] )

	const list = <DropdownList isVisible={ isFocused }
	                           location={ listLocation }
	                           totalOptions={ visibleOptions.length }
	>
		{ visibleOptions.map( ( option ) => <ReadonlyInput value={ option.text }
		                                                   onClick={ () => handleSelection( option ) }/>,
		) }
	</DropdownList>

	return (
		<Container
			onMouseLeave={ () => setIsFocused( false ) }>
			{ listLocation === DropdownListLocation.top && list }
			<TextInput
				onMouseOver={ () => setIsFocused( true ) }
				value={ query }
				onChange={ e => {
					setQuery( e )
					setIsFocused( true )
				} }
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

type DropdownListProps = {
	isVisible: boolean,
	location?: DropdownListLocation,
	totalOptions: number
}

const maxDisplayedItems = 3
const DropdownList = styled( Ul )<DropdownListProps>`
  display: ${ ( { isVisible }: DropdownListProps ) => isVisible ? '' : 'none' };
  position: absolute;
  top: ${ ( { location, totalOptions } ) => location === DropdownListLocation.top
          ? Pixel.of( -Math.min( maxDisplayedItems, totalOptions ) * Size.field )
          : '100%' };
  filter: brightness(110%);
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
  max-height: ${ Pixel.of( maxDisplayedItems * Size.field ) };
  overflow: auto;
  border-bottom-width: ${ ( { location } ) => location === DropdownListLocation.top ? Pixel.zero : Pixel.one };
  border-top-width: ${ ( { location } ) => location === DropdownListLocation.top ? Pixel.one : Pixel.zero };
  border-left-width: ${ Pixel.one };
  border-right-width: ${ Pixel.one };
`