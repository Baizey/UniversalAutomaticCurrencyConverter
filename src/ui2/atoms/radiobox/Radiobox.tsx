import { useTheme } from '../contexts'
import { Div, WithActions } from '../core'
import { InputProp } from '../utils/InputProp'

export type RadioBoxProps = InputProp<boolean>

export function Radiobox( { value, onClick }: RadioBoxProps ) {
	return <RadioBoxContainer checked={ value }
	                          onClick={ () => onClick() }
	                          children={ <div/> }/>
}

type RadioBoxContainerProps = WithActions & {
	checked: boolean;
	onClick: () => void;
};

function RadioBoxContainer( { checked, ...props }: RadioBoxContainerProps ) {
	const theme = useTheme()
	return <Div { ...props } css={ classname => <style jsx>{ `
      .${ classname } {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        border-width: 1px;
        display: block;
      }

      .${ classname }:hover {
        border-color: ${ theme.formBorderFocus }
      }

      .${ classname } div {
        height: 20px;
        width: 20px;
        margin: auto;
        margin-top: 5px;
        border-radius: 10px;
        background-color: ${ theme.successBackground };
        transition: opacity 0.3s ease-in-out;
        opacity: ${ checked ? 1 : 0 };
      }
	` }</style> }/>
}
