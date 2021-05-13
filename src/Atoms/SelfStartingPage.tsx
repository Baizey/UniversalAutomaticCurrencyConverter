import * as React from 'react';
import {useEffect, useState} from 'react';
import {ThemeProvider} from 'styled-components';
import {mapToTheme, ThemeType} from './ThemeProps';
import {useProvider} from '../Infrastructure';

type BasicPageProps = {
    children: React.ReactNode
}

export function BasicPage({children}: BasicPageProps) {
    const {colorTheme} = useProvider();
    return <ThemeProvider theme={mapToTheme(colorTheme.value)}>{children}</ThemeProvider>
}

type SelfStartingPageProps = {
    Child: React.ReactNode &
        ((props: {
            isLoading: boolean,
            setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
        }) => JSX.Element)
}

export function SelfStartingPage({Child}: SelfStartingPageProps) {
    const {configuration, colorTheme} = useProvider();
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState(colorTheme.value)
    useEffect(() => {
        configuration.load()
            .then(() => setTheme(colorTheme.value))
            .then(() => setIsLoading(false))
    }, [])

    return <ThemeProvider theme={mapToTheme(theme)}>
        <Child isLoading={isLoading} setTheme={setTheme}/>
    </ThemeProvider>
}