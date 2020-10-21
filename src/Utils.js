let _uaccLogger;

class Logger {
    static get instance() {
        return _uaccLogger || (_uaccLogger = new Logger());
    }

    log(msg) {
        if (Browser.instance.isProduction) return;
        console.log(`UACC: ${msg}`);
    }
}

class Utils {
    /**
     * @param {string} className
     * @returns {HTMLElement[]}
     */
    static getByClass(className) {
        const temp = document.getElementsByClassName(className);
        const result = [];
        for (let i = 0; i < temp.length; i++)
            result.push(temp[i]);
        return result;
    }

    /**
     * @param msg
     * @constructor
     */
    static log(msg) {
        Logger.instance.log(msg);
    }

    /**
     * @param time
     * @returns {Promise<void>}
     */
    static wait(time) {
        return new Promise(resolve => setTimeout(() => resolve(), time));
    }

    /**
     * @param {Element[]} boxes
     */
    static initializeRadioBoxes(boxes) {
        const clear = () => boxes.forEach(e => {
            e.checked = false;
            e.classList.remove('checked');
        });
        boxes.forEach(radio => {
            radio.addEventListener('click', () => {
                if (radio.checked) return;
                clear();
                radio.checked = true;
                radio.classList.add('checked');
                radio.dispatchEvent(new Event('change'));
            });
        });
        const checked = boxes.filter(e => e.classList.contains('checked'))[0];
        if (checked) checked.click();
    }
}