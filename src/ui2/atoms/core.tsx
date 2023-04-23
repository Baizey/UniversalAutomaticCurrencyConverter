import {JSX} from 'preact'
import {useTheme} from './contexts'
import {Percent, Pixel} from './utils'
import {css, ElementProps, Input, mergeStyling, StyledTheme,} from "@baizey/styled-preact";
import * as React from 'preact/compat'

export type Fun<P = any> = (props: P) => JSX.Element

type InputStyleProps<T = any> = React.HTMLAttributes<HTMLInputElement> & ElementProps & {
    borderHoverColor?: string;
    align?: 'center' | 'left' | 'right';
    placeholder?: string
    placeholderColor?: string
}

export const updateGlobalStyle = () => {
    const theme = useTheme()
    StyledTheme.style = {
        input: css`
          height: ${Pixel.halfField};
          line-height: ${Pixel.halfField};
          border-bottom-width: ${Pixel.one};
          appearance: none;
          width: ${Percent.all};

          &::placeholder {
            color: ${theme.normalText};
          }

          &:hover {
            border-color: ${theme.formBorderFocus};
          }

          &:focus {
            outline: none;
            background-color: ${theme.containerBackground};
            border-color: ${theme.formBorderFocus};
          }
        `,
        shared: css`
          background-color: ${theme.containerBackground};
          color: ${theme.normalText};
          border-color: ${theme.formBorder};
          transition: border-color 0.2s ease-in-out;
          border: 0 solid ${theme.formBorder};
          font-family: Calibri, monospace;
          font-size: ${Pixel.medium};
          font-weight: 500;
          text-align: center;
          text-align-last: center;
          appearance: none;
          margin: 0 auto;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          outline: none;
          vertical-align: auto;

          &:focus {
            outline: none;
            box-shadow: none;
          }
        `
    }
}
updateGlobalStyle()

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
          & {
            text-align: ${align};
            text-align-last: ${align};
            line-height: ${Pixel.fieldWithUnderline};
            height: ${Pixel.fieldWithUnderline};
            font-size: ${Pixel.medium};

          }

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