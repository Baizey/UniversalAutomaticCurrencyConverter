import {useProvider} from '../../../infrastructure';
import * as React from 'react';
import {useState} from 'react';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Dropdown} from '../../atoms';
import {AccessibilityCardProps, DisabledListContainer, DisabledListItem} from './AccessibilityCard';

export function DisableCurrenciesCard(props: AccessibilityCardProps) {
    const {disabledCurrencies} = useProvider()
    const [listOfDisabledCurrencies, setListOfDisabledCurrencies] = useState<string[]>(disabledCurrencies.value);
    return <OptionsSection title="Disable currencies">
        <OptionRow>
            <SettingOption title="Search for currencies to disable">
                <Dropdown
                    options={props.symbols}
                    onChange={value => {
                        const newList = listOfDisabledCurrencies.concat([value])
                        newList.sort();
                        if (disabledCurrencies.setValue(newList)) {
                            setListOfDisabledCurrencies(newList)
                            disabledCurrencies.save();
                        }
                    }}/>
            </SettingOption>
        </OptionRow>
        <OptionRow>
            <SettingOption title="Disabled currencies">
                <DisabledListContainer>
                    {listOfDisabledCurrencies.map(e => <DisabledListItem key={`disable_${e}`} onClick={() => {
                        const newList = listOfDisabledCurrencies.filter(f => f !== e);
                        setListOfDisabledCurrencies(newList);
                        disabledCurrencies.setAndSaveValue(newList);
                    }
                    }>{e}</DisabledListItem>)}
                </DisabledListContainer>
            </SettingOption>
        </OptionRow>
    </OptionsSection>
}