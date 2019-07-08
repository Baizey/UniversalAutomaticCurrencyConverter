# Universal Automatic Currency Converter

An extension for Chrome and Firefox

[Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/ua-currency-converter/)

[Chrome extension](https://chrome.google.com/webstore/detail/universal-automatic-curre/hbjagjepkeogombomfeefdmjnclgojli)

[![Build Status](https://travis-ci.com/Baizey/UniversalAutomaticCurrencyConverter.svg?branch=deployed)](https://travis-ci.com/Baizey/UniversalAutomaticCurrencyConverter)

## Conversion at all cost

Currency converters can act in 1 of 3 ways:

- Carefully, searches in invididual text nodes, replaces in individual text nodes, Likely to miss currencies, never breaks websites.

- Aggressively, searches across html tags and replaces across html tags. Likely to find all currencies, might break websites.

- Intelligently, searches aggresively, but replaces carefully. Likely to find all currencies, never breaks websites.

Most extensions will likely act carefully. This extension currently acts aggressively.

Eventually I would like to have it act intelligently, or at the least let the users choose how it should approach conversion.

## Description on Firefox/Chrome stores

<strong>Your new currency converter.</strong>

Tired of having to manually convert prices in online stores?

Tired of annoying prices like '19.99' or '495' and just want the plain price?

This extension aims to solve these issues!

<b>Major features</b>

- Automatic conversion of prices on all pages to your preferred currency

- Support for 170 currencies through fixer.io

- Intelligent autodetecting localization with support for all major currency symbols

- Intelligent rounding of prices to your desired precision

- Mini converted available everywhere top right. Can convert and remember up to 5 conversions across tabs.

- Flip between original and converted prices on pages either by clicking, using the shortcut or using the button in the popup.

- Customizable highlighting on prices being converted (color and highlight duration)

- Define your own currency display. Choose exactly how you want your conversions to display.

- Blacklisting of websites you dont want converted.
