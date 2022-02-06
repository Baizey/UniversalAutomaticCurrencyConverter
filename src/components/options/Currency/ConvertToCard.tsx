import { useProvider } from '../../../infrastructure';
import { OptionRow, OptionsSection, SettingOption } from '../Shared';
import { Checkbox, Dropdown } from '../../atoms';
import * as React from 'react';
import { isFilteredOut } from '../FilterOptionsCard';
import { useConfiguration } from '../../molecules';
import { useFilter } from '../../molecules/contexts/FilterContext';

export function ConvertToCard() {
  const { filter } = useFilter();
  const { symbols } = useConfiguration();
  const { convertTo, usingAutoConversionOnPageLoad } = useProvider();

  if (isFilteredOut(['currency', 'automatically', 'convert'], filter))
    return <></>;

  return (
    <OptionsSection title="Currency">
      <OptionRow key="convert_to_row">
        <SettingOption key="convert_to_option" title="Convert to">
          <Dropdown
            options={symbols}
            value={convertTo.value}
            onChange={(value) => convertTo.setAndSaveValue(value)}
          />
        </SettingOption>
      </OptionRow>

      <OptionRow key="brackets_row">
        <SettingOption title="Convert pages automatically on load">
          <Checkbox
            value={usingAutoConversionOnPageLoad.value}
            onChange={(value) =>
              usingAutoConversionOnPageLoad.setAndSaveValue(value)
            }
          />
        </SettingOption>
      </OptionRow>
    </OptionsSection>
  );
}
