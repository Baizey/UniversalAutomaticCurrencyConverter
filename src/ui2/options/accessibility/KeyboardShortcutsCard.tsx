import {useProvider} from '../../../di'
import {Shortcut, useFilter} from '../../atoms'
import {OptionRow, OptionsSection, SettingOption} from '../shared'

export function KeyboardShortcutsCard() {
    const {isExcluded} = useFilter()
    const {
        qualityOfLifeConfig: {
            keyPressOnHoverFlipConversion,
            keyPressOnAllFlipConversion,
        },
    } = useProvider()

    if (isExcluded(['keyboard', 'shortcut', 'hover'])) return <></>

    return (
        <OptionsSection title="Keyboard shortcuts">
            <OptionRow>
                <SettingOption
                    title="Convert-hovered shortcut"
                    help={'Left-click to clear, then click your desired shortcut key'}
                >
                    <Shortcut
                        value={keyPressOnHoverFlipConversion.value}
                        onValueChange={value => keyPressOnHoverFlipConversion.setAndSaveValue(value)}
                    />
                </SettingOption>
                <SettingOption
                    title="Convert-all shortcut"
                    help={'Left-click to clear, then click your desired shortcut key'}
                >
                    <Shortcut
                        value={keyPressOnAllFlipConversion.value}
                        onValueChange={(value) => keyPressOnAllFlipConversion.setAndSaveValue(value)}
                    />
                </SettingOption>
            </OptionRow>
        </OptionsSection>
    )
}
