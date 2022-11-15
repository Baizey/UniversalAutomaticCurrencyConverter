import styled from 'styled-components'

export type SpaceProps = { height: string };
export const Space = styled.div<SpaceProps>( ( { height } ) => ( {
	height: height,
} ) )
