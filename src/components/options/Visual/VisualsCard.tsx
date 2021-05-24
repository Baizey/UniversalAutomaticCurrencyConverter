import * as React from 'react';
import {themes} from '../../../infrastructure';
import {HighlightCard} from './HighlightCard';
import {CustomDisplayCard} from './CustomDisplayCard';
import {NumberFormatCard} from './NumberFormatCard';
import {ThemeCard} from './ThemeCard';

export type VisualCardProps = { setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>> }

export function VisualsCard(props: VisualCardProps) {
    return <>
        <NumberFormatCard/>
        <HighlightCard/>
        <CustomDisplayCard/>
        <ThemeCard setTheme={props.setTheme}/>
    </>
}