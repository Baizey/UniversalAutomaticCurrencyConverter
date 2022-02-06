// This file is injected as a content script
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useProvider } from './infrastructure';
import { CurrencyElement } from './currencyConverter/Currency';
import { LogLevel } from './infrastructure/Logger';

const isBlacklistedErrorMessage = `Site is blacklisted`;

async function loadConfiguration(): Promise<void> {
  await useProvider().configuration.load();
}

async function loadActiveLocalization(): Promise<void> {
  const { activeLocalization, logger } = useProvider();
  await activeLocalization.load();
  logger.info(`Localization completed`);
}

function loadTabInformation(): boolean {
  const {
    browser,
    siteAllowance,
    tabState,
    logger,
    usingAutoConversionOnPageLoad,
  } = useProvider();
  logger.info(`Loaded settings`);

  // Check if blacklisted, if so abandon tab and dont do anything
  const allowance = siteAllowance.getAllowance(browser.url.href);
  tabState.setIsAllowed(allowance.isAllowed);
  tabState.setIsShowingConversions(usingAutoConversionOnPageLoad.value);

  logger.debug(
    `Allowed: ${allowance.isAllowed}, Last reason: ${
      allowance.reasoning.pop()?.url
    }`
  );

  if (!tabState.isAllowed) {
    logger.warn(`${browser.url.href} is blacklisted`);
    throw new Error(isBlacklistedErrorMessage);
  }

  logger.info(`Verified whitelisted website`);
  return tabState.isAllowed;
}

function injectAlertSystem(): void {
  const { logger } = useProvider();
  const div = document.createElement('div');
  div.id = 'uacc-root';
  document.body.appendChild(div);
  const { ContentApp } = require('./components/content');
  ReactDOM.render(<ContentApp />, document.getElementById('uacc-root'));
  logger.info(`Injected alert system onto page`);
}

function injectShortcuts(): void {
  const { logger, tabState, convertAllShortcut, convertHoverShortcut } =
    useProvider();

  // Add shortcut for convert all
  if (convertAllShortcut.value)
    window.addEventListener('keyup', (e) => {
      if (e.key !== convertAllShortcut.value) return;
      logger.debug(`Convert all shortcut activated`);
      tabState.flipAllConversions();
    });

  // Add shortcut for convert hover
  if (convertHoverShortcut.value)
    window.addEventListener('keyup', (e) => {
      if (e.key !== convertHoverShortcut.value) return;
      logger.debug(`Convert hovered shortcut activated`);
      tabState.flipHovered();
    });
}

async function injectConversions(): Promise<void> {
  const { logger, tabState } = useProvider();

  new MutationObserver(async (mutations) => {
    try {
      for (const mutation of mutations) {
        const addedNodes = mutation.addedNodes;
        for (let i = 0; i < addedNodes.length; i++) {
          const node = addedNodes[i];
          const element = node.parentElement;
          if (!element || childOfUACCWatched(element)) continue;
          const detected = await detectAllElements(element);
          logger.log({
            logLevel: detected.length ? LogLevel.info : LogLevel.debug,
            message: `Newly loaded content, found ${detected.length} currencies`,
          });
        }
      }
    } catch (err: unknown) {
      logger.error(err as Error);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  // Detect all currencies on page
  logger.info(`Starting checking for currencies on page`);
  await detectAllNewElementsRecurring();
  logger.info(
    `Done checking for currencies, found ${tabState.conversions.length} currencies`
  );
}

function handleError(error: Error): void {
  const { logger } = useProvider();
  switch (error?.message || error) {
    case isBlacklistedErrorMessage:
      break;
    default:
      logger.error(error);
      break;
  }
}

(async () => {
  await loadConfiguration();
  await loadActiveLocalization();

  loadTabInformation();

  injectAlertSystem();

  injectShortcuts();

  await injectConversions();
})().catch(handleError);

async function detectAllElements(
  parent: HTMLElement
): Promise<CurrencyElement[]> {
  const { convertTo, elementDetector, tabState } = useProvider();
  const currency = convertTo.value;

  const discovered: CurrencyElement[] = elementDetector.find(parent);

  for (let element of discovered) {
    await element.convertTo(currency);
    element.setupListener();
    await element.show();
    if (tabState.isShowingConversions && !tabState.isPaused)
      element.highlight();
  }

  discovered.forEach((e) => tabState.conversions.push(e));
  return discovered;
}

async function detectAllNewElementsRecurring(): Promise<void> {
  const { logger } = useProvider();
  const attempts = 3;
  for (let i = 1, time = 0; i <= attempts; i++, time = (time || 1000) * 2) {
    await wait(time);
    const result = await detectAllElements(document.body);
    logger.info(
      `Auto check ${i}/${attempts}, found ${result.length} currencies`
    );
  }
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
}

function childOfUACCWatched(element: HTMLElement): boolean {
  if (!element || element.hasAttribute('uacc:watched')) return true;
  if (!element.parentElement) return false;
  return childOfUACCWatched(element.parentElement);
}
