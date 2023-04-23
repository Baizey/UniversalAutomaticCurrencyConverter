import {useProvider} from '../../../di'
import {ButtonGrid, FooterText, Link, Percent, Pixel, PrimaryButton, SecondaryButton, Space, Title,} from '../../atoms'
import {Converter} from '../converter'
import {PropsWithChildren} from "preact/compat";
import {css, Div} from "@baizey/styled-preact";

const Container = ({children}: PropsWithChildren) =>
    <Div styling={css`
      & {
        max-width: calc(${Percent.all} - ${Pixel.of(20)});
        width: ${Pixel.of(600)};
        height: fit-content;
        padding: ${Pixel.of(20)};
        border-width: ${Pixel.one};
      }
    `}>{children}</Div>

export function PopupApp() {
    console.log('PopupApp')
    const {browser, tabMessenger} = useProvider()

    return <Container>
        <Title text="Universal Automatic Currency Converter"/>
        <Converter/>
        <Space height={Pixel.halfField}/>
        <ButtonGrid isRow={false}>
            <SecondaryButton onClick={() => tabMessenger.openContextMenu()}
                             text="Open context menu"/>
            <PrimaryButton onClick={() => window.open('./options.html', '_blank')}
                           text="Go to settings"/>
        </ButtonGrid>
        <FooterText text="Like or hate this extension?"/>
        <FooterText><Link text="Leave a review" href={browser.reviewLink} target="_blank"/></FooterText>
        <FooterText text={`Version ${browser.extensionVersion} created by ${browser.author}`}/>
    </Container>
}