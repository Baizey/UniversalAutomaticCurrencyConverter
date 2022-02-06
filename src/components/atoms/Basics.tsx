import { ThemeProps } from '../../infrastructure';
import { TextSize } from './Constants';
import styled from 'styled-components';

export const basicStyle = (props: ThemeProps): any => ({
  backgroundColor: props.theme.containerBackground,
  color: props.theme.normalText,
  borderColor: props.theme.formBorder,
  transition: 'border-color 0.2s ease-in-out',
  borderStyle: 'solid',
  borderWidth: 0,
  fontFamily: 'Calibri, monospace',
  fontSize: TextSize.pixel,
  fontWeight: 500,
  textAlign: 'center',
  textAlignLast: 'center',
  appearance: 'none',
  margin: '0 auto',
  padding: 0,
});

export const Div = styled.div((props: ThemeProps) => ({
  ...basicStyle(props),
}));
