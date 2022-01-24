import styled from "styled-components";
import { asPixel } from "./Constants";

export type SpaceProps = { height: number | string }

export const Space = styled.div<SpaceProps>(props => ({
  height: `${typeof props.height === "string" ? props.height : asPixel(props.height)}`
}));