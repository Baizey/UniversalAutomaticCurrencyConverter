import {FooterText, HeaderText, Percent, useTheme} from '../../atoms'
import {PropsWithChildren} from "preact/compat";
import {css, Div, ElementProps, mergeStyling} from "@baizey/styled-preact";

export type SettingOptionProps = PropsWithChildren & {
    title: string;
    help?: string;
};

const Container = ({styling, ...props}: ElementProps) =>
    <Div {...props}
         styling={mergeStyling(styling, css`
           width: ${Percent.all};
         `)}
    />

const Label = (props: PropsWithChildren) =>
    <HeaderText{...props}
               styling={css`
                 width: ${Percent.all};
                 text-align: center;
                 display: block;
               `}/>

const Help = (props: PropsWithChildren) =>
    <FooterText {...props}
                styling={css`
                  width: ${Percent.all};
                  text-align: center;
                  display: block;
                  color: ${useTheme().footerText};
                `}/>

export function SettingOption({title, children, help}: SettingOptionProps) {
    return (
        <Container>
            <Label>{title}</Label>
            {children ? children : <></>}
            {help ? <Help>{help}</Help> : <></>}
        </Container>
    )
}
