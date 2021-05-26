import * as React from 'react';
import {useEffect, useState} from 'react';
import {OptionRow, OptionsSection, SettingOption} from '../Shared';
import {Button, ReadonlyInput} from '../../atoms';
import {useProvider} from '../../../infrastructure';
import {BrowserDataStorage} from '../../../infrastructure/Browser/Browser';
import {OptionCardProps} from '../OptionsApp';
import {isFilteredOut} from '../FilterOptionsCard';

export function StorageManagementCard(props: OptionCardProps): JSX.Element {
    const {browser} = useProvider()
    const [showDone, setShowDone] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [storage, setStorage] = useState<BrowserDataStorage[]>([])

    useEffect(() => {browser.allStorage().then(e => setStorage(e))}, [])
    useEffect(() => { setStorage([]) }, [showDone])

    if (isFilteredOut(['storage', 'management'], props.filter))
        return <></>

    function wrap(child: JSX.Element): JSX.Element {
        return <OptionsSection title="Storage management">
            <OptionRow>
                {child}
            </OptionRow>
            <>
                {storage
                    .map(e => ({...e, value: JSON.stringify(e.value)}))
                    .map(e =>
                        <OptionRow key={`${e.key}`}>
                            <SettingOption title={`${e.key}`} help={`Above setting is using ${e.type} storage`}>
                                <ReadonlyInput defaultValue={`${e.value}`}/>
                            </SettingOption>
                        </OptionRow>)
                }
            </>
        </OptionsSection>
    }

    if (showDone) return wrap(
        <SettingOption title="" help="You have to refresh the page if you want to do this again">
            <Button secondary={true}>
                All settings cleared
            </Button>
        </SettingOption>)

    if (showConfirm) return wrap(
        <SettingOption title="" help="Clicking this time will delete all extension storage">
            <Button error={true} onClick={async () => {
                browser.clearSettings();
                setShowDone(true)
            }}>Click to confirm deleting all storage</Button>
        </SettingOption>)

    return wrap(
        <SettingOption title="" help="You have to click again after to confirm">
            <Button primary={true} onClick={() => {setShowConfirm(true)}}>
                Clear all storage
            </Button>
        </SettingOption>)
}