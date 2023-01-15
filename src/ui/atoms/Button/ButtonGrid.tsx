import React from 'react'
import styled from 'styled-components'
import { Pixel } from '../index'

type ContainerProps = {
	isRow?: boolean
}

const radius = Pixel.of( 5 )
export const ButtonGrid = styled.div<ContainerProps>`
  display: flex;
  width: 100%;
  flex-flow: ${ p => p.isRow ? 'row' : 'column' };

  button {
    border-radius: 0;
    border-top-width: ${ p => p.isRow ? Pixel.one : 0 };
    border-right-width: ${ p => p.isRow ? 0 : Pixel.one };
  }

  button:first-child {
    border-top-left-radius: ${ radius };
    border-bottom-left-radius: ${ p => p.isRow ? radius : 0 };
    border-top-right-radius: ${ p => p.isRow ? 0 : radius };
    //noinspection CssReplaceWithShorthandSafely
    border-bottom-right-radius: 0;
    border-top-width: ${ Pixel.one };
  }

  button:last-child {
    border-bottom-right-radius: ${ radius };
    border-top-right-radius: ${ p => p.isRow ? radius : 0 };
    border-bottom-left-radius: ${ p => p.isRow ? 0 : radius };
    //noinspection CssReplaceWithShorthandSafely
    border-top-left-radius: 0;
    border-right-width: ${ Pixel.one };
  }

  button:only-child {
    border-radius: ${ radius };
  }
`