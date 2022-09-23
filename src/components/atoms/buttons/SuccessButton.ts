import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { Button } from './Button'

export const SuccessButton = styled( Button )(
	( { theme: { successBackground } }: ThemeProps ) => ( {
		backgroundColor: successBackground,
	} ),
)
