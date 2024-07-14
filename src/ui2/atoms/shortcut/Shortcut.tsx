import {useTheme} from '../contexts'
import {css, InputProps} from "@baizey/styled-preact";
import {useSignal} from "@preact/signals";
import {ReadonlyInput} from "../input";

export type ShortcutProps = InputProps & {
    onInput?: never,
    onChange?: never,
    value?: string
    onValueChange: (change: string) => void
}

export function Shortcut({value: defaultValue, onValueChange}: ShortcutProps) {
    const current = useSignal<string>(defaultValue!)
    return <ReadonlyInput
        value={current.value}
        onClick={() => {
            current.value = ''
            console.log(current.value)
            onValueChange('')
        }}
        onKeyDown={event => {
            const key = event.key
            current.value = key
            onValueChange(key)
        }}
        styling={css`
          display: block;
          line-height: 33px;
          height: 33px;
          border-bottom-width: 1px;
          border-radius: 0;
          cursor: pointer;
          -webkit-appearance: none;
          -moz-appearance: none;

          &:hover {
            border-color: ${useTheme().formBorderFocus};
          }`}
    />
}