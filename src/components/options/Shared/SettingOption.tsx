import * as React from 'react';
import styled from "styled-components";
import {ThemeProps} from '../../../infrastructure';
import {Div, HeaderText, FooterText} from '../../atoms';

export type SettingOptionProps = {
    title: string,
    children?: JSX.Element | JSX.Element[],
    help?: string
}

export function SettingOption({title, children, help}: SettingOptionProps): JSX.Element {
    return <Container>
        <Label>{title}</Label>
        {children ? children : <></>}
        {help ? <Help>{help}</Help> : <></>}
    </Container>
}

const Container = styled(Div)`
`

const Label = styled(HeaderText)`
  width: 100%;
  text-align: center;
  display: block;
`

const Help = styled(FooterText)`
  display: block;
  width: 100%;
  text-align: center;
  color:${(props: ThemeProps) => props.theme.footerText};
`