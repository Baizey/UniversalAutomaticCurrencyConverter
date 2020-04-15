class CustomTag {

    constructor() {
        this.tag = '$¤';
        this.value = 1;
        this.enabled = false;
    }

    withTag(tag) {
        if (Utils.isUndefined(tag))
            return this.tag;
        this.tag = typeof tag === 'string' && tag.indexOf('¤') >= 0
            ? tag
            : '¤' + tag;
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
            ? number => tag.replace('¤', number)
            : (number, currency) => `${number} ${currency}`;
    }

}