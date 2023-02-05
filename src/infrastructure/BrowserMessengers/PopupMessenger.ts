import { Browser, BrowserDiTypes } from '../index'

export enum PopupMessageType {}

export type PopupMessage = {};

export class PopupMessenger {
	private browser: Browser

	constructor( { browser }: BrowserDiTypes ) {
		this.browser = browser
	}

	private sendMessage<Response>( data: PopupMessage ): Promise<Response> {
		return new Promise( ( resolve, reject ) => {
			try {
				this.browser.runtime.sendMessage(
					data,
					( resp: { success: boolean; data: Response } ) => {
						if ( !resp ) return reject( 'No response' )
						resp.success
							? resolve( resp.data )
							: reject( resp.data )
					},
				)
			} catch ( e ) {
				reject( e )
			}
		} )
	}
}
