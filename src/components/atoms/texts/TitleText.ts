import styled from 'styled-components';
import { basicStyle } from '../Basics';
import { FieldHeight, TitleSize } from '../Constants';

export const Title = styled.h2((props) => ({
  ...basicStyle(props),
  color: props.theme.titleText,
  fontWeight: 700,
  fontSize: TitleSize.pixel,
  height: FieldHeight.pixel,
  lineHeight: FieldHeight.pixel,
  width: '100%',
}));
