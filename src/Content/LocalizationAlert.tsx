import {AlertSection} from './AlertSection';
import * as React from 'react';
import {useState} from 'react';
import styled, {useTheme} from 'styled-components';
import {useProvider} from '../Infrastructure';
import {Button, RadioBox, Space} from '../Atoms';
import {ButtonProps} from '../Atoms/Button';
import {MyTheme, StyleTheme} from '../Atoms/StyleTheme';

export function LocalizationAlert() {
    const [useDetected, setUseDetected] = useState(true);
    const {activeLocalization} = useProvider();
    const theme = useTheme() as MyTheme;

    const kroneConflict = activeLocalization.krone.hasConflict();
    const dollarConflict = activeLocalization.dollar.hasConflict();
    const yenConflict = activeLocalization.yen.hasConflict();

    return <AlertSection title="Localization alert">
        <OptionWrapper height={120}>
            <Option>
                <Currency>Detected</Currency>
                {kroneConflict ? <Currency>{activeLocalization.krone.value}</Currency> : <></>}
                {dollarConflict ? <Currency>{activeLocalization.dollar.value}</Currency> : <></>}
                {yenConflict ? <Currency>{activeLocalization.yen.value}</Currency> : <></>}
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
        <OptionWrapper height={50}>
            <ConfirmButton connect={{right: true}} color={theme.buttonPrimary}>Save as site default</ConfirmButton>
            <DismissButton connect={{left: true}} color={theme.buttonSecondary}>Dismiss alert for now</DismissButton>
        </OptionWrapper>
    </AlertSection>
}

const Currency = styled.div`
  color: ${(props: StyleTheme) => props.theme.normalText};
  width: 100%;
  text-align: center;
`

const ConfirmButton = styled(Button)<ButtonProps>`
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