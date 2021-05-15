import {AlertSection} from './AlertSection';
import * as React from 'react';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useProvider} from '../Infrastructure';
import {ThemeProps} from '../Infrastructure/Theme';
// noinspection ES6UnusedImports We need to import everything for it to work in browser
import {RadioBox, RadioBoxContainer, RadioBoxContainerProps, RadioBoxProps} from '../Atoms/RadioBox';
// noinspection ES6UnusedImports We need to import everything for it to work in browser
import {Button, ButtonProps, Space, SpaceProps} from '../Atoms/Button';

type Props = { setDismissed: () => void }

export function LocalizationAlert(props: Props) {
    const [useDetected, setUseDetected] = useState(true);
    const {activeLocalization, theme} = useProvider();

    useEffect(() => { activeLocalization.reset(!useDetected) }, [useDetected])

    const kroneConflict = activeLocalization.krone.hasConflict();
    const dollarConflict = activeLocalization.dollar.hasConflict();
    const yenConflict = activeLocalization.yen.hasConflict();

    return <AlertSection onDismiss={props.setDismissed} title="Localization alert">
        <OptionWrapper height={120}>
            <Option>
                <Subtitle >Use detected</Subtitle>
                {kroneConflict ?
                    <Currency >{activeLocalization.krone.detectedValue}</Currency> : <></>}
                {dollarConflict ?
                    <Currency >{activeLocalization.dollar.detectedValue}</Currency> : <></>}
                {yenConflict ?
                    <Currency >{activeLocalization.yen.detectedValue}</Currency> : <></>}
                <Space height={5}/>
                <RadioBox value={useDetected} onClick={() => setUseDetected(true)}/>
            </Option>
            <Option>
                <Subtitle >Use your defaults</Subtitle>
                {kroneConflict ?
                    <Currency >{activeLocalization.krone.defaultValue}</Currency> : <></>}
                {dollarConflict ?
                    <Currency >{activeLocalization.dollar.defaultValue}</Currency> : <></>}
                {yenConflict ?
                    <Currency >{activeLocalization.yen.defaultValue}</Currency> : <></>}
                <Space height={5}/>
                <RadioBox value={!useDetected} onClick={() => setUseDetected(false)}/>
            </Option>
        </OptionWrapper>
        <Button
            onClick={async () => {
                await activeLocalization.save();
                await activeLocalization.setLocked(true);
                props.setDismissed()
            }}
            color={theme.buttonPrimary}>Save as site default and dont ask again
        </Button>
    </AlertSection>

}

// For some reason having the radio box implemented outside of the file fucks up react-running pages like binance.com
/*
export function RadioBox({value, onClick}: RadioBoxProps) {
    const {theme} = useProvider()
    return <RadioBoxContainer
        
        checked={value}
        onClick={() => onClick()}>
        <div/>
    </RadioBoxContainer>
}
 */

const Subtitle = styled.div<ThemeProps>`
  color: ${props => props.theme.normalText};
  font-weight: 600;
  width: 100%;
  text-align: center;
`

const Currency = styled.div<ThemeProps>`
  color: ${props => props.theme.normalText};
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