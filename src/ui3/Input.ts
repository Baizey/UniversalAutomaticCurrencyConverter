export type NumberInputProps = {
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
};

export type TextInputProps = {
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
};

export type ShortcutInputProps = {
    align?: "left" | "center" | "right";
    value?: string;
    onChange: (shortcut: string) => void;
};

export type DropdownOption = { value: string; label: string };
export type DropdownProps = {
    value?: DropdownOption,
    align?: 'left' | 'center' | 'right';
    options: DropdownOption[];
    onChange: (option: DropdownOption) => void;
};

export type ToggleProps = {
    value?: boolean;
    onChange: (checked: boolean) => void;
};
export type InputWrapperProps = {
    value: HTMLDivElement;
    title: string
    subtitle?: string
};

export type InputRowWrapperProps = {
    values: HTMLDivElement[]
}

export class Input {

    static createWrapperRow({values}: InputRowWrapperProps) {
        const root = document.createElement("div");
        root.className = "uacc-input-row-wrapper";
        values.forEach(value => {
            const wrap = root.appendChild(document.createElement("div"));
            wrap.style.width = `calc(100% / ${values.length})`;
            wrap.appendChild(value)
        });
        return root
    }

    static createWrapper({title, subtitle, value}: InputWrapperProps): HTMLDivElement {
        const div = document.createElement("div");
        div.className = "uacc-input-wrapper";

        // Title
        const titleEl = document.createElement("div");
        titleEl.className = "uacc-input-wrapper-title";
        titleEl.textContent = title;

        // Input container
        const inputContainer = document.createElement("div");
        inputContainer.className = "uacc-input-wrapper-input";
        inputContainer.appendChild(value);

        // Subtitle
        const subtitleEl = document.createElement("div");
        subtitleEl.className = "uacc-input-wrapper-subtitle";
        subtitleEl.textContent = subtitle ?? "";

        div.appendChild(titleEl);
        div.appendChild(inputContainer);
        div.appendChild(subtitleEl);
        return div;
    }

    static createToggle({value, onChange}: ToggleProps): HTMLDivElement {
        const div = document.createElement("div");
        div.className = "uacc-option-wrapper";

        // Build toggle
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
        input.addEventListener("change", () => {
            onChange?.(input.checked);
        });
        return div;
    }

    static createDropdown({value, align, options, onChange}: DropdownProps) {
        const div = document.createElement("div");
        div.className = "uacc-option-wrapper";

        // Search input
        const input = document.createElement("input");
        input.type = "text";
        input.className = "uacc-search-input";
        input.placeholder = value?.label ?? "";
        input.style.textAlign = align ?? "center";
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500";
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px";

        // Dropdown container
        const dropdown = document.createElement("div");
        dropdown.className = "uacc-dropdown";

        let filteredItems: DropdownOption[] = [...options];
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
                    input.placeholder = item.label; // show selected label
                    input.value = ""; // clear input
                    dropdown.style.display = "none";
                    onChange(item);
                });
                dropdown.appendChild(el);
            });
            dropdown.style.display = "block";
        }

        function updateDropdown(query: string) {
            filteredItems = options.filter(i =>
                i.label.toLowerCase().includes(query)
                || i.value.toLowerCase().includes(query)
            );
            selectedIndex = 0;
            renderDropdown();
        }

        input.addEventListener("input", () => updateDropdown(input.value.toLowerCase()));

        input.addEventListener("focus", () => updateDropdown(input.value.toLowerCase()));

        input.addEventListener("blur", () => {
            setTimeout(() => {
                dropdown.style.display = "none";
            }, 150);
        });

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
            } else if (e.key === "Enter") {
                if (filteredItems.length > 0) {
                    const selected = filteredItems[selectedIndex];
                    input.placeholder = selected.label;
                    input.value = "";
                    dropdown.style.display = "none";
                    onChange(selected);
                    e.preventDefault();
                }
            }
        });

        div.appendChild(input);
        div.appendChild(dropdown);
        return div;
    }

    static createNumberInput({placeholder, align, value, min, max, step, onChange}: NumberInputProps) {

        const coerce = function (input?: number): string {
            return input === null || input === undefined ? "" : input.toString();
        };
        const div = document.createElement("div");
        div.className = "uacc-option-wrapper";

        // Number input
        const input = document.createElement("input");
        input.type = "number";
        input.className = "uacc-text-input";
        input.placeholder = placeholder ?? "";
        input.style.textAlign = align ?? "center";
        if (min) input.min = min.toString()
        if (max) input.max = max.toString()
        if (step) input.step = step.toString()
        if (value) input.value = value.toString()

        // Font family and weight
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500"; // semi-bold for readability
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px"; // centers text in 50px row

        input.addEventListener("input", (e) => {
            onChange?.(Number((e.target as HTMLInputElement).value));
        });
        div.appendChild(input);
        return div;
    }

    static createTextInput({align, placeholder, value, onChange}: TextInputProps) {
        const div = document.createElement("div");
        div.className = "uacc-option-wrapper";

        // Text input
        const input = document.createElement("input");
        input.type = "text";
        input.className = "uacc-text-input";
        input.placeholder = placeholder ?? "";
        input.value = value ?? "";

        // Text alignment
        input.style.textAlign = align ?? "center";

        // Font family and weight
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500"; // semi-bold for readability
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px"; // centers text in 50px row

        div.appendChild(input);

        // Focus / blur handled via Tailwind classes
        input.addEventListener("input", (e) => {
            onChange?.((e.target as HTMLInputElement).value);
        });
        return div;
    }

    static createShortcutInput({value, onChange, align}: ShortcutInputProps) {
        const div = document.createElement("div");
        div.className = "uacc-option-wrapper";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "uacc-text-input";
        input.readOnly = true;
        input.value = value ?? "";
        input.style.textAlign = align ?? "center";
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500";
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px";

        div.appendChild(input);

        function formatShortcut(e: KeyboardEvent) {
            const keys: string[] = [];
            if (e.ctrlKey) keys.push("Ctrl");
            if (e.shiftKey) keys.push("Shift");
            if (e.altKey) keys.push("Alt");
            if (e.metaKey) keys.push("Meta");

            // Exclude modifier-only events
            if (!["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
                keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
            }

            return keys.join("+");
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                input.blur();
                return;
            }
            const shortcut = formatShortcut(e);
            input.value = shortcut;
            onChange?.(shortcut);
            e.preventDefault();
        }

        input.addEventListener("focus", () => {
            document.addEventListener("keydown", handleKeyDown);
        });

        input.addEventListener("blur", () => {
            document.removeEventListener("keydown", handleKeyDown);
        });
        return div
    }
}