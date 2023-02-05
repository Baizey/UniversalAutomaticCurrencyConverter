import { render } from 'preact'
import { useProvider } from './di'
import { HookProvider } from './ui2/atoms'
import { OptionsApp } from './ui2/options'

useProvider().metaConfig.colorTheme.loadSetting().finally( () =>
	render( <HookProvider children={ <OptionsApp/> }/>, document.getElementById( 'root' )! ) )