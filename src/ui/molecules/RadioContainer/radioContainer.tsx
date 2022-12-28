import * as React from 'react'
import styled from 'styled-components'
import { Radiobox, RadioBoxProps } from '../../atoms'

export enum RadioDisplay {
	row = 'row',
	column = 'column'
}

export type RadioContainerProps = {
	key?: string,
	display?: RadioDisplay,
	options: RadioBoxProps[]
}

export function RadioContainer( {
	                                display = RadioDisplay.row,
	                                options,
	                                key = '',
                                }: RadioContainerProps ) {

	return <RadioContainerDiv display={ display }>
		{ options.map( ( e, i ) => <Radiobox key={ `radiobox_${ key }_${ i }` }{ ...e }/> ) }
	</RadioContainerDiv>
}

type RadioContainerDivProps = { display: RadioDisplay }
const RadioContainerDiv = styled.div<RadioContainerDivProps>`
  display: flex;
  flex-direction: ${ ( { display }: RadioContainerDivProps ) => display };
  width: 100%;
  justify-content: space-evenly;
`
const RadioItemDiv = styled.div`
  display: flex;
`