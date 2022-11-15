import * as React from 'react'
import { render } from 'react-dom'
import { ConfigurationContext } from './components/molecules'
import { FilterContext } from './components/molecules/contexts/FilterContext'
import OptionsApp from './components/options/OptionsApp'

render(
	<ConfigurationContext>
		<FilterContext>
			<OptionsApp/>
		</FilterContext>
	</ConfigurationContext>,
	document.getElementById( 'root' ),
)
