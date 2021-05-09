import {AlertSection} from './AlertSection';
import * as React from 'react';
import {useEffect, useState} from 'react';
import styled, {useTheme} from 'styled-components';
import {useProvider} from '../Infrastructure';
import {Button, RadioBox, Space} from '../Atoms';
import {MyTheme, StyleTheme} from '../Atoms/StyleTheme';

export function LocalizationAlert() {
    const [isDismissed, setIsDismissed] = useState(false);
    if(isDismissed) return <></>

    const [useDetected, setUseDetected] = useState(true);
    const {activeLocalization} = useProvider();
    const theme = useTheme() as MyTheme;

    useEffect(() => { activeLocalization.reset(!useDetected) }, [useDetected])

    const kroneConflict = activeLocalization.krone.hasConflict();
    const dollarConflict = activeLocalization.dollar.hasConflict();
    const yenConflict = activeLocalization.yen.hasConflict();

    return <AlertSection title="Localization alert">
        <OptionWrapper height={120}>
            <Option>
                <Currency>Detected</Currency>
                {kroneConflict ? <Currency>{activeLocalization.krone.detectedValue}</Currency> : <></>}
                {dollarConflict ? <Currency>{activeLocalization.dollar.detectedValue}</Currency> : <></>}
                {yenConflict ? <Currency>{activeLocalization.yen.detectedValue}</Currency> : <></>}
                <Space height={5}/>
                <RadioBox value={useDetected} onClick={() => setUseDetected(true)}/>
            </Option>
            <Option>
                <Currency>Your defaults</Currency>
                {kroneConflict ? <Currency>{activeLocalization.krone.defaultValue}</Currency> : <></>}
                {dollarConflict ? <Currency>{activeLocalization.dollar.defaultValue}</Currency> : <></>}
                {yenConflict ? <Currency>{activeLocalization.yen.defaultValue}</Currency> : <></>}
                <Space height={5}/>
                <RadioBox value={!useDetected} onClick={() => setUseDetected(false)}/>
            </Option>
        </OptionWrapper>
        <OptionWrapper height={40}>
            <ConfirmButton
                onClick={async () => {
                    await activeLocalization.save();
                    await activeLocalization.setLocked(true);
                    setIsDismissed(true);
                }}
                connect={{right: true}}
                color={theme.buttonPrimary}>Save as site default</ConfirmButton>
            <DismissButton
                onClick={async () => {
                    await activeLocalization.setLocked(false);
                    setIsDismissed(true);
                }}
                connect={{left: true}}
                color={theme.buttonSecondary}>Dismiss alert for now</DismissButton>
        </OptionWrapper>
    </AlertSection>
}

const Currency = styled.div`
  color: ${(props: StyleTheme) => props.theme.normalText};
  width: 100%;
  text-align: center;
`

const ConfirmButton = styled(Button)`
  width: 50%;
`

const DismissButton = styled(Button)`
  width: 50%;
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