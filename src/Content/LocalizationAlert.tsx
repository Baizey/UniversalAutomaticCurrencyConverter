import {AlertSection} from './AlertSection';
import * as React from 'react';
import {useEffect, useState} from 'react';
import styled, {useTheme} from 'styled-components';
import {useProvider} from '../Infrastructure';
import {Button, RadioBox, Space} from '../Atoms';
import {MyTheme, ThemeProps} from '../Atoms/ThemeProps';

type Props = { setDismissed: () => void }

export function LocalizationAlert({setDismissed}: Props) {
    const [useDetected, setUseDetected] = useState(true);
    const {activeLocalization} = useProvider();
    const theme = useTheme() as MyTheme;

    useEffect(() => { activeLocalization.reset(!useDetected) }, [useDetected])

    const kroneConflict = activeLocalization.krone.hasConflict();
    const dollarConflict = activeLocalization.dollar.hasConflict();
    const yenConflict = activeLocalization.yen.hasConflict();

    return <AlertSection onDismiss={setDismissed} title="Localization alert">
        <OptionWrapper height={120}>
            <Option>
                <Subtitle>Use detected</Subtitle>
                {kroneConflict ? <Currency>{activeLocalization.krone.detectedValue}</Currency> : <></>}
                {dollarConflict ? <Currency>{activeLocalization.dollar.detectedValue}</Currency> : <></>}
                {yenConflict ? <Currency>{activeLocalization.yen.detectedValue}</Currency> : <></>}
                <Space height={5}/>
                <RadioBox value={useDetected} onClick={() => setUseDetected(true)}/>
            </Option>
            <Option>
                <Subtitle>Use your defaults</Subtitle>
                {kroneConflict ? <Currency>{activeLocalization.krone.defaultValue}</Currency> : <></>}
                {dollarConflict ? <Currency>{activeLocalization.dollar.defaultValue}</Currency> : <></>}
                {yenConflict ? <Currency>{activeLocalization.yen.defaultValue}</Currency> : <></>}
                <Space height={5}/>
                <RadioBox value={!useDetected} onClick={() => setUseDetected(false)}/>
            </Option>
        </OptionWrapper>
        <Button
            onClick={async () => {
                await activeLocalization.save();
                await activeLocalization.setLocked(true);
                setDismissed()
            }}
            color={theme.buttonPrimary}>Save as site default and dont ask again
        </Button>
    </AlertSection>
}

const Subtitle = styled.div`
  color: ${(props: ThemeProps) => props.theme.normalText};
  font-weight: 600;
  width: 100%;
  text-align: center;
`

const Currency = styled.div`
  color: ${(props: ThemeProps) => props.theme.normalText};
  width: 100%;
  text-align: center;
`

type OptionWrapperType = { height: number }
const OptionWrapper = styled.div<OptionWrapperType>`
  width: 100%;
  height: ${props => `${props.height}px`};
  display: flex;
  flex-direction: row;
`

const Option = styled.div`
  width: 50%;
`