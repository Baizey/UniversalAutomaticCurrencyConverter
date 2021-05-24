// This file is injected as a content script
import * as React from "react";
import * as ReactDOM from 'react-dom'
import {useProvider} from "./infrastructure";
import {CurrencyElement} from './currencyConverter/Currency';
import {LogLevel} from './infrastructure/Logger';
import {ContentApp} from './components/content';

const isBlacklistedErrorMessage = `Site is blacklisted`;

(async () => await useProvider().configuration.load())()
    .then(() => {
        const {browser, siteAllowance, tabInformation, logger} = useProvider()
        logger.info(`Loaded settings`)

        // Check if blacklisted, if so abandon tab and dont do anything
        const allowance = siteAllowance.getAllowance(browser.href)
        tabInformation.setIsAllowed(allowance.isAllowed);

        logger.debug(`Allowed: ${allowance.isAllowed}, Last reason: ${allowance.reasoning.pop()?.url}`)

        if (!tabInformation.isAllowed) {
            logger.warn(`${browser.href} is blacklisted`)
            throw new Error(isBlacklistedErrorMessage)
        }

        logger.info(`Verified whitelisted website`)
    })
    .then(async () => {
        // Localize currencies for website
        const {activeLocalization, logger} = useProvider()
        await activeLocalization.load();
        logger.info(`Localization completed`)
    })
    .then((() => {
        const {
            logger,
            tabInformation,
            usingAutoConversionOnPageLoad,
            convertAllShortcut,
            convertHoverShortcut
        } = useProvider()

        tabInformation.setIsShowingConversions(usingAutoConversionOnPageLoad.value);

        // TODO: handle being paused somehow

        const div = document.createElement('div')
        div.id = 'uacc-root'
        document.body.appendChild(div)
        ReactDOM.render(<ContentApp/>, document.getElementById('uacc-root'));

        // Add shortcut for convert all
        if (convertAllShortcut.value) window.addEventListener('keyup', e => {
            if (e.key !== convertAllShortcut.value) return;
            logger.debug(`Convert all shortcut activated`)
            tabInformation.flipAllConversions()
        });

        // Add shortcut for convert hover
        if (convertHoverShortcut.value) window.addEventListener('keyup', e => {
            if (e.key !== convertHoverShortcut.value) return;
            logger.debug(`Convert hovered shortcut activated`)
            tabInformation.flipHovered();
        });

        // Listen for new elements added and convert if needed
        new MutationObserver(async mutations => {
            try {
                for (const mutation of mutations) {
                    const addedNodes = mutation.addedNodes;
                    for (let i = 0; i < addedNodes.length; i++) {
                        const node = addedNodes[i];
                        const element = node.parentElement;
                        if (!element || childOfUACCWatched(element))
                            continue;
                        const detected = await detectAllElements(element);
                        logger.log({
                            logLevel: detected.length ? LogLevel.info : LogLevel.debug,
                            message: `Newly loaded content, found ${detected.length} currencies`
                        })
                    }
                }
            } catch (err) {
                logger.error(err);
            }
        }).observe(document.body, {childList: true, subtree: true, attributes: true, characterData: true});
    }))
    .then(async () => {
        const {logger, tabInformation} = useProvider()
        // Detect all currencies on page
        logger.info(`Starting checking for currencies on page`)
        await detectAllNewElementsRecurring();
        logger.info(`Done checking for currencies, found ${tabInformation.conversions.length} currencies`)
    })
    .catch(err => {
        // Ignore error if blacklisted, this is already logged and on throws to dont do anything after
        if (err.message === isBlacklistedErrorMessage) { return }
        const {logger} = useProvider()
        logger.error(err);
    })

async function detectAllElements(parent: HTMLElement): Promise<CurrencyElement[]> {
    const {convertTo, elementDetector, tabInformation} = useProvider()
    const currency = convertTo.value;

    const discovered: CurrencyElement[] = elementDetector.find(parent)

    for (let element of discovered) {
        await element.convertTo(currency);
        element.setupListener();
        if (tabInformation.isShowingConversions) {
            await element.showConverted();
            element.highlight();
        }
    }

    discovered.forEach(e => tabInformation.conversions.push(e));
    return discovered;
}

async function detectAllNewElementsRecurring(): Promise<void> {
    const {logger} = useProvider()
    const attempts = 4;
    for (let i = 1, time = 0; i <= attempts; i++, time = (time || 1000) * 2) {
        await wait(time)
        const result = await detectAllElements(document.body)
        logger.info(`Auto check ${i}/${attempts}, found ${result.length} currencies`)
    }
}

function wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), milliseconds))
}

function childOfUACCWatched(element: HTMLElement): boolean {
    if (!element || element.hasAttribute('uacc:watched'))
        return true;
    if (!element.parentElement)
        return false;
    return childOfUACCWatched(element.parentElement)
}