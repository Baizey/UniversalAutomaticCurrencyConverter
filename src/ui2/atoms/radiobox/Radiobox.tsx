import {useTheme} from '../contexts'
import {InputProp} from '../utils/InputProp'
import {css, Div, DivProps, mergeStyling} from "@baizey/styled-preact";

export type RadioBoxProps = InputProp<boolean>

export function Radiobox({value, onClick}: RadioBoxProps) {
    return <RadioBoxContainer checked={value}
                              onClick={() => onClick()}
                              children={<div/>}/>
}

type RadioBoxContainerProps = DivProps & {
    checked: boolean;
    onClick: () => void;
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
