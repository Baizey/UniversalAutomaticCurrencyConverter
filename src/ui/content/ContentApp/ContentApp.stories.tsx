import React from 'react'
import { ContentApp, ContentAppProps } from './ContentApp'

const args = {
	storyShowConflict: true,
	storyShowMenu: true,
} satisfies ContentAppProps

export default {
	title: 'content/ContentApp',
	component: ContentApp,
	args: args,
	argTypes: {},
}

export const contentApp = ( args: ContentAppProps ) => <ContentApp { ...args }/>
