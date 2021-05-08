import styled from 'styled-components';
import * as React from 'react'
import {StyleTheme} from './StyleTheme';

type SpaceProps = { height?: number, width?: number }
export const Space = styled.div<SpaceProps>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`

export type ButtonProps = {
    color: string
    connect?: {
        left?: boolean,
        right?: boolean,
        up?: boolean,
        down?: boolean
    }
}
export const Button = styled.div<ButtonProps>`
  cursor: pointer;
  background-color: ${props => props.color};
  color: ${(props: StyleTheme) => props.theme.normalText};
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  
  border-bottom-left-radius: ${props => props.connect?.left || props.connect?.down ? '0' : '5px'};
  border-bottom-right-radius: ${props => props.connect?.right || props.connect?.down ? '0' : '5px'};

  border-top-left-radius: ${props => props.connect?.left || props.connect?.up ? '0' : '5px'};
  border-top-right-radius: ${props => props.connect?.right || props.connect?.up ? '0' : '5px'};
  
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  &:hover {
    filter: brightness(85%);
  }

`