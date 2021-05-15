import {CurrencyElement} from '../Currency';

export class TabInformation {
    private _isAllowed: boolean
    private _isShowingConversions: boolean
    conversions: CurrencyElement[]

    constructor() {
        this._isAllowed = false;
        this._isShowingConversions = false;
        this.conversions = []
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
    }

    flipAllConversions() {
        const flipped = !this.isShowingConversions;
        this.setIsShowingConversions(flipped)
        this.conversions.forEach(e => e.show(flipped));
    }

    flipHovered() {
        this.conversions
            .filter(e => e.isHovered)
            .forEach(e => e.flipDisplay())
    }
}