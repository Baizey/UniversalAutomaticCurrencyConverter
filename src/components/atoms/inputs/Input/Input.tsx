import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { ThemeProps } from '../../../../infrastructure'
import { basicStyle } from '../../Basics'
import { HalfBorderFieldHeight } from '../../Constants'

const baseInputStyle = ( props: ThemeProps ) => ( {
	...basicStyle( props ),
	height: HalfBorderFieldHeight.pixel,
	lineHeight: HalfBorderFieldHeight.pixel,
	borderBottomWidth: '1px',
	appearance: 'none',
	width: '100%',
	'&:hover': {
		borderColor: props.theme.formBorderFocus,
	},
	'&:focus': {
		borderColor: props.theme.formBorderFocus,
	},
} )

const StyledInput = styled.input<ThemeProps>( ( props: ThemeProps ) => ( {
	...baseInputStyle( props ),
	'&[type="text"]': baseInputStyle( props ),
	'&[type="number"]': baseInputStyle( props ),
	'&[type="range"]': baseInputStyle( props ),
} ) )

type BaseInputProps = { type?: string; readOnly?: boolean; value?: any };
export const BaseInput = styled( StyledInput )<BaseInputProps>``

type InputContainerProps = {
	center: boolean;
	borderHoverColor?: string;
	min?: number;
	max?: number;
} & ThemeProps;

function align( props: InputContainerProps ): 'right' | 'center' {
	if ( props.center ) return 'center'
	return 'right'
}

const InputContainer = styled( BaseInput )<InputContainerProps>(
	( props: InputContainerProps ) => ( {
		'&[type="text"]': {
			textAlign: align( props ),
			textAlignLast: align( props ),
			'&:hover': {
				borderColor: props.borderHoverColor || props.theme.formBorderFocus,
			},
			'&:focus': {
				outline: 0,
			},
		},
		'&[type="number"]': {
			textAlign: align( props ),
			textAlignLast: align( props ),
			'&:hover': {
				borderColor: props.borderHoverColor || props.theme.formBorderFocus,
			},
			'&:focus': {
				outline: 0,
			},
		},
	} ),
)

export type InputProps<T> = {
	center?: boolean;
	placeholder?: string;
	defaultValue: T;
	borderHoverColor?: string;
	onChange?: ( value: T ) => void;
	onEnter?: ( value: T ) => void;
};

type InternalInputProps<T> = {
	type: 'text' | 'number';
	mapper: ( raw: string ) => T;
	readonly?: boolean;
} & InputProps<T>;

export function Input<T extends string | number>( {
	                                                  type,
	                                                  mapper,
	                                                  defaultValue,
	                                                  center = true,
	                                                  borderHoverColor,
	                                                  placeholder,
	                                                  onChange,
	                                                  onEnter,
	                                                  readonly,
                                                  }: InternalInputProps<T> ) {
	const [ current, setCurrent ] = useState( defaultValue )
	return (
		<InputContainer
			readOnly={ readonly }
			center={ center }
			borderHoverColor={ borderHoverColor }
			placeholder={ placeholder }
			type={ type }
			defaultValue={ current }
			onChange={ ( event: ChangeEvent<HTMLInputElement> ) => {
				const value = mapper( event.target.value )
				setCurrent( value )
				onChange && onChange( value )
			} }
			onKeyUp={ ( event: any ) =>
				event.key === 'Enter' && onEnter && onEnter( current )
			}
		/>
	)
}
