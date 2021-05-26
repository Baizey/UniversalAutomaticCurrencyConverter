import {useProvider} from '../../infrastructure';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {OptionRow, OptionsSection} from './Shared';
import {NormalText} from '../atoms';

export function NewUpdateCard(): JSX.Element {
    const {lastVersion, convertTo, browser} = useProvider()
    const [isNew, setIsNew] = useState(false)
    const [show, setShow] = useState(false)
    const [last, setLast] = useState('n/a')
    useEffect(() => {
        lastVersion.loadSetting()
            .then(async () => {
                // Figure out if new by checking if we have lastVersion stored
                // Since migrating from <4.0.0 we didnt have lastVersion use convertTo as a backup check
                const hasVersion = !!(await browser.loadSync<string>(lastVersion.storageKey))
                const hasConvertTo = !!(await browser.loadSync<string>(convertTo.storageKey))
                if (!hasVersion && !hasConvertTo) setIsNew(true);
                if (!hasVersion && hasConvertTo) await lastVersion.setAndSaveValue('3.1.3')

                setLast(lastVersion.value)

                // Figure out if we should show this toast (only show on minor or major updates)
                const current = browser.extensionVersion.split('.').map(e => +e)
                const last = lastVersion.value.split('.').map(e => +e)
                const shouldShow = (last[0] < current[0]) || ((last[0] <= current[0]) && (last[1] < current[1]))
                await lastVersion.setAndSaveValue(browser.extensionVersion)
                setShow(shouldShow);
            })
    }, [])

    if (!show) return <></>

    const title = isNew
        ? `Introduction`
        : `Update`
    const introMessage = isNew
        ? `You see this because you're a new user`
        : `You see this because there has been a feature update (${last} => ${lastVersion.value})`

    return <OptionsSection title={title}>
        <OptionRow>
            <NormalText>
                Hi, thanks for using Universal Automatic Currency Converter!
            </NormalText>
        </OptionRow>
        <OptionRow><NormalText>{introMessage}</NormalText></OptionRow>
        <OptionRow>
            <NormalText>
                It is suggested that you look through the settings and configure it to your liking :)
            </NormalText>
        </OptionRow>
    </OptionsSection>
}