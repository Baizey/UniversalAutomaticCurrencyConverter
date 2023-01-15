import * as React from 'react'
import { render } from 'react-dom'
import { HookProvider } from './ui/atoms'
import { PopupApp } from './ui/popup'

render( <HookProvider children={ <PopupApp/> }/>, document.getElementById( 'root' ) )
