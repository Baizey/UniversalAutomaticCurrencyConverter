import {ThemeProps} from '../../infrastructure';
import {asPixel, FieldHeight, HalfBorderFieldHeight, SmallTextSize, TextSize, TitleSize} from './Constants';
import styled, {StyledComponent} from 'styled-components';

type ElementType = 'div' | 'a' | 'span' | 'h2' | 'label';

export const basicStyle = (props: ThemeProps) => ({
    backgroundColor: props.theme.containerBackground,
    color: props.theme.normalText,
    borderColor: props.theme.formBorder,
    transition: 'border-color 0.2s ease-in-out',
    borderStyle: 'solid',
    borderWidth: 0,
    fontFamily: 'Calibri, monospace',
    fontSize: asPixel(TextSize),
    fontWeight: 500,
    textAlign: 'center',
    textAlignLast: 'center',
    appearance: 'none',
    margin: '0 auto',
    padding: 0
})

function BasicStyle<T>(element: ElementType): StyledComponent<ElementType, any> {
    // @ts-ignore
    return styled[element]((props: T & ThemeProps) => basicStyle(props))
}

const BasicDiv = BasicStyle('div');
const BasicA = BasicStyle('a');

const baseInputStyle = (props: ThemeProps) => ({
    ...basicStyle(props),
    height: asPixel(HalfBorderFieldHeight),
    lineHeight: asPixel(HalfBorderFieldHeight),
    borderBottomWidth: '1px',
    appearance: 'none',
    width: '100%',
    '&:hover': {
        borderColor: props.theme.formBorderFocus
    },
    '&:focus': {
        borderColor: props.theme.formBorderFocus
    }
})

// @ts-ignore
const BasicInput = styled.input<ThemeProps>((props: ThemeProps) => ({
    ...baseInputStyle(props),
    '&[type="text"]': baseInputStyle(props),
    '&[type="number"]': baseInputStyle(props),
    '&[type="range"]': baseInputStyle(props),
}))
const BasicH2 = BasicStyle('h2');
const BasicSpan = BasicStyle('span');
const BasicLabel = BasicStyle('label');

export const Div = BasicDiv;

export type InputProps = { type?: string, readOnly?: boolean, value?: any }
export const BaseInput = styled(BasicInput)<InputProps>``;


export type ButtonProps = {
    connect?: {
        left?: boolean,
        right?: boolean,
        up?: boolean,
        down?: boolean
    }
} & ThemeProps & ({ primary: any } | { secondary: any } | { success: any } | { error: any })

function buttonColor(props: ButtonProps): string {
    if ('primary' in props) return props.theme.buttonPrimaryBackground
    if ('secondary' in props) return props.theme.buttonSecondaryBackground
    if ('success' in props) return props.theme.successBackground
    if ('error' in props) return props.theme.errorBackground
    throw new Error('No button color found')
}

export const Button = styled(Div)<ButtonProps>((props: ButtonProps) => ({
    cursor: 'pointer',
    padding: '2px 25px',
    'user-select': 'none',
    height: asPixel(FieldHeight),
    lineHeight: asPixel(FieldHeight),
    color: props.theme.buttonText,
    backgroundColor: buttonColor(props),
    borderBottomLeftRadius: props.connect?.left || props.connect?.down ? '0' : '5px',
    borderBottomRightRadius: props.connect?.right || props.connect?.down ? '0' : '5px',
    borderTopLeftRadius: props.connect?.left || props.connect?.up ? '0' : '5px',
    borderTopRightRadius: props.connect?.right || props.connect?.up ? '0' : '5px',
    '&:hover': {
        filter: 'brightness(90%)'
    },
}))

export const NormalText = styled(BasicSpan)({
    width: '100%',
    display: 'inline-block'
})
export const HeaderText = styled(BasicLabel)((props: ThemeProps) => ({
    width: '100%',
    display: 'inline-block',
    fontSize: asPixel(TextSize),
    color: props.theme.headerText,
    fontWeight: 600
}))
export const FooterText = styled(BasicSpan)((props: ThemeProps) => ({
    width: '100%',
    display: 'inline-block',
    fontSize: asPixel(SmallTextSize),
    color: props.theme.footerText,
    fontWeight: 400
}))

export type LinkProps = { href: string, target: string }
export const Link = styled(BasicA)<LinkProps>(props => ({
    cursor: 'pointer',
    color: props.theme.link,
    textDecoration: 'none',
    width: '100%',
    '&:hover': {
        color: props.theme.linkHover
    }
}))


export const Title = styled(BasicH2)(props => ({
    color: props.theme.titleText,
    fontWeight: 700,
    fontSize: asPixel(TitleSize),
    height: asPixel(FieldHeight),
    lineHeight: asPixel(FieldHeight),
    width: '100%'
}))