import {useState} from 'preact/compat'
import {useTheme} from '../contexts'
import {InputProp} from '../utils/InputProp'
import {css, Div, DivProps, mergeStyling} from "@baizey/styled-preact";

export type ShortcutProps = InputProp<string>

export function Shortcut({value, onInput}: ShortcutProps) {
    const [v, setValue] = useState(value)
    return (
        <Container
            onClick={() => {
                setValue('')
                onInput('')
            }}
            onKeyDown={event => {
                setValue(event.key)
                onInput(event.key)
            }}
        >
            {v}
        </Container>
    )
}


const Container = ({styling, ...props}: DivProps) => {
    const theme = useTheme()
    return <Div {...props}
                styling={mergeStyling(styling, css`
                  display: block;
                  line-height: 33px;
                  height: 33px;
                  border-bottom-width: 1px;
                  border-radius: 0;
                  cursor: pointer;
                  -webkit-appearance: none;
                  -moz-appearance: none;

                  &:hover {
                    border-color: ${theme.formBorderFocus};
                  }`)}
    />
}