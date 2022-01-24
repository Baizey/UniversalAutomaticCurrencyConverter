import * as React from 'react';
import { OptionRow, OptionsSection, SettingOption } from './Shared';
import { Input } from '../atoms';

type Props = { onChange: (value: string) => void };

export function isFilteredOut(keys: string[], filter: string): boolean {
  if (!filter) return false;
  if (keys.filter((k) => filter.indexOf(k) >= 0).length > 0) return false;
  return !(
    filter
      .split(' ')
      .filter((token) => keys.filter((k) => k.indexOf(token) >= 0).length > 0)
      .length > 0
  );
}

export function FilterOptionsCard({ onChange }: Props) {
  return (
    <OptionsSection title="Search for what you need">
      <OptionRow>
        <SettingOption
          title=""
          help="Leave empty and click enter to show all options"
        >
          <Input
            type="text"
            defaultValue=""
            placeholder="Filter here..."
            onEnter={(value) => onChange(value as string)}
          />
        </SettingOption>
      </OptionRow>
    </OptionsSection>
  );
}
