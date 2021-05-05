import * as React from 'react';
import {useState} from 'react';
import {Checkbox, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {ISetting, useProvider} from "../Infrastructure";
import styled from "styled-components";

export function AllowanceCard() {
    const {configurationBlacklist, configurationWhitelist} = useProvider()
    const useBlacklist = configurationBlacklist.using;
    const blackurls = configurationBlacklist.urls;
    const useWhitelist = configurationWhitelist.using;
    const whiteurls = configurationWhitelist.urls;

    const [blacklist, setBlacklist] = useState(blackurls.value || [])
    const [whitelist, setWhitelist] = useState(whiteurls.value || [])

    return <OptionsSection title="Site allowance">
        <OptionRow>
            <SettingOption title="Use blacklist">
                <Checkbox value={useBlacklist.value}
                          onChange={value => useBlacklist.setAndSaveValue(value)}/>
            </SettingOption>
            <SettingOption title="Use whitelist">
                <Checkbox value={useWhitelist.value}
                          onChange={value => useWhitelist.setAndSaveValue(value)}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Check a url against your allowance settings">
                <Input type={"text"} value={''}
                       onChange={value => {
                           // TODO: this
                       }}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Blacklist">
                <ListHandler setting={blackurls}/>
            </SettingOption>
            <SettingOption title="Whitelist">
                <ListHandler setting={whiteurls}/>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}

type ListHandlerProps = { setting: ISetting<string[]> }

function ListHandler({setting}: ListHandlerProps) {
    const [list, setList] = useState(setting.value || [])
    return <ListContainer>
        {list.filter(e => e).map((e, i) => {
            return <Input
                key={`list_${e}`}
                type="text"
                placeholder={"https://..."}
                value={e}
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
        <Input key={`${Math.random()}_unique`} type="text" value="" placeholder={"https://..."}
               onEnter={value => {
                   const newList = list.concat(['' + value])
                   setList(newList)
                   setting.setAndSaveValue(newList)
               }}/>
    </ListContainer>
}

const ListContainer = styled.div`
`