import styled from 'styled-components';
import { ThemeProps } from '../../../infrastructure';
import { Button } from './Button';

export const PrimaryButton = styled(Button)(
  ({ theme: { buttonPrimaryBackground } }: ThemeProps) => ({
    backgroundColor: buttonPrimaryBackground,
  })
);
