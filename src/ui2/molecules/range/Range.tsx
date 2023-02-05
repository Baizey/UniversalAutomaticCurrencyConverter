import { useEffect, useState } from 'preact/compat'
import { Pixel, RawRangeInput, ReadonlyInput, useTheme, WithActions } from '../../atoms'

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
			onInput={ e => setIndex( Number( e.target.value ) ) }
		/>
	</>
}

export type RangeContainerProps = {
	value: number;
	min: number;
	max: number;
	step: number;
} & WithActions;

function RangeContainer( props: RangeContainerProps ) {
	const theme = useTheme()
	return <RawRangeInput { ...props } css={ classname => <style jsx>{ `
      .${ classname }[type='range'] {
        -webkit-appearance: none;
        height: ${ Pixel.halfField };
        width: 80%;
        appearance: auto;
        border-width: 0;
        background: transparent; /* Otherwise white in Chrome */
        display: inline-block;
        vertical-align: middle;
      }

      .${ classname }[type='range']:focus {
        -webkit-appearance: none;
        outline: none;
      }

      .${ classname }[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        border-radius: 10px;
        width: 20px;
        height: 20px;
        border-width: 0;
        background-color: ${ theme.headerText };
      }

      .${ classname }[type='range']::-webkit-slider-thumb:hover {
        background-color: ${ theme.formBorderFocus };
      }

      .${ classname }[type='range']::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        width: 100%;
        padding: 0;
        margin: 0;
        height: 20px;
        border-radius: 10px;
        background-color: ${ theme.formBorder };
      }

      .${ classname }[type='range']::-moz-range-thumb {
        border-radius: 10px;
        width: 20px;
        height: 20px;
        border-width: 0;
        background-color: ${ theme.headerText };
      }

      .${ classname }[type='range']::-moz-range-thumb:hover {
        background-color: ${ theme.formBorderFocus };
      }

      .${ classname }[type='range']::-moz-range-track {
        width: 100%;
        height: 20px;
        border-radius: 10px;
        background-color: ${ theme.formBorder };
      }

	` }</style> }/>
}
