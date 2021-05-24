import styled from 'styled-components';

export type SpaceProps = { height: number }

export const Space = styled.div<SpaceProps>(props => ({
    height: `${props.height}px`
}))