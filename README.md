# UniversalAutomaticCurrencyConverter BFF Api

Simple currency rate aggregate API with 2 endpoints

GET /api/v4/symbols

GET /api/v4/rate/[FROM]/[TO]

requires apikey to use endpoints


for local dev remember:

nodemon-dev.json
```
{
    "verbose": true,
    "ext": "js",
    "watch": ["dist"],
    "exec": "node dist/Api.js",
    "env": {
        "PORT": 3000,
        "HOST": "localhost",
        "openExchangeApiKey": "<dev-key>",
        "ownApiKey": "<key>"
    }
}
```