class CustomTag {

    constructor() {
        this.tag = '¤{amount}';
        this.value = 1;
        this.enabled = false;
    }

    withTag(tag) {
        if (Utils.isUndefined(tag))
            return this.tag;
        this.tag = typeof tag === 'string' && tag.indexOf('{amount}') >= 0
            ? tag
            : '{amount}' + tag;
        return this.tag;
    }

    withValue(value) {
        if (Utils.isSafeNumber(value))
            this.value = value;
    }

    using(enabled) {
        this.enabled = Utils.isDefined(enabled) ? !!enabled : this.enabled;
    }

    get converter() {
        const tag = this.tag;
        return this.enabled
            ? number => tag.replace('{amount}', number)
            : (number, currency) => `${number} ${currency}`;
    }

}