import * as React from 'react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useTheme } from 'styled-components'
import { MyTheme } from '../../../infrastructure'
import { basicStyle } from '../Basics'
import { FieldHeight } from '../Constants'

export type DropdownProps = {
	maxOptions?: number;
	options: { label: string; value: string }[];
	value?: string;
	onChange: ( value: string ) => void;
	menuPlacement?: 'bottom' | 'top' | 'auto';
};

export function Dropdown( {
	                          options,
	                          value,
	                          onChange,
	                          maxOptions,
	                          menuPlacement,
                          }: DropdownProps ) {
	const [ selected, setSelected ] =
		useState<{
			label: string;
			value: string;
		} | null>( null )
	useEffect( () => setSelected( options.filter( ( e ) => e.value === value )[0] ), [] )
	const theme = useTheme() as MyTheme
	const visibleOptions = maxOptions || 4
	const optionHeight = 40
	const menuHeight = visibleOptions * optionHeight
	return (
		<Select
			onChange={ ( option ) => {
				if ( option && option.value && option.value !== selected?.value ) {
					onChange( option.value )
					setSelected( option )
				}
			} }
			value={ selected }
			options={ options }
			menuPlacement={ menuPlacement || 'auto' }
			placeholder={ 'Search and select...' }
			styles={ {
				indicatorsContainer: ( provider: any, state: any ) => ( {
					display: 'none',
				} ),
				option: ( provided: any, state: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					width: '100%',
					height: FieldHeight.pixel,
					lineHeight: FieldHeight.pixel,
					verticalAlign: 'center',
					backgroundColor: state.isFocused
						? theme.backgroundBorderFocus
						: theme.containerBackground,
					cursor: 'pointer',
				} ),
				placeholder: ( provided: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					width: '100%',
					height: FieldHeight.pixel,
					lineHeight: FieldHeight.pixel,
					color: theme.headerText,
				} ),
				singleValue: ( provided: any, state: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					height: FieldHeight.pixel,
					lineHeight: FieldHeight.pixel,
					zIndex: 501,
					width: '100%',
					maxWidth: '100%',
				} ),
				valueContainer: ( provided: any, state: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					height: FieldHeight.pixel,
					lineHeight: FieldHeight.pixel,
					borderBottomWidth: '1px',
					borderBottomColor: state.isFocused
						? theme.formBorderFocus
						: theme.formBorder,
					transition: 'border-color 0.3s ease-in-out',
					'&:hover': {
						borderBottomColor: theme.formBorderFocus,
					},
				} ),
				input: ( provided: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					zIndex: 500,
					height: FieldHeight.pixel,
					lineHeight: FieldHeight.pixel,
				} ),
				control: ( provided: any, state: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					height: FieldHeight.pixel,
					lineHeight: FieldHeight.pixel,
					cursor: 'pointer',
				} ),
				dropdownIndicator: ( provided: any, state: any ) => ( {
					...provided,
					padding: '10px',
				} ),
				menu: ( provided: any, state: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					borderWidth: '1px',
					maxHeight: `${ menuHeight }px`,
				} ),
				menuList: ( provided: any, state: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
					maxHeight: `${ menuHeight }px`,
				} ),
				container: ( provided: any, state: any ) => ( {
					...provided,
					...basicStyle( { theme: theme } ),
				} ),
			} }
			theme={ {
				borderRadius: 0,
				spacing: {
					baseUnit: 10,
					controlHeight: 10,
					menuGutter: 10,
				},
				colors: {
					primary: '',
					primary75: '',
					primary50: '',
					primary25: '',
					danger: '',
					dangerLight: '',
					neutral0: '',
					neutral5: '',
					neutral10: '',
					neutral20: '',
					neutral30: '',
					neutral40: '',
					neutral50: '',
					neutral60: '',
					neutral70: '',
					neutral80: '',
					neutral90: '',
				},
			} }
		/>
	)
}