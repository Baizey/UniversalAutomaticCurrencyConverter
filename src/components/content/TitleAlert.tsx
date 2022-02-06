import * as React from 'react';
import styled from 'styled-components';
import { ThemeProps, useProvider } from '../../infrastructure';
import { Div, FooterText } from '../atoms';

export function TitleAlert() {
  const { browser } = useProvider();
  return (
    <Container>
      <MenuTitle>{browser.extensionName}</MenuTitle>
    </Container>
  );
}

const Container = styled(Div)<ThemeProps>((props: ThemeProps) => ({
  paddingTop: '10px',
  paddingBottom: '10px',
  borderWidth: '1px',
  backgroundColor: props.theme.containerBorder,
  color: props.theme.headerText,
  textAlign: 'center',
  height: 'fit-content',
}));

const MenuTitle = styled(FooterText)<ThemeProps>`
  color: ${(props) => props.theme.normalText};
  background-color: ${(props) => props.theme.containerBorder};
`;
