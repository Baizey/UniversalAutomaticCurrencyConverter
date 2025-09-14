const lightTheme = {
    primary: '#1E40AF',      // Strong Blue – titles, key actions
    secondary: '#3B82F6',    // Lighter Blue – borders, accents
    ternary: '#F3F4F6',      // Soft Gray – subtle backgrounds
    warning: '#DC2626',      // Red – destructive actions, alerts
    text: '#111827',         // Dark Gray – readable body text
    background: '#FFFFFF',   // Clean white background
};
const darkTheme = {
    primary: '#FACC15',      // Gold/Yellow – titles, key actions
    secondary: '#22D3EE',    // Lighter Gold – borders, accents
    ternary: '#374151',      // Dark Gray – subtle backgrounds
    warning: '#EF4444',      // Red – destructive actions, alerts
    text: '#E5E7EB',         // Light Gray – readable body text
    background: '#1F2937',   // Dark base background
};


class ThemeChangeHandler {
    static currentTheme = lightTheme;
    static followers = []

    static renderElement(style) {
        const wrapper = document.createElement('div');
        style(wrapper, this.currentTheme)
        ThemeChangeHandler.handleChange(theme => {
            wrapper.innerHTML = '';
            wrapper.className = '';
            style(wrapper, theme)
        })
        return wrapper;
    }

    static handleChange(action) {
        this.followers.push(action);
    }

    static updateTheme() {
        const theme = useProvider().metaConfig.colorTheme.value
        const newTheme = theme === 'lightTheme' ? lightTheme : darkTheme;
        if (newTheme === this.currentTheme) return
        this.currentTheme = newTheme;
        document.body.style.setProperty("--uacc-primary", newTheme.primary);
        document.body.style.setProperty("--uacc-secondary", newTheme.secondary);
        document.body.style.setProperty("--uacc-ternary", newTheme.ternary);
        document.body.style.setProperty("--uacc-warning", newTheme.warning);
        document.body.style.setProperty("--uacc-text", newTheme.text);
        document.body.style.setProperty("--uacc-background", newTheme.background);
        this.followers.forEach(it => it(newTheme));
    }
}

const Input = {
    // Input Wrapper
    createWrapper: function (props) {
        // props: { value: HTMLDivElement, title: string, subtitle?: string }
        return ThemeChangeHandler.renderElement((div) => {
            div.className = "uacc-input-wrapper";

            const titleEl = document.createElement("div");
            titleEl.className = "uacc-input-wrapper-title";
            titleEl.textContent = props.title;

            const inputContainer = document.createElement("div");
            inputContainer.className = "uacc-input-wrapper-input";
            inputContainer.appendChild(props.value);

            const subtitleEl = document.createElement("div");
            subtitleEl.className = "uacc-input-wrapper-subtitle";
            subtitleEl.textContent = props.subtitle ?? "";

            div.appendChild(titleEl);
            div.appendChild(inputContainer);
            div.appendChild(subtitleEl);
        });
    },

    // Toggle
    createToggle: function ({value, onChange}) {
        return ThemeChangeHandler.renderElement((div) => {
            div.className = "uacc-toggle-wrapper";

            const label = document.createElement("label");
            label.className = "uacc-toggle";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = "uacc-toggle-input";
            input.checked = value ?? false;

            const track = document.createElement("span");
            track.className = "uacc-toggle-track";

            const thumb = document.createElement("span");
            thumb.className = "uacc-toggle-thumb";

            track.appendChild(thumb);
            label.appendChild(input);
            label.appendChild(track);
            div.appendChild(label);

            input.addEventListener("change", () => onChange?.(input.checked));
        });
    },

    // Dropdown
    createDropdown: function ({value, align, options, onChange}) {
        return ThemeChangeHandler.renderElement((div, theme) => {
            div.className = "uacc-dropdown-wrapper";

            const input = document.createElement("input");
            input.type = "text";
            input.className = "uacc-search-input";
            input.placeholder = value?.label ?? "";
            input.style.textAlign = align ?? "center";
            input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            input.style.fontWeight = "500";
            input.style.fontSize = "20px";
            input.style.lineHeight = "48px";

            const dropdown = document.createElement("div");
            dropdown.className = "uacc-dropdown";

            let filteredItems = [...options];
            let selectedIndex = 0;

            function renderDropdown() {
                dropdown.innerHTML = "";
                if (filteredItems.length === 0) {
                    const empty = document.createElement("div");
                    empty.className = "uacc-dropdown-empty";
                    empty.textContent = "No results";
                    dropdown.appendChild(empty);
                    dropdown.style.display = "block";
                    return;
                }
                filteredItems.forEach((item, i) => {
                    const el = document.createElement("div");
                    el.className = "uacc-dropdown-item";
                    if (i === selectedIndex) el.classList.add("uacc-selected");
                    el.textContent = item.label;
                    el.addEventListener("mousedown", () => {
                        input.placeholder = item.label;
                        input.value = "";
                        dropdown.style.display = "none";
                        onChange?.(item);
                    });
                    dropdown.appendChild(el);
                });
                dropdown.style.display = "block";
            }

            input.addEventListener("input", () => {
                const val = input.value.toLowerCase();
                filteredItems = options.filter(i => i.label.toLowerCase().includes(val));
                selectedIndex = 0;
                renderDropdown();
            });

            input.addEventListener("focus", () => {
                filteredItems = options.filter(i => i.label.toLowerCase().includes(input.value.toLowerCase()));
                selectedIndex = 0;
                renderDropdown();
            });

            input.addEventListener("blur", () => setTimeout(() => {
                dropdown.style.display = "none";
            }, 150));

            input.addEventListener("keydown", (e) => {
                if (dropdown.style.display === "none") return;
                if (e.key === "ArrowDown") {
                    selectedIndex = (selectedIndex + 1) % filteredItems.length;
                    renderDropdown();
                    e.preventDefault();
                } else if (e.key === "ArrowUp") {
                    selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
                    renderDropdown();
                    e.preventDefault();
                } else if (e.key === "Enter" && filteredItems.length > 0) {
                    const selected = filteredItems[selectedIndex];
                    input.placeholder = selected.label;
                    input.value = "";
                    dropdown.style.display = "none";
                    onChange?.(selected);
                    e.preventDefault();
                }
            });

            div.appendChild(input);
            div.appendChild(dropdown);
        });
    },

    // Number Input
    createNumberInput: function ({placeholder, align, value, min, max, step, onChange}) {
        return ThemeChangeHandler.renderElement((div) => {
            div.className = "uacc-text-input-wrapper";
            const input = document.createElement("input");
            input.type = "number";
            input.className = "uacc-text-input";
            input.placeholder = placeholder ?? "";
            input.style.textAlign = align ?? "center";
            if (min != null) input.min = min;
            if (max != null) input.max = max;
            if (step != null) input.step = step;
            if (value != null) input.value = value;

            input.addEventListener("input", (e) => onChange?.(Number(e.target.value)));
            div.appendChild(input);
        });
    },

    // Text Input
    createTextInput: function ({align, placeholder, value, onChange}) {
        return ThemeChangeHandler.renderElement((div) => {
            div.className = "uacc-text-input-wrapper";
            const input = document.createElement("input");
            input.type = "text";
            input.className = "uacc-text-input";
            input.placeholder = placeholder ?? "";
            input.value = value ?? "";
            input.style.textAlign = align ?? "center";
            input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            input.style.fontWeight = "500";
            input.style.fontSize = "20px";
            input.style.lineHeight = "48px";

            input.addEventListener("input", (e) => onChange?.(e.target.value));
            div.appendChild(input);
        });
    },

    // Shortcut Input
    createShortcutInput: function ({value, onChange, align}) {
        return ThemeChangeHandler.renderElement((div) => {
            div.className = "uacc-text-input-wrapper";
            const input = document.createElement("input");
            input.type = "text";
            input.readOnly = true;
            input.value = value ?? "";
            input.style.textAlign = align ?? "center";
            input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            input.style.fontWeight = "500";
            input.style.fontSize = "20px";
            input.style.lineHeight = "48px";
            div.appendChild(input);

            function formatShortcut(e) {
                const keys = [];
                if (e.ctrlKey) keys.push("Ctrl");
                if (e.shiftKey) keys.push("Shift");
                if (e.altKey) keys.push("Alt");
                if (e.metaKey) keys.push("Meta");
                if (!["Control", "Shift", "Alt", "Meta"].includes(e.key)) keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
                return keys.join("+");
            }

            function handleKeyDown(e) {
                if (e.key === "Escape") {
                    input.blur();
                    return;
                }
                input.value = formatShortcut(e);
                onChange?.(input.value);
                e.preventDefault();
            }

            input.addEventListener("focus", () => document.addEventListener("keydown", handleKeyDown));
            input.addEventListener("blur", () => document.removeEventListener("keydown", handleKeyDown));
        });
    }
};

document.body.style.backgroundColor = darkTheme.background;

document.addEventListener("DOMContentLoaded", () => {
    const currencyDropdown = Input.createDropdown({
        options: [
            {label: "USD", value: "USD"},
            {label: "EUR", value: "EUR"},
            {label: "CAD", value: "CAD"},
        ],
        value: "USD",
        onChange: (val) => console.log("Currency changed", val)
    });

    const sigDigitsField = Input.createNumberInput({
        value: 2,
        min: 1,
        max: 10,
        step: 1,
        onChange: (val) => console.log("Significant digits", val)
    });

    const currencyDisplayField = Input.createTextInput({
        value: "$",
        onChange: (val) => console.log("Currency display", val)
    });

// Wrap with InputWrapper
    const currencyWrapper = Input.createWrapper({
        value: currencyDropdown,
        title: "Currency"
    });

    const sigDigitsWrapper = Input.createWrapper({
        value: sigDigitsField,
        title: "Significant Digits"
    });

    const displayWrapper = Input.createWrapper({
        value: currencyDisplayField,
        title: "Currency Display"
    });

// Example input on right
    const exampleInput = Input.createNumberInput({
        value: 123.45,
        min: 0,
        step: 0.01,
        onChange: (val) => console.log("Example input changed", val)
    });

    const exampleWrapper = Input.createWrapper({
        value: exampleInput,
        title: "Example Amount"
    });

// Page wrapper
    const page = ThemeChangeHandler.renderElement((wrapper) => {
        wrapper.className = "uacc-options-page-wrapper";

        // Page title
        const titleEl = document.createElement("h1");
        titleEl.className = "uacc-options-page-title";
        titleEl.textContent = "Currency Settings";
        wrapper.appendChild(titleEl);
    });

    const content = document.createElement("div");
    content.className = "uacc-options-page-content";

    const left = document.createElement("div");
    left.className = "uacc-options-left";
    left.appendChild(currencyWrapper);
    left.appendChild(sigDigitsWrapper);
    left.appendChild(displayWrapper);

    const right = document.createElement("div");
    right.className = "uacc-options-right";
    right.appendChild(exampleWrapper);

    content.appendChild(left);
    content.appendChild(right);

    page.appendChild(content);
    document.body.appendChild(page);
});
