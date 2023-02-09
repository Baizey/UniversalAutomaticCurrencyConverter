import { Signal, useSignal } from '@preact/signals'
import { useEffect } from 'preact/compat'
import { Div, Pixel, ReadonlyInput, TextInput, Ul, useTheme, WithActions, WithChildren } from '../../atoms'
import { Size } from '../../atoms/utils/Size'


const Container = ( { children, ...props }: WithActions ) => <Div
	{ ...props }
	style={ {
		margin: '0 auto',
		position: 'relative',
	} }>{ children }</Div>

const maxDisplayedItems = 3

type DropdownListProps = WithChildren & {
	isVisible: boolean,
	location?: DropdownListLocation,
	totalOptions: number
}
const DropdownList = ( { children, isVisible, totalOptions, location }: DropdownListProps ) => {
	return <Ul css={ classname => <style jsx>{ `
      .${ classname } {
        display: ${ isVisible ? '' : 'none' };
        position: absolute;
        width: auto;
        top: ${ location === DropdownListLocation.top
                ? Pixel.of( -Math.min( maxDisplayedItems, totalOptions ) * ( Size.field - 1 ) )
                : Pixel.fieldWithUnderline };
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
        border-bottom-width: ${ location === DropdownListLocation.top ? Pixel.zero : Pixel.one };
        border-top-width: ${ location === DropdownListLocation.top ? Pixel.one : Pixel.zero };
        border-left-width: ${ Pixel.one };
        border-right-width: ${ Pixel.one };
      }` }</style> }>{ children }</Ul>
}

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

export function Dropdown( {
	                          options,
	                          initialValue,
	                          onSelection,
	                          listLocation = DropdownListLocation.bottom,
                          }: Props ) {
	const selectedOption = options.filter( e => e.key === initialValue )[0]
	const isFocused = useSignal( false )
	const query = useSignal( '' )
	const selected = useSignal( selectedOption?.text )

	const visibleOptions = options.filter( option => isPossible( query.value, option ) )
	const handleSelection = ( option: DropdownOption ) => {
		onSelection( option.key )
		selected.value = option.text
		query.value = ''
	}

	useEffect( () => { selected.value = selectedOption?.text}, [ initialValue ] )
	useEffect( () => {
		if ( !isFocused.value ) return
		const handler = ( e: { key: string } ) => {
			if ( e.key !== 'Enter' ) return
			const choice = visibleOptions[0]
			if ( !choice ) return
			handleSelection( choice )
		}
		document.addEventListener( 'keyup', handler )
		return () => document.removeEventListener( 'keyup', handler )
	}, [ isFocused.value, visibleOptions ] )

	const inputField = <DropdownInput selectedValue={ selected } isFocused={ isFocused } query={ query }/>
	return (
		<Container onMouseLeave={ () => isFocused.value = false }>
			{ listLocation === DropdownListLocation.top && inputField }
			<DropdownOptions isFocused={ isFocused }
			                 visibleOptions={ visibleOptions }
			                 listLocation={ listLocation }
			                 handleSelection={ handleSelection }/>
			{ listLocation === DropdownListLocation.bottom && inputField }
		</Container>
	)
}

function DropdownOptions( { isFocused, visibleOptions, listLocation, handleSelection }: {
	isFocused: Signal<boolean>,
	visibleOptions: DropdownOption[],
	listLocation?: DropdownListLocation,
	handleSelection: ( option: DropdownOption ) => void
} ) {
	return <DropdownList isVisible={ isFocused.value }
	                     location={ listLocation }
	                     totalOptions={ visibleOptions.length }
	>
		{ visibleOptions.map( option =>
			<ReadonlyInput value={ option.text } onClick={ () => handleSelection( option ) }/> ) }
	</DropdownList>
}

function DropdownInput( { isFocused, query, selectedValue }: {
	isFocused: Signal<boolean>,
	selectedValue: Signal<string>
	query: Signal<string>
} ) {
	return <TextInput
		onMouseOver={ () => isFocused.value = true }
		placeholder={ selectedValue.value }
		placeholderColor={ useTheme().normalText }
		value={ query.value }
		onInput={ e => query.value = e }
	/>
}