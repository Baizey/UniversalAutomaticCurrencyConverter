import styled from 'styled-components';
import { basicStyle } from '../Basics';

export const NormalText = styled.span((props) => ({
  ...basicStyle(props),
  width: '100%',
  display: 'inline-block',
}));
