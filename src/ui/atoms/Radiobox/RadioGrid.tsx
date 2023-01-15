import * as React from 'react'
import styled from 'styled-components'

export type RadioGridProps = { isColumn?: boolean }
// noinspection JSUnusedGlobalSymbols
export const RadioGrid = styled.div<RadioGridProps>`
  display: flex;
  flex-direction: ${ ( { isColumn } ) => isColumn ? 'column' : 'row' };
  width: 100%;
  justify-content: space-evenly;
`