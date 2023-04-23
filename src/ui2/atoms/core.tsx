import {JSX} from 'preact'
import {useTheme} from './contexts'
import {Pixel} from './utils'
import {css, Input, InputProps as InputP, mergeStyling,} from "@baizey/styled-preact";
import * as React from 'preact/compat'

export type Fun<P = any> = (props: P) => JSX.Element

type InputStyleProps<T = any> = InputP & {
    borderHoverColor?: string;
    align?: 'center' | 'left' | 'right';
    placeholder?: string
    placeholderColor?: string
}

export const RawTextInput: Fun = ({
                                      styling,
                                      align = 'center',
                                      borderHoverColor,
                                      placeholderColor,
                                      ...props
                                  }: InputStyleProps<string>) => {
    const theme = useTheme()
    return <Input
        {...props}
        type="text"
        styling={mergeStyling(styling, css`
          text-align: ${align};
          text-align-last: ${align};
          line-height: ${Pixel.fieldWithUnderline};
          height: ${Pixel.fieldWithUnderline};
          font-size: ${Pixel.medium};

          &::placeholder {
            color: ${placeholderColor || theme.footerText}
          }

          &:hover {
            filter: brightness(110%);
            border-color: ${borderHoverColor || theme.formBorderFocus};
          }

          &:focus {
            filter: brightness(110%);
            border-color: ${borderHoverColor || theme.formBorderFocus};
            outline: 0;
          }
        `)
        }/>
}
export const RawNumberInput: Fun = ({
                                        styling,
                                        placeholderColor,
                                        align = 'center',
                                        borderHoverColor,
                                        ...props
                                    }: InputStyleProps<number>) => {
    const theme = useTheme()
    return <Input
        {...props}
        type="number"
        styling={mergeStyling(styling,
            css`
              text-align: ${align};
              text-align-last: ${align};
              line-height: ${Pixel.fieldWithUnderline};
              height: ${Pixel.fieldWithUnderline};
              font-size: ${Pixel.medium};

              &::placeholder {
                color: ${placeholderColor || theme.footerText}
              }

              &:hover {
                filter: brightness(110%);
                border-color: ${borderHoverColor || theme.formBorderFocus};
              }

              &:focus {
                filter: brightness(110%);
                border-color: ${borderHoverColor || theme.formBorderFocus};
                outline: 0;
              }
            `,)}/>
}

export const RawRangeInput: Fun = ({styling, ...props}: InputStyleProps<number>) => {
    return <Input
        {...props}
        type="range"
        styling={mergeStyling(styling,
            css`
              border-bottom-width: 0;
              line-height: ${Pixel.fieldWithUnderline};
              height: ${Pixel.fieldWithUnderline};
              font-size: ${Pixel.medium};
            `)}
    />
}