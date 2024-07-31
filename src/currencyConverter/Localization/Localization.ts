export class Localizations {
    private static _uniqueSymbols: Record<string, string>;

    static get uniqueSymbols() {
        if (this._uniqueSymbols) return this._uniqueSymbols;
        const result: Record<string, string> = {};
        const unique = Localizations.unique;
        Object.entries(unique).forEach(([key, value]) =>
            value.forEach((symbol) => (result[symbol] = key))
        );
        const shared = Localizations.shared;
        Object.entries(shared).forEach(([key, value]) => (result[key] = value[0]));
        return (this._uniqueSymbols = result);
    }

    /**
     * Alternative shared ways for currencies to display themselves.
     * Note that for these to work correctly extensive support is required in ActiveLocalization
     */
    static get shared() {
        return {
            // Usa, Canada, Australia, Mexico, New Zealand, Singapore, Hong kong, Argentine peso
            $: ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD', 'ARS'],
            dollar: ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            dollars: ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            // Denmark, Sweden,  Norway, Island, Czechia
            'kr.': ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            kr: ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            ',-': ['SEK', 'DKK', 'NOK', 'ISK'],
            ',--': ['SEK', 'DKK', 'NOK', 'ISK'],
            // China, Japan
            '¥': ['CNY', 'JPY'],
        };
    }

    /**
     * Alternative unique displays for currencies
     */
    static get unique() {
        return {
            // Hungary
            HUF: ['Ft'],
            // Bosnian
            BAM: ['KM'],
            // Australia
            AUD: ['AUD$'],
            // Brazil
            BRL: ['R$'],
            // New Zealand
            NZD: ['NZD$'],
            // USA
            USD: ['USD$', 'US$', 'US $'],
            // Canada
            CAD: ['CDN$'],
            // Mexico
            MXN: ['MXN$'],
            // EU
            EUR: ['€'],
            // UK
            GBP: ['£', '￡'],
            // Japan
            JPY: ['JP¥', '円'],
            // China
            CNY: ['CN¥', '元'],
            // India
            INR: ['₹', 'Rs'],
            // Russia
            RUB: ['₽'],
            // Kazakhstan
            KZT: ['₸'],
            // Turkey
            TRY: ['₺', 'TL'],
            // Ukraine
            UAH: ['₴'],
            // Thailand
            THB: ['฿'],
            // Poland
            PLN: ['zł'],
            // South Korea
            KRW: ['₩'],
            // Bulgaria
            BGN: ['лв'],
            // Czechia
            CZK: ['Kč'],
            // South Africa
            //ZAR: ['R'], // this is just really annoying
            // Bitcoin
            BTC: ['₿'],
            // Monero
            XMR: ['ɱ'],
            // Ethereum
            ETH: ['Ξ'],
            // Litecoin
            LTC: ['Ł'],
        };
    }

    /**
     * This exists primarily to avoid async setup for currency detection
     */
    static get currencySymbols(): string[] {
        return [
            "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
            "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTC", "BTN", "BWP", "BYN", "BZD",
            "CAD", "CDF", "CHF", "CLF", "CLP", "CNH", "CNY", "COP", "CRC", "CUC", "CUP", "CVE", "CZK",
            "DJF", "DKK", "DOP", "DZD",
            "EGP", "ERN", "ETB", "EUR",
            "FJD", "FKP",
            "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD",
            "HKD", "HNL", "HRK", "HTG", "HUF",
            "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK",
            "JEP", "JMD", "JOD", "JPY",
            "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT",
            "LAK", "LBP", "LKR", "LRD", "LSL", "LYD",
            "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
            "NAD", "NGN", "NIO", "NOK", "NPR", "NZD",
            "OMR",
            "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG",
            "QAR",
            "RON", "RSD", "RUB", "RWF",
            "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP",
            "STD", "STN", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS",
            "UAH", "UGX", "USD", "UYU", "UZS",
            "VEF", "VES", "VND", "VUV",
            "WST",
            "XAF", "XAG", "XAU", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT",
            "YER",
            "ZAR", "ZMW", "ZWL"
        ]
    }

    static get hostCurrency() {
        return {
            com: 'USD',
            cn: 'CNY',
            jp: 'JPY',
            in: 'INR',
            ru: 'RUB',
            tr: 'TRY',
            ua: 'UAH',
            th: 'THB',
            pl: 'PLN',
            kr: 'KRW',
            bg: 'BGN',
            dk: 'DKK',
            se: 'SEK',
            no: 'NOK',
            is: 'ISK',
            cz: 'CZK',
            ca: 'CAD',
            au: 'AUD',
            mx: 'MXN',
            nz: 'NZD',
            sg: 'SGP',
            hk: 'HKD',
            uk: 'GBP',
        };
    }
}
