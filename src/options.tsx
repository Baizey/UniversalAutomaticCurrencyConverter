import * as React from 'react'
import { render } from 'react-dom'
import { HookProvider } from './ui/atoms'
import OptionsApp from './ui/options/OptionsApp'

render( <HookProvider children={ <OptionsApp/> }/>, document.getElementById( 'root' ) )
