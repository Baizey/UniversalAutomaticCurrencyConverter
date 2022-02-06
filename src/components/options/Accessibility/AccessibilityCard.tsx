import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { ISetting, ThemeProps } from '../../../infrastructure';
import { Div, TextInput } from '../../atoms';
import { SiteAllowanceCard } from './SiteAllowanceCard';
import { DisableCurrenciesCard } from './DisableCurrenciesCard';
import { MiscCard } from './MiscCard';
import { MouseInteractionCard } from './MouseInteractionCard';
import { KeyboardShortcutsCard } from './KeyboardShortcutsCard';
import { StorageManagementCard } from './StorageManagementCard';
import { OptionRow, SettingOption } from '../Shared';

export function AccessibilityCard() {
  return (
    <>
      <KeyboardShortcutsCard />
      <MouseInteractionCard />
      <MiscCard />
      <DisableCurrenciesCard />
      <SiteAllowanceCard />
      <StorageManagementCard />
    </>
  );
}

export type ListHandlerProps = {
  whitelistSetting: ISetting<string[]>;
  blacklistSetting: ISetting<string[]>;
};

export function ListHandler({
  whitelistSetting,
  blacklistSetting,
}: ListHandlerProps) {
  const [whitelist, setWhitelist] = useState(whitelistSetting.value || []);
  const [blacklist, setBlacklist] = useState(blacklistSetting.value || []);

  async function removeIfExist(text: string, allowed: boolean) {
    const setting = allowed ? whitelistSetting : blacklistSetting;
    const setter = allowed ? setWhitelist : setBlacklist;
    const list = setting.value.filter((e) => e !== text);
    await setting.setAndSaveValue(list);
    setter(setting.value);
  }

  async function addNew(text: string, allowed: boolean) {
    const setting = allowed ? whitelistSetting : blacklistSetting;
    const setter = allowed ? setWhitelist : setBlacklist;
    const list = setting.value.concat([text]);
    await setting.setAndSaveValue(list);
    await removeIfExist(setting.value[setting.value.length - 1], !allowed);
    setter(setting.value);
  }

  async function removeIfEmpty(text: string, index: number, allowed: boolean) {
    if (text) return;
    const setting = allowed ? whitelistSetting : blacklistSetting;
    const setter = allowed ? setWhitelist : setBlacklist;
    const list = setting.value.filter((e, j) => j !== index);
    await setting.setAndSaveValue(list);
    setter(setting.value);
  }

  async function update(text: string, index: number, allowed: boolean) {
    const setting = allowed ? whitelistSetting : blacklistSetting;
    const setter = allowed ? setWhitelist : setBlacklist;
    const copy = setting.value;
    copy[index] = text;

    await setting.setAndSaveValue(copy);
    await removeIfExist(setting.value[index], !allowed);
    setter(setting.value);
  }

  return (
    <OptionRow>
      <SettingOption title="Blacklist">
        <AllowanceListContainer>
          {blacklist
            .filter((e) => e)
            .map((e, i) => {
              return (
                <TextInput
                  key={`list_${e}`}
                  placeholder={'https://...'}
                  defaultValue={e}
                  onChange={async (value) =>
                    removeIfEmpty(`${value}`, i, false)
                  }
                  onEnter={async (value) => update(`${value}`, i, false)}
                />
              );
            })}
          <TextInput
            key={`${Math.random()}_unique`}
            defaultValue=""
            placeholder={'https://...'}
            onEnter={async (value) => addNew(`${value}`, false)}
          />
        </AllowanceListContainer>
      </SettingOption>
      <SettingOption title="Whitelist">
        <AllowanceListContainer>
          {whitelist
            .filter((e) => e)
            .map((e, i) => {
              return (
                <TextInput
                  key={`list_${e}`}
                  placeholder={'https://...'}
                  defaultValue={e}
                  onChange={async (value) => removeIfEmpty(`${value}`, i, true)}
                  onEnter={async (value) => update(`${value}`, i, true)}
                />
              );
            })}
          <TextInput
            key={`${Math.random()}_unique`}
            defaultValue=""
            placeholder={'https://...'}
            onEnter={async (value) => addNew(`${value}`, true)}
          />
        </AllowanceListContainer>
      </SettingOption>
    </OptionRow>
  );
}

export const AllowanceListContainer = styled(Div)``;

export const DisabledListContainer = styled(Div)`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const DisabledListItem = styled(Div)`
  width: 99%;
  margin: auto;
  text-align: center;
  border-bottom: ${(props: ThemeProps) =>
    `solid 1px ${props.theme.formBorder}`};
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${(props: ThemeProps) => props.theme.containerBackground};

  &:hover {
    background-color: ${(props: ThemeProps) =>
      props.theme.backgroundBorderFocus};
    border-color: ${(props: ThemeProps) => props.theme.errorBackground};
    cursor: pointer;
  }
`;
