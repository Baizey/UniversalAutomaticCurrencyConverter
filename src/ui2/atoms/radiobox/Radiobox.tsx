import {useTheme} from '../contexts'
import {css, Div, DivProps, mergeStyling} from "@baizey/styled-preact";

export type RadioBoxProps = DivProps & {
    value: boolean
}

export function Radiobox({value, ...props}: RadioBoxProps) {
    return <RadioBoxContainer {...props}
                              checked={value}
                              children={<div/>}/>
}

type RadioBoxContainerProps = DivProps & {
    checked: boolean;
};

function RadioBoxContainer({checked, styling, ...props}: RadioBoxContainerProps) {
    const theme = useTheme()
    return <Div {...props} styling={mergeStyling(styling, css`
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      border-width: 1px;
      display: block;

      &:hover {
        border-color: ${theme.formBorderFocus}
      }

      & div {
        height: 20px;
        width: 20px;
        margin: auto;
        margin-top: 5px;
        border-radius: 10px;
        background-color: ${theme.successBackground};
        transition: opacity 0.3s ease-in-out;
        opacity: ${checked ? 1 : 0};
      }
    `)}/>
}
