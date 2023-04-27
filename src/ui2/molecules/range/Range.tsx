import {useSignal} from '@preact/signals'
import {useEffect} from 'preact/compat'
import {InputProps, Pixel, RawRangeInput, ReadonlyInput, useTheme} from '../../atoms'
import {css, mergeStyling} from "@baizey/styled-preact";

export type RangeProps = {
    key?: string;
    onChange: (value: string) => void;
    options: string[];
    initialValue: string;
};

export function Range({onChange, options, initialValue}: RangeProps) {
    const index = useSignal(options.indexOf(initialValue))
    useEffect(() => {
        onChange(options[index.value])
    }, [index.value])

    return <>
        <ReadonlyInput value={options[index.value]}/>
        <RangeContainer
            value={index.value}
            step={1}
            min={0}
            max={options.length - 1}
            onValueChange={e => index.value = e ?? 0}
        />
    </>
}

export type RangeContainerProps = {
    value: number;
    min: number;
    max: number;
    step: number;
} & InputProps<number>;

function RangeContainer({styling, onValueChange, ...props}: RangeContainerProps) {
    const theme = useTheme()
    return <RawRangeInput {...props}
                          onInput={e =>{
                              const value = Number(e.target.value)
                              onValueChange(value)
                          }}
                          styling={mergeStyling(styling, css`
                            
                              -webkit-appearance: none;
                              height: ${Pixel.halfField};
                              width: 80%;
                              appearance: auto;
                              border-width: 0;
                              background: transparent; /* Otherwise white in Chrome */
                              display: inline-block;
                              vertical-align: middle;

                            &:focus {
                              -webkit-appearance: none;
                              outline: none;
                            }

                            &::-webkit-slider-thumb {
                              -webkit-appearance: none;
                              border-radius: 10px;
                              width: 20px;
                              height: 20px;
                              border-width: 0;
                              background-color: ${theme.headerText};
                            }

                            &::-webkit-slider-thumb:hover {
                              background-color: ${theme.formBorderFocus};
                            }

                            &::-webkit-slider-runnable-track {
                              -webkit-appearance: none;
                              width: 100%;
                              padding: 0;
                              margin: 0;
                              height: 20px;
                              border-radius: 10px;
                              background-color: ${theme.formBorder};
                            }

                            &::-moz-range-thumb {
                              border-radius: 10px;
                              width: 20px;
                              height: 20px;
                              border-width: 0;
                              background-color: ${theme.headerText};
                            }

                            &::-moz-range-thumb:hover {
                              background-color: ${theme.formBorderFocus};
                            }

                            &::-moz-range-track {
                              width: 100%;
                              height: 20px;
                              border-radius: 10px;
                              background-color: ${theme.formBorder};
                            }

                          `)}/>
}
