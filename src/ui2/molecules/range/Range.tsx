import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/compat'
import {InputProps, Pixel, RawRangeInput, ReadonlyInput, useTheme} from '../../atoms'

export type RangeProps = {
	key?: string;
	onChange: ( value: string ) => void;
	options: string[];
	initialValue: string;
};

export function Range( { onChange, options, initialValue }: RangeProps ) {
	const index = useSignal( options.indexOf( initialValue ) )
	useEffect( () => {
		onChange( options[index.value] )
	}, [ index.value ] )

	return <>
		<ReadonlyInput value={ options[index.value] }/>
		<RangeContainer
			value={ index.value }
			step={ 1 }
			min={ 0 }
			max={ options.length - 1 }
			onChange={ e => index.value = e ?? 0 }
		/>
	</>
}

export type RangeContainerProps = {
	value: number;
	min: number;
	max: number;
	step: number;
} & InputProps<number>;

function RangeContainer( props: RangeContainerProps ) {
	const theme = useTheme()
	return <RawRangeInput { ...props } css={ classname => <style jsx>{ `
      .${ classname } {
        -webkit-appearance: none;
        height: ${ Pixel.halfField };
        width: 80%;
        appearance: auto;
        border-width: 0;
        background: transparent; /* Otherwise white in Chrome */
        display: inline-block;
        vertical-align: middle;
      }

      .${ classname }:focus {
        -webkit-appearance: none;
        outline: none;
      }

      .${ classname }::-webkit-slider-thumb {
        -webkit-appearance: none;
        border-radius: 10px;
        width: 20px;
        height: 20px;
        border-width: 0;
        background-color: ${ theme.headerText };
      }

      .${ classname }::-webkit-slider-thumb:hover {
        background-color: ${ theme.formBorderFocus };
      }

      .${ classname }::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        width: 100%;
        padding: 0;
        margin: 0;
        height: 20px;
        border-radius: 10px;
        background-color: ${ theme.formBorder };
      }

      .${ classname }::-moz-range-thumb {
        border-radius: 10px;
        width: 20px;
        height: 20px;
        border-width: 0;
        background-color: ${ theme.headerText };
      }

      .${ classname }::-moz-range-thumb:hover {
        background-color: ${ theme.formBorderFocus };
      }

      .${ classname }::-moz-range-track {
        width: 100%;
        height: 20px;
        border-radius: 10px;
        background-color: ${ theme.formBorder };
      }

	` }</style> }/>
}
