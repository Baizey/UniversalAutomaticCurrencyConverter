import {CurrencyElement} from '../Currency';

export class TabState {
    private _isAllowed: boolean
    private _isShowingConversions: boolean
    private _isPaused: boolean
    conversions: CurrencyElement[]

    constructor() {
        this._isAllowed = false;
        this._isShowingConversions = false;
        this._isPaused = false;
        this.conversions = []
    }

    get isPaused(): boolean {
        return this._isPaused
    }

    setIsPaused(value: boolean) {
        this._isPaused = value;
    }

    get isAllowed(): boolean {
        return this._isAllowed
    }

    setIsAllowed(value: boolean) {
        this._isAllowed = value
    }

    get isShowingConversions(): boolean {
        return this._isShowingConversions
    }

    setIsShowingConversions(value: boolean) {
        this._isShowingConversions = value
        if (value) this.conversions.forEach(e => e.showConverted());
        else this.conversions.forEach(e => e.showOriginal());
    }

    async updateDisplay(to?: string): Promise<void> {
        if (to) await this.conversions.forEach(e => e.convertTo(to))
        else await this.conversions.filter(e => e.updateDisplay())
    }

    flipAllConversions() {
        const flipped = !this.isShowingConversions;
        this.setIsShowingConversions(flipped)
        this.conversions.forEach(e => e.show());
    }

    flipHovered() {
        this.conversions
            .filter(e => e.isHovered)
            .forEach(e => e.flipDisplay())
    }
}