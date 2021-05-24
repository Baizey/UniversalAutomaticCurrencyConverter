import {ThemeProps} from '../../infrastructure';
import {asPixel, FieldHeight, HalfBorderFieldHeight, SmallTextSize, TextSize, TitleSize} from './Constants';
import styled, {StyledComponent} from 'styled-components';

type ElementType = 'div' | 'input' | 'a' | 'span' | 'h2' | 'label';

export const basicStyle = (props: ThemeProps) => ({
    backgroundColor: props.theme.containerBackground,
    color: props.theme.normalText,
    borderColor: props.theme.inputUnderline,
    borderStyle: 'solid',
    borderWidth: 0,
    fontFamily: 'Calibri, monospace',
    fontSize: asPixel(TextSize),
    fontWeight: 500,
    textAlign: 'center',
    textAlignLast: 'center',
    margin: '0 auto',
    padding: 0
})

function BasicStyle<T>(element: ElementType): StyledComponent<ElementType, any> {
    // @ts-ignore
    return styled[element]((props: T & ThemeProps) => basicStyle(props))
}

const BasicDiv = BasicStyle('div');
const BasicA = BasicStyle('a');
const BasicInput = BasicStyle('input');
const BasicH2 = BasicStyle('h2');
const BasicSpan = BasicStyle('span');
const BasicLabel = BasicStyle('label');

export const Div = BasicDiv;

export type InputProps = { type?: string, readOnly?: boolean, value?: any }
export const Input = styled(BasicInput)<InputProps>`
  height: ${asPixel(HalfBorderFieldHeight)};
  line-height: ${asPixel(HalfBorderFieldHeight)};
  border-bottom-width: 1px;
  appearance: none;
  width: 100%;
`;


export type ButtonProps = {
    connect?: {
        left?: boolean,
        right?: boolean,
        up?: boolean,
        down?: boolean
    }
} & ThemeProps & ({ primary: any } | { secondary: any } | { success: any } | { error: any })

export const Button = styled(Div)<ButtonProps>`
  cursor: pointer;
  padding: 2px 25px;
  height: ${() => asPixel(FieldHeight)};
  line-height: ${() => asPixel(FieldHeight)};
  ${props => ('primary' in props) && `background-color: ${props.theme.buttonPrimary}`}
  ${props => ('secondary' in props) && `background-color: ${props.theme.buttonSecondary}`}
  ${props => ('success' in props) && `background-color: ${props.theme.success}`}
  ${props => ('error' in props) && `background-color: ${props.theme.error}`};

  user-select: none;

  border-bottom-left-radius: ${props => props.connect?.left || props.connect?.down ? '0' : '5px'};
  border-bottom-right-radius: ${props => props.connect?.right || props.connect?.down ? '0' : '5px'};
  border-top-left-radius: ${props => props.connect?.left || props.connect?.up ? '0' : '5px'};
  border-top-right-radius: ${props => props.connect?.right || props.connect?.up ? '0' : '5px'};

  &:hover {
    filter: brightness(85%);
  }
`;

export const NormalText = styled(BasicSpan)({
    width: '100%',
    display: 'inline-block'
})
export const HeaderText = styled(BasicLabel)(props => ({
    width: '100%',
    display: 'inline-block',
    fontSize: asPixel(TextSize),
    color: props.theme.headerText,
    fontWeight: 600
}))
export const FooterText = styled(BasicSpan)(props => ({
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