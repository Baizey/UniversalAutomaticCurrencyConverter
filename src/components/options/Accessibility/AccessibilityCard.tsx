import * as React from 'react';
import {useState} from 'react';
import {OptionRow, OptionsSection, SettingOption} from "../Shared";
import styled from 'styled-components';
import {ISetting, ThemeProps, useProvider} from '../../../infrastructure';
import {Shortcut} from '../../atoms/Shortcut';
import {Checkbox, Div, Dropdown, StyledInput} from '../../atoms';

export type AccessibilityCardProps = { symbols: { label: string, value: string }[] }

export function AccessibilityCard(props: AccessibilityCardProps) {
    const {
        useLogging,
        blacklistedUrls,
        usingBlacklisting,
        whitelistedUrls,
        usingWhitelisting,
        disabledCurrencies,
        convertHoverShortcut,
        convertAllShortcut,
        usingHoverFlipConversion,
        usingLeftClickFlipConversion,
        usingAutoConversionOnPageLoad
    } = useProvider()

    const [listOfDisabledCurrencies, setListOfDisabledCurrencies] = useState<string[]>(disabledCurrencies.value);

    return <OptionsSection title="Accessibility settings">

        <OptionRow>
            <SettingOption title="Convert-hovered shortcut"
                           help={"Left-click, then click your desired shortcut key, right-click to remove shortcut"}>
                <Shortcut
                    defaultValue={convertHoverShortcut.value}
                    onChange={value => convertHoverShortcut.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert-all shortcut"
                           help={"Left-click, then click your desired shortcut key, right-click to remove shortcut"}>
                <Shortcut
                    defaultValue={convertAllShortcut.value}
                    onChange={value => convertAllShortcut.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow>
            <SettingOption title="Convert pages automatically on load">
                <Checkbox value={usingAutoConversionOnPageLoad.value}
                          onChange={value => usingAutoConversionOnPageLoad.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert prices by left clicking">
                <Checkbox value={usingLeftClickFlipConversion.value}
                          onChange={value => usingLeftClickFlipConversion.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Convert prices on hover over">
                <Checkbox value={usingHoverFlipConversion.value}
                          onChange={value => usingHoverFlipConversion.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow>
            <SettingOption title="Show debug logging">
                <Checkbox value={useLogging.value}
                          onChange={value => useLogging.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>

        <OptionRow>
            <SettingOption title="Search for currencies to disable">
                <Dropdown
                    options={props.symbols}
                    onChange={value => {
                        const newList = listOfDisabledCurrencies.concat([value])
                        newList.sort();
                        if (disabledCurrencies.setValue(newList)) {
                            setListOfDisabledCurrencies(newList)
                            disabledCurrencies.save();
                        }
                    }}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Disabled currencies">
                <DisabledListContainer>
                    {listOfDisabledCurrencies.map(e => <DisabledListItem key={`disable_${e}`} onClick={() => {
                        const newList = listOfDisabledCurrencies.filter(f => f !== e);
                        setListOfDisabledCurrencies(newList);
                        disabledCurrencies.setAndSaveValue(newList);
                    }
                    }>{e}</DisabledListItem>)}
                </DisabledListContainer>
            </SettingOption>
        </OptionRow>

        <OptionRow>
            <SettingOption title="Use blacklist">
                <Checkbox value={usingBlacklisting.value}
                          onChange={value => usingBlacklisting.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Use whitelist">
                <Checkbox value={usingWhitelisting.value}
                          onChange={value => usingWhitelisting.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Check a url against your allowance settings">
                <StyledInput type={"text"} defaultValue={''}
                             onChange={value => {
                           // TODO: this
                       }}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Blacklist">
                <ListHandler setting={blacklistedUrls}/>
            </SettingOption>
            <SettingOption title="Whitelist">
                <ListHandler setting={whitelistedUrls}/>
            </SettingOption>
        </OptionRow>

    </OptionsSection>
}

type ListHandlerProps = { setting: ISetting<string[]> }

function ListHandler({setting}: ListHandlerProps) {
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

const AllowanceListContainer = styled(Div)`
`

const DisabledListContainer = styled(Div)`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
`

const DisabledListItem = styled(Div)`
  width: 99%;
  margin: auto;
  text-align: center;
  border-bottom: ${(props: ThemeProps) => `solid 1px ${props.theme.inputUnderline}`};
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};

  &:hover {
    background-color: ${(props: ThemeProps) => props.theme.backgroundFocus};
    border-color: ${(props: ThemeProps) => props.theme.error};
    cursor: pointer;
  }
`