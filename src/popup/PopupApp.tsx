import * as React from "react";
import {useProvider} from '../Infrastructure';
import styled, {useTheme} from 'styled-components';
import {MyTheme, ThemeProps} from '../Atoms/ThemeProps';
import {Button, Space} from "../Atoms";
import {Converter} from './Converter';

type Props = { isLoading: boolean }
export default function PopupApp({isLoading}: Props) {
    if(isLoading) return <>Loading...</>
    const theme = useTheme() as MyTheme
    const {browser} = useProvider();

    return <Container>

        <Title>Universal Automatic Currency Converter</Title>

        <Converter/>

        <Space height={20}/>

        <Button color={theme.buttonSecondary}
                onClick={() => {browser.tab.contextMenu()}}
                connect={{down: true}}>
            Open context menu
        </Button>

        <HiddenLink href="./options.html" target="_blank">
            <Button color={theme.buttonPrimary}
                    connect={{up: true}}>
                Go to settings
            </Button>
        </HiddenLink>

        <Footer>Like or hate this extension?</Footer>
        <Footer><Link href={browser.reviewLink} target="_blank">Leave a review</Link></Footer>
        <Footer>{`Version ${browser.extensionVersion} created by ${browser.author}`}</Footer>
    </Container>
}

const Title = styled.h2`
  color: ${(props: ThemeProps) => props.theme.titleText};
  width: 100%;
  text-align: center;
  max-height: 800px;
  margin: auto;
  font-size: 18px;
  line-height: 1.1;
  padding-top: 5px;
  padding-bottom: 5px;
  font-weight: 700;
`

const Container = styled.div`
  width: 700px;
  height: fit-content;
  padding: 20px;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};
  border: ${(props: ThemeProps) => `1px solid ${props.theme.containerBackground}`};
`

const HiddenLink = styled.a`
  color: inherit;
  text-decoration: none;
`

const Footer = styled.div`
  margin: auto;
  text-align: center;
  color: ${(props: ThemeProps) => props.theme.footerText};
`
const Link = styled.a`
  color: ${(props: ThemeProps) => props.theme.link};

  &:hover {
    color: ${(props: ThemeProps) => props.theme.linkHover};
  }
`