import * as React from 'react';
import {Checkbox, Dropdown} from "../Atoms";
import {OptionRow, OptionsSection, SettingOption} from "./Shared";
import {useEffect, useState} from "react";
import {Browser, Configuration, IBrowser} from "../Infrastructure";
import {LoadingCard} from "./LoadingCard";
import styled from "styled-components";

export function DisableCurrenciesCard(injection: { browser?: IBrowser, config?: Configuration }) {
    const browser = injection.browser || Browser.instance();
    const config = injection.config || Configuration.instance();
    const disabledCurrencies = config.disabledCurrencies.tags;

    const [list, setList] = useState<string[]>(disabledCurrencies.value || []);
    const [options, setOptions] = useState<{ value: string, label: string }[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        browser.background.getSymbols()
            .then(symbols => Object.entries(symbols)
                .map(([key, value]) => ({
                        label: `${value} (${key})`,
                        value: key
                    })
                )
            ).then(resp => setOptions(resp))
            .then(() => setIsLoading(false))
    }, [])

    if (isLoading) return <LoadingCard title="Disable conversion from currencies"/>
    return <OptionsSection title="Disable conversion from currencies">
        <OptionRow>
            <SettingOption title="Search for currencies to disable">
                <Dropdown
                    options={options}
                    onChange={value => {
                        const newList = list.concat([value])
                        newList.sort();
                        if (disabledCurrencies.setValue(newList)) {
                            setList(newList)
                            disabledCurrencies.save();
                        }
                    }}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Disabled currencies">
                <ListContainer>
                    {list.map(e => <ListItem key={`disable_${e}`} onClick={() => {
                        const newList = list.filter(f => f !== e);
                        setList(newList);
                        disabledCurrencies.setAndSaveValue(newList);
                    }
                    }>{e}</ListItem>)}
                </ListContainer>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}

const ListContainer = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
`

const ListItem = styled.div`
  width: 99%;
  margin: auto;
  text-align: center;
  border-bottom: solid 1px #2F373E;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 14px;
  background-color: #0f161e;

  &:hover {
    background-color: #1C232B;
    border-color: red;
    cursor: pointer;
  }
`