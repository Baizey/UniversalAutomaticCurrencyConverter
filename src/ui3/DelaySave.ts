export class DelayAction {
    private readonly waitTimeMs: number
    private _cancel: () => void = () => null

    constructor( wait: number = 250 ) {
        this.waitTimeMs = wait;
    }

    delayedSave( action: () => void ) {
        this._cancel();
        let cancelled = false;
        this._cancel = () => cancelled = true
        setTimeout( () => {
            if ( !cancelled ) action()
        }, this.waitTimeMs )
    }

    cancel() {
        this._cancel()
    }

}