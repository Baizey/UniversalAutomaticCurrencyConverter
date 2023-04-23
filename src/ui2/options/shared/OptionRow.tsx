import {PropsWithChildren} from "preact/compat";
import {css, Div} from "@baizey/styled-preact";

export type OptionRowProps = PropsWithChildren

type ContainerProps = { childrenCount: number } & PropsWithChildren;
const Container = ({children, childrenCount}: ContainerProps) =>
    <Div
        styling={css`
          & {
            width: 100%;
            padding-bottom: 10px;
            display: flex;
            flex-direction: row;

            & > * {
              width: ${100 / childrenCount + '%'};
            }

            // On small screens force column-mode, breakpoint is ~655px but 700px sounds nicer
            @media (max-width: 700px) {
              flex-direction: column;

              & > * {
                width: 100%;
              }

              & > :not(:first-child) {
                margin-top: 10px;
              }
            }
          }
        `}>{children}</Div>


export function OptionRow({children}: OptionRowProps) {
    const listedChildren = Array.isArray(children) ? children : [children]
    return (
        <Container childrenCount={listedChildren.length}>
            {listedChildren}
        </Container>
    )
}