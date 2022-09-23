import styled from 'styled-components'
import { ThemeProps } from '../../../infrastructure'
import { Button } from './Button'

export const ErrorButton = styled( Button )(
	( { theme: { errorBackground } }: ThemeProps ) => ( {
		backgroundColor: errorBackground,
	} ),
)
