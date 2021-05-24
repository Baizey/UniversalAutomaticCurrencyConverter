import * as React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import {ISetting, ThemeProps} from '../../../infrastructure';
import {Div, StyledInput} from '../../atoms';
import {SiteAllowanceCard} from './SiteAllowanceCard';
import {DisableCurrenciesCard} from './DisableCurrenciesCard';
import {MiscCard} from './MiscCard';
import {MouseInteractionCard} from './MouseInteractionCard';
import {ShortcutsCard} from './ShortcutsCard';

export type AccessibilityCardProps = { symbols: { label: string, value: string }[] }

export function AccessibilityCard(props: AccessibilityCardProps) {
    return <>
        <ShortcutsCard/>
        <MouseInteractionCard/>
        <MiscCard/>
        <DisableCurrenciesCard symbols={props.symbols}/>
        <SiteAllowanceCard/>
    </>
}

export type ListHandlerProps = { setting: ISetting<string[]> }

export function ListHandler({setting}: ListHandlerProps) {
    const [list, setList] = useState(setting.value || [])
    return <AllowanceListContainer>
        {list.filter(e => e).map((e, i) => {
            return <StyledInput
                key={`list_${e}`}
                type="text"
                placeholder={"https://..."}
                defaultValue={e}
                onChange={value => {
                    if (value) return;
                    let newList = list.filter((e, j) => j !== i)
                    setList(newList)
                    setting.setAndSaveValue(newList)
                }}
                onEnter={value => {
                    if (!value) return;
                    let newList = list.map(e => e)
                    newList[i] = '' + value;
                    setList(newList)
                    setting.setAndSaveValue(newList)

                }}/>
        })}
        <StyledInput key={`${Math.random()}_unique`} type="text" defaultValue="" placeholder={"https://..."}
                     onEnter={value => {
                         const newList = list.concat(['' + value])
                         setList(newList)
                         setting.setAndSaveValue(newList)
                     }}/>
    </AllowanceListContainer>
}

export const AllowanceListContainer = styled(Div)`
`

export const DisabledListContainer = styled(Div)`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
`

export const DisabledListItem = styled(Div)`
  width: 99%;
  margin: auto;
  text-align: center;
  border-bottom: ${(props: ThemeProps) => `solid 1px ${props.theme.formBorder}`};
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};

  &:hover {
    background-color: ${(props: ThemeProps) => props.theme.backgroundBorderFocus};
    border-color: ${(props: ThemeProps) => props.theme.errorBackground};
    cursor: pointer;
  }
`