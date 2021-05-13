import * as React from 'react';
import {OptionRow, OptionsSection} from "./Shared";
import styled from "styled-components";
import {ThemeProps} from '../Atoms/ThemeProps';

type Props = {
    progress: number
    next: () => void
    skip: () => void
}

export function FirstTimeProgressCard({progress, skip, next}: Props) {
    return <OptionsSection>
        {progress < 100 ? <></> :
            <OptionRow>
                <Button onClick={skip}>Done</Button>
            </OptionRow>
        }
        {progress >= 100 ? <></> :
            <OptionRow>
                <Button onClick={skip}>Skip all</Button>
                <Button onClick={next}>Next</Button>
            </OptionRow>
        }
        <OptionRow>
            <Progress progress={progress}/>
        </OptionRow>
    </OptionsSection>
}

const Button = styled.button`
  width: 100%;
  margin: 0;
  height: 50px;
  line-height: 2;
  text-align: center;
  font-size: 20px;
  font-weight: 700;

  &:hover {
    background-color: ${(props: ThemeProps) => props.theme.backgroundFocus}
  }
`

type ProgressProps = { progress: number }
const Progress = styled.div<ProgressProps>`
  height: 10px;
  background-color: ${(props: ThemeProps) => props.theme.success};
  width: ${({progress}) => `${progress}%`};
  float: left;
`