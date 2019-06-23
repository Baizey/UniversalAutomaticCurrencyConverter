class Highlighter {
    constructor() {
        this.duration = 500;
        this.isEnabled = true;
        this.color = 'yellow';
    }

    withDuration(value) {
        value = value - 0;
        if (!Utils.isSafeNumber(value))
            return this.duration;
        if (value <= 0)
            return this.duration;
        this.duration = value;
        return this.duration;
    }

    withColor(color) {
        const div = document.createElement('div');
        div.style.backgroundColor = color;
        if (div.style.backgroundColor)
            this.color = color;
        return this.color;
    }

    using(value) {
        this.isEnabled = Utils.isDefined(value) ? !!value : this.isEnabled;
        return this.isEnabled;
    }
}