import React from 'react'
import { AlertSection, AlertSectionProps } from './AlertSection'

const args = {
	title: 'Title',
	onDismiss: () => console.log( 'Dismiss' ),
} satisfies AlertSectionProps

export default {
	title: 'content/AlertSection',
	component: AlertSection,
	args: args,
	argTypes: {},
}

export const alertSection = ( args: AlertSectionProps ) => <AlertSection { ...args }/>
