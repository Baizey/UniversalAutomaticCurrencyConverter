import styled from "styled-components";
import * as React from 'react';
import {StyleTheme} from '../Atoms/StyleTheme';

type Props = {
    title?: string
    children?: JSX.Element | JSX.Element[]
}

export function AlertSection({title, children}: Props): JSX.Element {
    return <Container>
        <InnerWrapper>
            {title ? <Header>{title}</Header> : <></>}
            {children}
        </InnerWrapper>
    </Container>
}

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
  background-color: ${(props: StyleTheme) => props.theme.containerBackground};

  &:hover {
    border-color: ${(props: StyleTheme) => props.theme.borderDimFocus};
  }
`

const Header = styled.h2`
  color: ${(props: StyleTheme) => props.theme.titleText};
  width: 100%;
  text-align: center;
  margin: auto;
  font-size: 18px;
  line-height: 1.1;
  padding-top: 5px;
  padding-bottom: 5px;
  font-weight: 700;
`