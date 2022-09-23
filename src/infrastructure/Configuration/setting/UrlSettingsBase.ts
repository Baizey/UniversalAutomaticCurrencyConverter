import { SiteAllowance } from '../../../currencyConverter/Detection'
import { SettingDep, SyncSetting } from './SyncSetting'
import { isStringArray } from './validators'

export class UrlSettingsBase extends SyncSetting<string[]> {
	constructor( provider: SettingDep, key: string ) {
		super( provider, key, [], ( array ) => isStringArray( array ) )
	}

	parseUri( raw: string ) {
		try {
			const url = SiteAllowance.parseUri( raw )
			const uri = `${ url.hostname }${ url.pathname }`
			if ( uri.endsWith( '/' ) ) return uri.substr( 0, uri.length - 1 )
			return uri
		} catch ( e ) {
			return ''
		}
	}

	setValue( value: string[] | undefined ): boolean {
		if ( !value ) return false
		value = Object.keys(
			value
				.map( ( e ) => this.parseUri( e ) )
				.filter( ( e ) => e )
				.reduce( ( a, b ) => {
					a[b] = true
					return a
				}, {} as Record<string, boolean> ),
		)

		return super.setValue( value )
	}
}