import {Pixel} from '../utils'
import {css, Div, DivProps} from "@baizey/styled-preact";

type ContainerProps = { isRow?: boolean } & DivProps

const radius = Pixel.of(5)
export const ButtonGrid = ({isRow, children}: ContainerProps) => {
    if (!Array.isArray(children)) return <>{children}</>
    return <Div
        children={children}
        style={{
            display: 'flex',
            width: '100%',
            flexFlow: isRow ? 'row' : 'column',
        }}
        styling={css`
          & > button {
            border-radius: 0;
            border-top-width: ${isRow ? Pixel.one : 0};
            border-right-width: ${isRow ? 0 : Pixel.one};
          }

          & > button:first-child {
            border-top-left-radius: ${radius};
            border-bottom-left-radius: ${isRow ? radius : 0};
            border-top-right-radius: ${isRow ? 0 : radius};
            border-bottom-right-radius: 0;
            border-top-width: ${Pixel.one};
          }

          & > button:nth-last-child(2) {
            border-bottom-right-radius: ${radius};
            border-top-right-radius: ${isRow ? radius : 0};
            border-bottom-left-radius: ${isRow ? 0 : radius};
            border-top-left-radius: 0;
            border-right-width: ${Pixel.one};
          }
        `}
    />
}