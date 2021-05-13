import styled, {useTheme} from "styled-components";
import * as React from 'react';
import {MyTheme, ThemeProps} from '../Atoms/ThemeProps';
import {DeleteIcon} from '../assets';

type Props = {
    title?: string
    onDismiss: () => void
    children?: JSX.Element | JSX.Element[]
}

export function AlertSection({title, children, onDismiss}: Props): JSX.Element {
    const theme = useTheme() as MyTheme
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

const DismissWrapper = styled.div`
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

const InnerWrapper = styled.div`
  margin: 2%;
  width: 96%;
  height: fit-content;
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  width: 100%;
  height: fit-content;
  margin: 0;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};
`

const Header = styled.h2`
  color: ${(props: ThemeProps) => props.theme.titleText};
  width: 100%;
  text-align: center;
  margin: auto;
  font-size: 1.5em;
  font-weight: bold;
  line-height: 1.1;
  padding-top: 5px;
  padding-bottom: 5px;
`