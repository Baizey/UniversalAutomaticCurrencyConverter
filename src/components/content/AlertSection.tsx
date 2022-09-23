import * as React from 'react'
import styled, { useTheme } from 'styled-components'
import { MyTheme, ThemeProps } from '../../infrastructure'
import { DeleteIcon } from '../assets'
import { Div, Title } from '../atoms'

export type AlertSectionProps = {
	title?: string;
	onDismiss: () => void;
	children?: JSX.Element | JSX.Element[];
};

export function AlertSection( {
	                              title,
	                              children,
	                              onDismiss,
                              }: AlertSectionProps ): JSX.Element {
	const theme = useTheme() as MyTheme
	return (
		<Container>
			<DismissWrapper onClick={ onDismiss }>
				<DeleteIcon
					width={ '30px' }
					height={ '30px' }
					color={ theme.errorBackground }
				/>
			</DismissWrapper>
			<InnerWrapper>
				{ title ? <Header>{ title }</Header> : <></> }
				{ children }
			</InnerWrapper>
		</Container>
	)
}

const DismissWrapper = styled( Div )`
  width: 30px;
  height: 30px;
  position: absolute;
  margin-top: 5px;
  right: 5px;
  cursor: pointer;

  &:hover * {
    filter: brightness(85%);
  }
`

const InnerWrapper = styled( Div )`
  width: calc(100% - 10px);
  padding: 5px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
`

const Container = styled( Div )<ThemeProps>`
  width: 100%;
  height: fit-content;
  margin: 0;
  background-color: ${ ( props: ThemeProps ) => props.theme.containerBackground };
`

const Header = styled( Title )<ThemeProps>``
