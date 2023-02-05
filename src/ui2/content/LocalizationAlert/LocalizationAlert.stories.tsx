import React from 'react'
import { useProvider } from '../../../di'
import { LocalizationAlert } from './LocalizationAlert'

const args = {
	defaultDollar: 'USD',
	detectedDollar: 'CAD',
	defaultYen: 'CHY',
	detectedYen: 'JPY',
	defaultKrone: 'DKK',
	detectedKrone: 'SEK',
}

type Args = typeof args
export default {
	title: 'content/LocalizationAlert',
	component: LocalizationAlert,
	args: args,
	argTypes: {},
}

export const localizationAlert = ( args: Args ) => {
	const { activeLocalization } = useProvider()
	activeLocalization.yen.defaultValue = args.defaultYen
	activeLocalization.krone.defaultValue = args.defaultKrone
	activeLocalization.dollar.defaultValue = args.defaultDollar
	activeLocalization.yen.setDetected( args.detectedYen )
	activeLocalization.krone.setDetected( args.detectedKrone )
	activeLocalization.dollar.setDetected( args.detectedDollar )
	return <LocalizationAlert setDismissed={ () => {} }/>
}
