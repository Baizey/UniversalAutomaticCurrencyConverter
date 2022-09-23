import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ConfigurationContext } from './components/molecules'
import { FilterContext } from './components/molecules/contexts/FilterContext'
import PopupApp from './components/popup/PopupApp'

ReactDOM.render(
	<ConfigurationContext>
		<FilterContext>
			<PopupApp/>
		</FilterContext>
	</ConfigurationContext>,
	document.getElementById( 'root' ),
)
