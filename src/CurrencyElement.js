class CurrencyElement {
    /**
     * @param {HTMLElement} element
     * @param {{config: Configuration}} services
     */
    constructor(element, services = {}) {
        this._config = services.config || Configuration.instance;
        this._element = element;
    }


    highlight() {
        if (!this._config.highlight.using.value) return;
        const color = this._config.highlight.color.value;
        const duration = this._config.highlight.duration.value;
        this._element.style.textShadow = `${color}  2px 0px 2px, ${color} -2px 0px 2px, ${color}  4px 0px 4px, ${color} -4px 0px 4px, ${color}  6px 0px 6px, ${color} -6px 0px 6px`;
        setTimeout(() => this._element.style.textShadow = '', Math.max(1, duration));
    }
}