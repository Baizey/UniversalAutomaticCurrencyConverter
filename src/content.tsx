// This file is injected as a content script
import * as React from "react";
import {useProvider} from "./Infrastructure";
import {CurrencyElement} from './CurrencyConverter/Currency/CurrencyElement';
import * as ReactDOM from 'react-dom';
import {MenuWrapper} from './Content/MenuWrapper';

const provider = useProvider()

let isShowingConversions = false;
const elements: CurrencyElement[] = [];

(async () => {
    // Load configuration
    await provider.configuration.load();
    // Localize currencies for website
    await provider.activeLocalization.load();
})()
    .then((() => {
        const logger = provider.logger;
        logger.info(`Initialized`);
        const browser = provider.browser;

        isShowingConversions = provider.usingAutoConversionOnPageLoad.value;

        // Check if blacklisted
        const allowance = provider.siteAllowance.getAllowance(browser.href)

        logger.debug(`Allowed: ${allowance.isAllowed}, Last reason: ${allowance.reasoning.pop()?.url}`)

        if(!allowance.isAllowed) return logger.warning(`${browser.href} is blacklisted`)

        // TODO: Check if paused

        // TODO: Setup infrastructure for context-alert system
        const div = document.createElement('div')
        div.id = 'uacc-root'
        document.body.appendChild(div)
        ReactDOM.render(<MenuWrapper conversions={elements}/>, document.getElementById('uacc-root'));

        // TODO: Show alert if localization conflict

        // Add shortcut for convert all
        const convertAllShortcut = provider.convertAllShortcut.value;
        if(convertAllShortcut) window.addEventListener('keyup', e => {
            if(e.key !== convertAllShortcut) return;
            isShowingConversions = !isShowingConversions;
            elements.forEach(e => e.show(isShowingConversions));
        });

        // Listen for new elements added and convert if needed
        new MutationObserver(async mutations => {
            for (const mutation of mutations) {
                const addedNodes = mutation.addedNodes;
                for (let i = 0; i < addedNodes.length; i++) {
                    const node = addedNodes[i];
                    const element = node.parentElement;
                    if(!element || childOfUACCWatched(element))
                        continue;
                    await detectAllElements(element);
                }
            }
        }).observe(document.body, {childList: true, subtree: true, attributes: true, characterData: true});

    }))
    .then(async () => {
        // Detect all currencies on page
        await detectAllNewElementsRecurring();
    }).catch(err => provider.logger.error(err))

async function detectAllElements(parent: HTMLElement): Promise<CurrencyElement[]> {
    const currency = provider.convertTo.value;
    const detector = provider.elementDetector;

    const discovered = detector.find(parent)

    for (let element of discovered) {
        await element.convertTo(currency);
        element.setupListener();
        if(isShowingConversions) {
            await element.showConverted();
            element.highlight();
        }
    }

    discovered.forEach(e => elements.push(e));
    return discovered;
}

async function detectAllNewElements(attempt: number = 0): Promise<CurrencyElement[]> {
    provider.logger.debug(`Checking for currencies, attempt ${attempt}`)
    const result = await detectAllElements(document.body)
    provider.logger.debug(`Found ${result.length} new currencies`)
    return result;
}

async function detectAllNewElementsRecurring(time: number = 1000, attempt: number = 1): Promise<void> {
    const newElements = await detectAllNewElements(attempt)
    time = newElements.length > 0 ? 1000 : time * 2
    if(attempt >= 4) return provider.logger.debug(`Done auto-checking for currencies`)
    setTimeout(() => detectAllNewElementsRecurring(time, attempt + 1), time)
}

function childOfUACCWatched(element: HTMLElement): boolean {
    if(!element || element.hasAttribute('uacc:watched'))
        return true;
    if(!element.parentElement)
        return false;
    return childOfUACCWatched(element.parentElement)
}