import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { Button } from './Button'

export const SecondaryButton = styled( Button )(
	( { theme: { buttonSecondaryBackground } }: ThemeProps ) => ( {
		backgroundColor: buttonSecondaryBackground,
	} ),
)
