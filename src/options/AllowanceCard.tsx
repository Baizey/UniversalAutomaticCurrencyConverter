import * as React from 'react';
import {Checkbox, Dropdown, Input} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {Browser, Configuration, Container, IBrowser} from "../Infrastructure";
import {Shortcut} from "../Atoms/Shortcut";
import styled from "styled-components";
import {useRef, useState} from "react";
import {ISetting} from "../Infrastructure/Configuration/Setting";

export function AllowanceCard() {
    const config = Container.factory().configuration;
    const useBlacklist = config.blacklist.using;
    const useWhitelist = config.whitelist.using;
    const whiteurls = config.whitelist.urls;
    const blackurls = config.blacklist.urls;

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