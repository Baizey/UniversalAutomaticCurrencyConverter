import { ISetting } from './setting/ISetting'

export abstract class IConfig {
	readonly settings: ISetting<any>[] = []

	async load(): Promise<void> {
		await Promise.all( this.settings.map( ( e ) => e.loadSetting() ) )
	}
}