import { themes } from '../src/infrastructure'
import { darkTheme } from '../src/infrastructure/Theme/DarkTheme'
import { lightTheme } from '../src/infrastructure/Theme/LightTheme'
import { Percent } from '../src/ui2/atoms'
import useMockContainer from '../tests/Container.mock'

enum ScreenType {
	content = 'content',
	options = 'options',
	popup = 'popup'
}

export const parameters = {
	backgrounds: {
		default: 'light theme',
		values: [
			{
				name: 'dark theme',
				key: darkTheme.wrapperBackground,
			},
			{
				name: 'light theme',
				key: lightTheme.wrapperBackground,
			},
		],
	},
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}

// noinspection JSUnusedGlobalSymbols
export const globalTypes = {
	width: {
		name: 'Width',
		description: 'Global width for components',
		defaultValue: 'options',
		toolbar: {
			icon: 'zoom',
			items: Object.values( ScreenType ),
		},
	},
}

const Wrapper = ( { color, children }: { color: string, children: any } ) =>
	<div style={ {
		minWidth: '100vh',
		minHeight: '100vh',
		height: Percent.all,
		width: Percent.all,
		backgroundColor: color,
		margin: 0,
		padding: 0,
	} }>
		{ children }
	</div>

const InnerWrapperPopup = ( { children }: { children: any } ) =>
	<div style={ {
		width: '600px',
		height: 'fit-content',
		padding: '20px',
		borderWidth: '1px',
		margin: 'auto',
	} }>
		{ children }
	</div>

const InnerWrapperOptions = ( { children }: { children: any } ) =>
	<div style={ {
		maxWidth: '800px',
		margin: 'auto',
		border: 0,
	} }>
		{ children }
	</div>
const InnerWrapperContent = ( { children }: { children: any } ) =>
	<div style={ {
		width: '450px',
		height: 'fit-content',
		zIndex: 99999,
		right: '10px',
		top: '10px',
		position: 'fixed',
	} }>
		{ children }
	</div>

const rates = Object.freeze( { usd: { eur: 2, gbp: 3 }, eur: { gbp: 4 } } )
const symbols = {
	'USD': 'USD Dollar',
	'EUR': 'Euro',
	'GBP': 'British pound',
}

function getRate( from: string, to: string ) {
	from = from.toLowerCase()
	to = to.toLowerCase()
	if ( from === to ) return 1
	if ( rates[from] && rates[from][to] ) return rates[from][to]
	if ( rates[to] && rates[to][from] ) return 1 / rates[to][from]
	return 1
}

export const decorators = [
	( Story, context ) => {
		const backgroundColor = context.globals.backgrounds?.value ?? lightTheme.wrapperBackground
		const theme: keyof typeof themes = ( backgroundColor === darkTheme.wrapperBackground )
			? 'darkTheme'
			: 'lightTheme'
		const screenType = context.globals.width.toLowerCase() as ScreenType

		const { metaConfig: { colorTheme } } = useMockContainer( {
			backgroundMessenger: {
				getRate: ( from, to ) => Promise.resolve( {
					rate: getRate( from, to ),
					from, to, path: [], timestamp: new Date(),
				} ),
				getSymbols: () => Promise.resolve( symbols ),
			},
		})
		colorTheme.setValue( theme )

		function findUsedBackgroundColor() {
			switch ( screenType ) {
				case ScreenType.content:
					return '#AAA'
				default:
				case ScreenType.options:
				case ScreenType.popup:
					return backgroundColor
			}
		}

		function findInnerWrap() {
			switch ( screenType ) {
				case ScreenType.content:
					return InnerWrapperContent
				case ScreenType.popup:
					return InnerWrapperPopup
				default:
				case ScreenType.options:
					return InnerWrapperOptions
			}
		}

		const Inner = findInnerWrap()
		return (
			<Wrapper color={ findUsedBackgroundColor() }>
				<Inner>
					<Story/>
				</Inner>
			</Wrapper>
		)
	},
]