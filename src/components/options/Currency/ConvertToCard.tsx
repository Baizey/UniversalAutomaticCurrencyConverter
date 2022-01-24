import { useProvider } from "../../../infrastructure";
import { OptionRow, OptionsSection, SettingOption } from "../Shared";
import { Checkbox, Dropdown } from "../../atoms";
import * as React from "react";
import { OptionCardProps } from "../OptionsApp";
import { isFilteredOut } from "../FilterOptionsCard";

export function ConvertToCard(props: OptionCardProps) {
  const { convertTo, usingAutoConversionOnPageLoad } = useProvider();

  if (isFilteredOut(["currency", "automatically", "convert"], props.filter))
    return <></>;

  return <OptionsSection title="Currency">
    <OptionRow key="convert_to_row">
      <SettingOption key="convert_to_option" title="Convert to">
        <Dropdown
          options={props.symbols}
          value={convertTo.value}
          onChange={value => convertTo.setAndSaveValue(value)} />
      </SettingOption>
    </OptionRow>

    <OptionRow key="brackets_row">
      <SettingOption title="Convert pages automatically on load">
        <Checkbox value={usingAutoConversionOnPageLoad.value}
                  onChange={value => usingAutoConversionOnPageLoad.setAndSaveValue(value)} />
      </SettingOption>
    </OptionRow>
  </OptionsSection>;
}