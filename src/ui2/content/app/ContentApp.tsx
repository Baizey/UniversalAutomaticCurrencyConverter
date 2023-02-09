import { useEffect, useState } from 'preact/compat'
import { useProvider } from '../../../di'
import { TabMessage, TabMessageType } from '../../../infrastructure'
import { Div, HookProvider, useTheme, WithChildren } from '../../atoms'
import { LocalizationAlert } from '../LocalizationAlert'
import { MenuAlert } from '../MenuAlert'
import { TitleAlert } from '../TitleAlert'

export type ContentAppProps = {
	storyShowConflict?: boolean;
	storyShowMenu?: boolean;
};

export function ContentApp( {
	                            storyShowConflict,
	                            storyShowMenu,
                            }: ContentAppProps = {} ) {
	const {
		activeLocalization,
		browser,
		tabState,
	} = useProvider()

	const [ showLocalization, setShowLocalization ] = useState<boolean>(
		activeLocalization.hasConflict() || !!storyShowConflict,
	)
	const [ showMenu, setShowMenu ] = useState<boolean>( !!storyShowMenu )

	useEffect( () => {
		browser.runtime.onMessage.addListener( async function (
			data: TabMessage,
			sender,
			senderResponse,
		) {
			switch ( data.type ) {
				case TabMessageType.openContextMenu:
					setShowMenu( true )
			}
			senderResponse( { success: true } )
			return true
		} )
	}, [] )
	
	if ( !showMenu ) return <></>

	return (
		<HookProvider>
			<Container>
				<TitleAlert/>
				{ showLocalization && tabState.isAllowed ? (
					<LocalizationAlert
						key="uacc-alert-localization"
						setDismissed={ () => setShowLocalization( false ) }
					/>
				) : (
					<></>
				) }
				{ showMenu ? (
					<MenuAlert
						key="uacc-alert-menu"
						setDismissed={ () => setShowMenu( false ) }
					/>
				) : (
					<></>
				) }
			</Container>
		</HookProvider>
	)
}

function Container( props: WithChildren ) {
	const theme = useTheme()
	return <Div{ ...props } css={ classname => <style jsx>{ `
      .${ classname } {
        border-radius: 5px;
        height: fit-content;
      }

      .${ classname } > div {
        border-width: 1px;
        border-color: ${ theme.containerBorder };
        border-style: solid;
        width: calc(100% - 2px);
      }

      .${ classname } > div:only-child {
        display: none;
      }

      .${ classname } > div:not(:first-child) {
        border-top-color: transparent;
      }

      .${ classname } > div:first-child {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
      }

      .${ classname } > div:last-child {
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
	` }</style> }/>
}