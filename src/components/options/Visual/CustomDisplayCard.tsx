import { useProvider } from '../../../infrastructure';
import { OptionRow, OptionsSection, SettingOption } from '../Shared';
import { Checkbox, NumberInput, TextInput } from '../../atoms';
import * as React from 'react';
import { isFilteredOut } from '../FilterOptionsCard';
import { useFilter } from '../../molecules/contexts/FilterContext';

export function CustomDisplayCard() {
  const { filter } = useFilter();
  const { customDisplay, usingCustomDisplay, customConversionRateDisplay } =
    useProvider();

  if (isFilteredOut(['display', 'custom'], filter)) return <></>;

  return (
    <OptionsSection title="Custom display">
      <OptionRow key="visual_display">
        <SettingOption title="Use custom display">
          <Checkbox
            value={usingCustomDisplay.value}
            onChange={(value) => usingCustomDisplay.setAndSaveValue(value)}
          />
        </SettingOption>
        <SettingOption title="Custom display" help={'¤ becomes the number'}>
          <TextInput
            defaultValue={customDisplay.value}
            onChange={(value) => customDisplay.setAndSaveValue(`${value}`)}
          />
        </SettingOption>
        <SettingOption title="Custom conversion rate">
          <NumberInput
            defaultValue={customConversionRateDisplay.value}
            onChange={(value) =>
              customConversionRateDisplay.setAndSaveValue(+value)
            }
          />
        </SettingOption>
      </OptionRow>
    </OptionsSection>
  );
}
