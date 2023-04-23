import {useTheme} from '../contexts'
import {Percent, Pixel} from '../utils'
import {Button, ButtonProps as ButtonP, css, mergeStyling} from "@baizey/styled-preact";

export type ButtonProps = { text?: string } & ButtonP

export const ButtonBase = ({styling, text, children, ...props}: { text?: string } & ButtonProps) => {
    return <Button
        {...props}
        type="button"
        style={{
            color: useTheme().buttonText,
            width: Percent.all,
            cursor: 'pointer',
            padding: `${Pixel.of(2)} ${Pixel.of(25)}`,
            userSelect: 'none',
            height: Pixel.field,
            lineHeight: Pixel.field,
        }}>
        {mergeStyling(styling,
            css`
              border-width: 1px;
              border-radius: 5px;

              &:hover {
                filter: brightness(${Percent.of(90)})
              }
            `,
        )}
        {text ?? children}
    </Button>
}

export const ErrorButton = (props: ButtonProps) =>
    <ButtonBase {...props} styling={css`background-color: ${useTheme().errorBackground}`}/>
export const PrimaryButton = (props: ButtonProps) =>
    <ButtonBase {...props} styling={css`background-color: ${useTheme().buttonPrimaryBackground}`}/>
export const SecondaryButton = (props: ButtonProps) =>
    <ButtonBase {...props} styling={css`background-color: ${useTheme().buttonSecondaryBackground}`}/>
export const SuccessButton = (props: ButtonProps) =>
    <ButtonBase {...props} styling={css`background-color: ${useTheme().successBackground}`}/>