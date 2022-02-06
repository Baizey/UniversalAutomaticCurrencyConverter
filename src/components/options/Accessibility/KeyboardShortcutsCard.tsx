import { useProvider } from '../../../infrastructure';
import { OptionRow, OptionsSection, SettingOption } from '../Shared';
import * as React from 'react';
import { isFilteredOut } from '../FilterOptionsCard';
import { Shortcut } from '../../atoms';
import { useFilter } from '../../molecules/contexts/FilterContext';

export function KeyboardShortcutsCard() {
  const { filter } = useFilter();
  const { convertHoverShortcut, convertAllShortcut } = useProvider();

  if (isFilteredOut(['keyboard', 'shortcut', 'hover'], filter)) return <></>;

  return (
    <OptionsSection title="Keyboard shortcuts">
      <OptionRow>
        <SettingOption
          title="Convert-hovered shortcut"
          help={'Left-click to clear, then click your desired shortcut key'}
        >
          <Shortcut
            defaultValue={convertHoverShortcut.value}
            onChange={(value) => convertHoverShortcut.setAndSaveValue(value)}
          />
        </SettingOption>
        <SettingOption
          title="Convert-all shortcut"
          help={'Left-click to clear, then click your desired shortcut key'}
        >
          <Shortcut
            defaultValue={convertAllShortcut.value}
            onChange={(value) => convertAllShortcut.setAndSaveValue(value)}
          />
        </SettingOption>
      </OptionRow>
    </OptionsSection>
  );
}
