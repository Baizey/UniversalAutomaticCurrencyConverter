import { useProvider } from '../../../infrastructure';
import { OptionRow, OptionsSection, SettingOption } from '../Shared';
import { Checkbox, NumberInput, TextInput } from '../../atoms';
import * as React from 'react';
import { useState } from 'react';
import { isFilteredOut } from '../FilterOptionsCard';
import { useFilter } from '../../molecules/contexts/FilterContext';

export function HighlightCard() {
  const { filter } = useFilter();
  const { usingConversionHighlighting, highlightColor, highlightDuration } =
    useProvider();
  const [color, setColor] = useState(highlightColor.value);

  if (isFilteredOut(['highlight', 'color', 'duration'], filter)) return <></>;

  return (
    <OptionsSection title="Conversion highlight">
      <OptionRow key="visual_highlight">
        <SettingOption title="Highlight conversions">
          <Checkbox
            value={usingConversionHighlighting.value}
            onChange={(value) =>
              usingConversionHighlighting.setAndSaveValue(value)
            }
          />
        </SettingOption>
        <SettingOption
          title="Highlight color"
          help={'Allows oth names and HEX'}
        >
          <TextInput
            borderHoverColor={color}
            defaultValue={color}
            onChange={async (value) =>
              (await highlightColor.setAndSaveValue(`${value}`)) &&
              setColor(highlightColor.value)
            }
          />
        </SettingOption>
        <SettingOption title="Highlight duration" help={'1000 = 1 second'}>
          <NumberInput
            defaultValue={highlightDuration.value}
            onChange={(value) => highlightDuration.setAndSaveValue(+value)}
          />
        </SettingOption>
      </OptionRow>
    </OptionsSection>
  );
}
