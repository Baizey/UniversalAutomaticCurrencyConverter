import * as React from 'react';
import {themes} from '../../../infrastructure';
import {HighlightCard} from './HighlightCard';
import {CustomDisplayCard} from './CustomDisplayCard';
import {NumberFormatCard} from './NumberFormatCard';
import {ThemeCard} from './ThemeCard';
import {OptionCardProps} from '../OptionsApp';

export function VisualsCard(props: OptionCardProps) {
    return <>
        <NumberFormatCard {...props}/>
        <HighlightCard {...props}/>
        <CustomDisplayCard {...props}/>
        <ThemeCard {...props}/>
    </>
}