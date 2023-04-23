import {PropsWithChildren} from "preact/compat";
import {Title, useTheme} from "../../atoms";
import {css, Div} from "@baizey/styled-preact";

type Props = PropsWithChildren & {
    title?: string;
};

const Container = ({children}: PropsWithChildren) => {
    const theme = useTheme()
    return <Div
        styling={css`
          & {
            padding: 10px;
            background-color: ${theme.containerBackground};
            display: flex;
            flex-direction: column;
            border-width: 1px;
            border-color: ${theme.containerBorder};

            // On small screens force column-mode, breakpoint is ~655px but 700px sounds nicer
            @media (max-width: 820px) {
              margin-left: 10px;
              margin-right: 10px;
            }
          }


          &:first-child {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
          }

          &:not(:first-child) {
            margin-top: 10px;
          }

          &:last-child {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
          }

          &:not(:last-child) {
          }
        `}>{children}</Div>
}

export function OptionsSection({title, children}: Props) {
    return (
        <Container>
            {title ? <Title>{title}</Title> : <></>}
            {children}
        </Container>
    )
}