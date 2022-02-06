import { ThemeProps } from '../../../infrastructure';
import styled from 'styled-components';
import { FieldHeight } from '../Constants';
import { basicStyle } from '../Basics';

export type ButtonProps = {
  connect?: {
    left?: boolean;
    right?: boolean;
    up?: boolean;
    down?: boolean;
  };
} & ThemeProps;

export const Button = styled.button<ButtonProps>((props: ButtonProps) => ({
  ...basicStyle(props),
  width: '100%',
  cursor: 'pointer',
  padding: '2px 25px',
  'user-select': 'none',
  height: FieldHeight.pixel,
  lineHeight: FieldHeight.pixel,
  color: props.theme.buttonText,
  borderBottomLeftRadius:
    props.connect?.left || props.connect?.down ? '0' : '5px',
  borderBottomRightRadius:
    props.connect?.right || props.connect?.down ? '0' : '5px',
  borderTopLeftRadius: props.connect?.left || props.connect?.up ? '0' : '5px',
  borderTopRightRadius: props.connect?.right || props.connect?.up ? '0' : '5px',
  '&:hover': {
    filter: 'brightness(90%)',
  },
}));
