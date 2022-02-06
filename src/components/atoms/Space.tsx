import styled from 'styled-components';

export type SpaceProps = { height: string | number };

export const Space = styled.div<SpaceProps>(({ height }) => ({
  height: `${typeof height === 'string' ? height : `${height}px`}`,
}));
