import {css, Div} from "@baizey/styled-preact";
import {PropsWithChildren} from "preact/compat";

export type RadioGridProps = { isColumn?: boolean } & PropsWithChildren
// noinspection JSUnusedGlobalSymbols
export const RadioGrid = ({isColumn, children}: RadioGridProps) => <Div styling={css`
  display: flex;
  flex-direction: ${isColumn ? 'column' : 'row'};
  width: 100%;
  justify-content: space-evenly;
`} children={children}/>