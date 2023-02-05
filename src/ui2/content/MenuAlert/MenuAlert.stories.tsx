import React from 'react'
import { MenuAlert } from './MenuAlert'

const args = {}

type Args = typeof args

export default {
	title: 'content/MenuAlert',
	component: MenuAlert,
	args: args,
	argTypes: {},
}

// noinspection JSUnusedGlobalSymbols
export const menuAlert = ( args: Args ) => <MenuAlert setDismissed={ () => {} }/>
