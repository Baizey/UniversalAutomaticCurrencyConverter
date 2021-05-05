import * as React from 'react';
import styled from "styled-components";
import {Theme} from '../../Atoms/Theme';

type Props = {
    title: string,
    children?: JSX.Element | JSX.Element[],
    help?: string
}

export function SettingOption({title, children, help}: Props): JSX.Element {
    return <Container>
        <Label>{title}</Label>
        {children ? children : <></>}
        {help ? <Help>{help}</Help> : <></>}
    </Container>
}

const Container = styled.div`
`

const Label = styled.label`
  width: 100%;
  margin: auto;
  text-align: center;
  display: block;
  font-size: 14px;
  color:${props => props.theme.subtitleText};
  font-weight: 700;
`

const Help = styled.span`
  display: block;
  width: 100%;
  margin: auto;
  text-align: center;
  color:${({theme}: {theme: Theme}) => theme.helperText};
`