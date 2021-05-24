import styled, {useTheme} from "styled-components";
import * as React from 'react';
import {MyTheme, ThemeProps, useProvider} from '../../infrastructure';
import {DeleteIcon} from '../assets';
import {Div, Title} from '../atoms';

export type AlertSectionProps = {
    title?: string
    onDismiss: () => void
    children?: JSX.Element | JSX.Element[]
}

export function AlertSection({title, children, onDismiss}: AlertSectionProps): JSX.Element {
    const theme = useTheme() as MyTheme;
    return <Container>
        <DismissWrapper onClick={onDismiss}>
            <DeleteIcon width={'30px'} height={'30px'} color={theme.error}/>
        </DismissWrapper>
        <InnerWrapper>
            {title ? <Header>{title}</Header> : <></>}
            {children}
        </InnerWrapper>
    </Container>
}

const DismissWrapper = styled(Div)`
  width: 30px;
  height: 30px;
  position: absolute;
  margin-top: 5px;
  right: 5px;
  cursor: pointer;

  &:hover {
    filter: brightness(85%);
  }
`

const InnerWrapper = styled(Div)`
  margin: 2%;
  width: 96%;
  height: fit-content;
  display: flex;
  flex-direction: column;
`

const Container = styled(Div)<ThemeProps>`
  width: 100%;
  height: fit-content;
  margin: 0;
  background-color: ${props => props.theme.containerBackground};
`

const Header = styled(Title)<ThemeProps>`
`