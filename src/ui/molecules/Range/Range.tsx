import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Pixel, ReadonlyInput, ThemeHolder } from '../../atoms'
import { RawRangeInput } from '../../atoms/Styled'

export type RangeProps = {
	key?: string;
	onChange: ( value: string ) => void;
	options: string[];
	initialValue: string;
};

export function Range( { onChange, options, initialValue }: RangeProps ) {
	const [ index, setIndex ] = useState( options.indexOf( initialValue ) )
	const value = options[index]
	useEffect( () => { onChange( value ) }, [ index ] )

	return <>
		<ReadonlyInput value={ value }/>
		<RangeContainer
			value={ index }
			step={ 1 }
			min={ 0 }
			max={ options.length - 1 }
			onChange={ e => setIndex( Number( e.target.value ) ) }
		/>
	</>
}

export type RangeContainerProps = {
	min: number;
	max: number;
	step: number;
	type: string;
} & ThemeHolder;
export const RangeContainer = styled( RawRangeInput )<RangeContainerProps>`
  -webkit-appearance: none;
  height: ${ Pixel.halfField };
  width: 80%;
  appearance: auto;
  border-width: 0;

  &[type='range'] {
    -webkit-appearance: none;
    background: transparent; /* Otherwise white in Chrome */
    display: inline-block;
    vertical-align: middle;
  }

  &[type='range']:focus {
    -webkit-appearance: none;
    outline: none;
  }

  &[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    border-radius: 10px;
    width: 20px;
    height: 20px;
    border-width: 0;
    background-color: ${ ( props: ThemeHolder ) => props.theme.headerText };

    &:hover {
      background-color: ${ ( props: ThemeHolder ) => props.theme.formBorderFocus };
    }
  }

  &[type='range']::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    width: 100%;
    padding: 0;
    margin: 0;
    height: 20px;
    border-radius: 10px;
    background-color: ${ ( props: ThemeHolder ) => props.theme.formBorder };
  }

  &[type='range']::-moz-range-thumb {
    border-radius: 10px;
    width: 20px;
    height: 20px;
    border-width: 0;
    background-color: ${ ( props: ThemeHolder ) => props.theme.headerText };

    &:hover {
      background-color: ${ ( props: ThemeHolder ) => props.theme.formBorderFocus };
    }
  }

  &[type='range']::-moz-range-track {
    width: 100%;
    height: 20px;
    border-radius: 10px;
    background-color: ${ ( props: ThemeHolder ) => props.theme.formBorder };
  }
`
