# Universal Automatic Currency Converter

An extension for Chrome, Firefox and (the new) Edge

[Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/ua-currency-converter/)

[Chrome extension](https://chrome.google.com/webstore/detail/universal-automatic-curre/hbjagjepkeogombomfeefdmjnclgojli)

[Edge extension](https://microsoftedge.microsoft.com/addons/detail/universal-automatic-curre/aeejpkkbcpndcbnmhifkdeabgjafghfn)

[![Build Status](https://travis-ci.com/Baizey/UniversalAutomaticCurrencyConverter.svg?branch=deployed-v3)](https://travis-ci.com/Baizey/UniversalAutomaticCurrencyConverter)

# Source code submission guide

## Environment

- NodeJs (LTS v16.X.X)
- Npm (v7.X.X)
- Windows 10 (which OS compiles it should hopefully not matter)

The exact sub-versions should not matter

## Build
Run the following commands: 
1. ```npm install```
1. ```npm run start:dev```

Individual components can also be viewed in storybook
- ```npm run storybook``` (```http://localhost:6006```)

Deployment code is placed in dist.zip

## Summary of features

- Intelligent conversion and detection of currencies

- Automatic and non-intrusive in-site conversions

- Always access to converter no matter where you are

- Simple UI, yet extensive customization

## General features

- Support for more than 170 currencies and their symbolic equivalents, getting rates from fixer.io and
  openexchangerates.org

- Intelligent currency detection, catching everything for most if not all symbols, $, £ and € to EUR, USD, GBP to 'US $'

- Non-intrusive in-site replacement, will never break any website functionality

- Control exactly how your prices are displayed, anything from $100 or 100 dollars to 100 schmekels

- Intelligent localization of multi-currency symbols like $ and kr

- Optional highlighting of prices being converted on pages

- Flip quickly between converted prices and original using either left-clicking, a self chosen shortcut or via the UI

- Mini converter between currencies in the popup window

- Blacklisting and whitelisting of websites for conversion
