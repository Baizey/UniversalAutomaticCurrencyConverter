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
}