import { render } from 'preact'
import { useProvider } from './di'
import { HookProvider } from './ui2/atoms'
import { PopupApp } from './ui2/popup'

useProvider().metaConfig.colorTheme.loadSetting().finally( () =>
	render( <HookProvider children={ <PopupApp/> }/>, document.getElementById( 'root' )! ) )