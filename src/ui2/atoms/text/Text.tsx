import {useTheme} from '../contexts'
import {Percent, Pixel} from '../utils'
import {css, Header2, Label, mergeStyling, Span, WithStyle} from "@baizey/styled-preact";

type Props = { text?: string } & WithStyle
export type LinkProps = Props & { href: string; target: string }

export const HeaderText = ({text, children, ...props}: Props) =>
    <Label {...props}>{text ?? children}</Label>

export const FooterText = ({text, children, ...props}: Props) =>
    <Span {...props} style={{
        color: useTheme().footerText,
        fontWeight: 400,
        width: Percent.all,
        fontSize: Pixel.small,
        display: 'inline-block',
    }}>{text ?? children}</Span>

export const Text = ({text, children, ...props}: Props) =>
    <Span {...props} style={{
        width: Percent.all,
        fontSize: Pixel.medium,
        display: 'inline-block',
    }}>{text ?? children}</Span>

export const Title = ({text, children, ...props}: Props) =>
    <Header2 {...props} style={{
        color: useTheme().titleText,
        fontWeight: 700,
        fontSize: Pixel.large,
        height: Pixel.field,
        lineHeight: Pixel.field,
        width: Percent.all,
    }}>{text ?? children}</Header2>


export const Link = ({text, children, styling, ...props}: LinkProps) => {
    const theme = useTheme()
    return <Link  {...props}
                  styling={mergeStyling(styling, css`
                    color: ${theme.linkText};
                    cursor: pointer;
                    text-decoration: none;
                    width: ${Percent.all};

                    &:hover {
                      color: ${theme.linkTextHover};
                    }
                  `)}>{text ?? children}</Link>
}