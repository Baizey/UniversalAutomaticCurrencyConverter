/**
 * @param {Element} searchField
 * @param {{value: *, text: string, match: function(text):boolean}[]} searchResults
 * @param {function(selected:*)} onSelectedResult
 */
function autocomplete(searchField, searchResults, onSelectedResult) {

    const removeActive = elements => {
        for (let i = 0; i < elements.length; i++)
            elements[i].classList.remove("autocomplete-active");
    };

    const addActive = elements => {
        if (!elements) return false;
        removeActive(elements);
        if (focusedSearchResult >= elements.length) focusedSearchResult = 0;
        if (focusedSearchResult < 0) focusedSearchResult = (elements.length - 1);
        elements[focusedSearchResult].classList.add("autocomplete-active");
    }

    const closeAllLists = elements => {
        const element = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < element.length; i++)
            if (elements !== element[i] && elements !== searchField)
                element[i].parentNode.removeChild(element[i]);
    };

    let focusedSearchResult;

    searchField.addEventListener("focus", createDropdown);
    searchField.addEventListener("input", createDropdown);

    function createDropdown() {
        closeAllLists();
        const value = this.value || '';

        focusedSearchResult = -1;

        const autocompleteResults = document.createElement("div");
        autocompleteResults.setAttribute("id", `${this.id}autocomplete-list`);
        autocompleteResults.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(autocompleteResults);

        for (let result of searchResults) {
            if (value && !result.match(value)) continue;
            const autocompleteResult = document.createElement("div");
            autocompleteResult.innerHTML += result.text;
            autocompleteResult.innerHTML += `<input type='hidden' value='${result.value}'>`;
            autocompleteResult.addEventListener("click", () => {
                searchField.value = '';
                closeAllLists();
                onSelectedResult(result);
            });

            autocompleteResults.appendChild(autocompleteResult);

            let results = document.getElementById(`${this.id}autocomplete-list`);
            if (results) results = results.getElementsByTagName('div');
            if (results.length > 0) {
                focusedSearchResult = 0;
                addActive(results);
            }
        }
    }

    searchField.addEventListener("keydown", function (event) {
        let results = document.getElementById(`${this.id}autocomplete-list`);
        if (results) results = results.getElementsByTagName('div');
        switch (event.key) {
            case 'ArrowDown':
                focusedSearchResult++;
                addActive(results);
                break;
            case 'ArrowUp':
                focusedSearchResult--;
                addActive(results);
                break;
            case 'Enter':
                event.preventDefault();
                if (focusedSearchResult > -1 && results)
                    results[focusedSearchResult].click();
                break;
        }
    });

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}