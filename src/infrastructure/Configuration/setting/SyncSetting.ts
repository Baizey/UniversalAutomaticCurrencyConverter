import { Browser, BrowserDiTypes } from '../../index'
import { ISetting } from './ISetting'

export type SettingDep = BrowserDiTypes

export class SyncSetting<T> implements ISetting<T> {
    private readonly listeners: (() => void)[] = []
    readonly defaultValue: T
    readonly storageKey: string
    readonly validation: ( v: T ) => boolean
    private browser: Browser

    constructor(
        { browser }: SettingDep,
        storageKey: string,
        defaultValue: T,
        validation: ( v: T ) => boolean = () => true,
    ) {
        this.browser = browser
        this.storageKey = storageKey
        this.validation = validation
        this.defaultValue = defaultValue
        this._value = defaultValue
    }

    protected _value: T

    get value(): T {
        return this._value
    }

    registerListener( listener: () => void ): this {
        this.listeners.push( listener )
        return this
    }

    setValue( value: T | undefined ): boolean {
        if ( typeof value === 'undefined' ) return false
        if ( !this.validation( value ) ) return false
        if ( typeof this.defaultValue === 'number' ) {
            // @ts-ignore
            this._value = Number( value )
        } else {
            this._value = value
        }
        const v = this._value
        this.listeners.forEach( e => e() )
        return true
    }

    async save(): Promise<void> {
        return await this.browser.saveSync( this.storageKey, this.value )
    }

    async loadSetting(): Promise<boolean> {
        return this.setValue( await this.browser.loadSync<T>( this.storageKey ) )
    }

    async setAndSaveValue( v: T ): Promise<boolean> {
        const result = this.setValue( v )

        await this.save()
        return result
    }
}
