import * as React from 'react'
import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { Div } from '../Styled'
import { InputProp } from '../utils/InputProp'

export type RadioBoxProps = InputProp<boolean>

export function Radiobox( { value, onClick }: RadioBoxProps ) {
	return <RadioBoxContainer checked={ value }
	                          onClick={ () => onClick() }
	                          children={ <div/> }/>
}

type RadioBoxContainerProps = {
	checked: boolean;
	onClick: () => void;
} & ThemeProps;

const RadioBoxContainer = styled( Div )<RadioBoxContainerProps>(
	( props: RadioBoxContainerProps ) => ( {
		cursor: 'pointer',
		width: '30px',
		height: '30px',
		borderRadius: '15px',
		borderWidth: '1px',
		display: 'block',
		'&:hover': {
			borderColor: props.theme.formBorderFocus,
		},
		'& div': {
			height: '20px',
			width: '20px',
			margin: 'auto',
			marginTop: '5px',
			borderRadius: '10px',
			backgroundColor: props.theme.successBackground,
			transition: 'opacity 0.3s ease-in-out',
			opacity: props.checked ? 1 : 0,
		},
	} ),
)
