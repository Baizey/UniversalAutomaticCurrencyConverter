import {effect, useSignal} from '@preact/signals'
import {useEffect} from 'preact/compat'
import {useTheme} from '../contexts'
import {css, Div, DivProps} from "@baizey/styled-preact";

export type CheckboxProps = {value: boolean, onInput: (value: boolean) => void }

type ContainerProps = DivProps & { checked: boolean };
const Container = ({checked, ...props}: ContainerProps) => {
    const theme = useTheme()
    return <Div {...props} styling={css`
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-width: 1px;
      position: relative;
      display: block;

      &:hover {
        transition: border-color 0.3s ease-in-out;
        border-color: ${theme.formBorderFocus};
      }

      & div {
        position: absolute;
        height: 5px;
        background-color: ${theme.successBackground};
        transition: opacity 0.3s ease-in-out;
        opacity: ${checked ? 1 : 0};
      }

      & div:nth-child(1) {
        margin-top: 15px;
        margin-left: 0;
        width: 16px;
        transform: rotate(45deg);
      }

      & div:nth-child(2) {
        margin-top: 14px;
        margin-left: 9px;
        width: 20px;
        transform: rotate(135deg);
      }
    `}/>
}

export function Checkbox({value, onInput}: CheckboxProps) {
    const isChecked = useSignal(value)
    useEffect(() => {
        isChecked.value = value
    }, [value])
    effect(() => onInput(isChecked.value))

    return (
        <Container checked={isChecked.value} onClick={() => isChecked.value = !isChecked.value}>
            <div/>
            <div/>
        </Container>
    )
}