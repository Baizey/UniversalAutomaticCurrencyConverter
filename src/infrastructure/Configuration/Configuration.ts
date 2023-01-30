import { singleton } from 'sharp-dependency-injection'
import { AsServices } from 'sharp-dependency-injection/lib/utils'
import { IConfig } from './IConfig'
import {
	BlacklistedUrlsSetting,
	ColorThemeSetting,
	ConversionDisplaySetting,
	ConvertAllShortcutSetting,
	ConvertHoverShortcutSetting,
	ConvertToSetting,
	CustomConversionRateSetting,
	DecimalPointSetting,
	DisabledCurrenciesSetting,
	DollarLocalizationSetting,
	HighlightColorSetting,
	HighlightDurationSetting,
	IsFirstTimeSetting,
	IsPausedSetting,
	KroneLocalizationSetting,
	LastVersionSetting,
	MiniConverterSetting,
	ShowConversionInBracketsSetting,
	SignificantDigitsSetting,
	ThousandsSeparatorSetting,
	UseDebugLoggingSetting,
	UsingAutoConversionOnPageLoadSetting,
	UsingBlacklistingSetting,
	UsingConversionHighlightingSetting,
	UsingCustomDisplaySetting,
	UsingHoverFlipConversionSetting,
	UsingLeftClickFlipConversionSetting,
	UsingLocalizationAlertSetting,
	UsingWhitelistingSetting,
	WhitelistedUrlsSetting,
	YenLocalizationSetting,
} from './setting'
import { SettingDep } from './setting/SyncSetting'

export class NumberStylingConfig extends IConfig {
	readonly decimal: DecimalPointSetting
	readonly group: ThousandsSeparatorSetting
	readonly significantDigits: SignificantDigitsSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.decimal = new DecimalPointSetting( dep ) )
		this.settings.push( this.group = new ThousandsSeparatorSetting( dep ) )
		this.settings.push( this.significantDigits = new SignificantDigitsSetting( dep ) )
	}
}

export class CurrencyStylingConfig extends IConfig {
	readonly customDisplay: ConversionDisplaySetting
	readonly enabled: UsingCustomDisplaySetting
	readonly conversionRate: CustomConversionRateSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.enabled = new UsingCustomDisplaySetting( dep ) )
		this.settings.push( this.customDisplay = new ConversionDisplaySetting( dep ) )
		this.settings.push( this.conversionRate = new CustomConversionRateSetting( dep ) )
	}
}

export class QualityOfLifeConfig extends IConfig {
	readonly keyPressOnHoverFlipConversion: ConvertHoverShortcutSetting
	readonly keyPressOnAllFlipConversion: ConvertAllShortcutSetting
	readonly leftClickOnHoverFlipConversion: UsingLeftClickFlipConversionSetting
	readonly onHoverFlipConversion: UsingHoverFlipConversionSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.keyPressOnHoverFlipConversion = new ConvertHoverShortcutSetting( dep ) )
		this.settings.push( this.keyPressOnAllFlipConversion = new ConvertAllShortcutSetting( dep ) )
		this.settings.push( this.leftClickOnHoverFlipConversion = new UsingLeftClickFlipConversionSetting( dep ) )
		this.settings.push( this.onHoverFlipConversion = new UsingHoverFlipConversionSetting( dep ) )
	}
}

export class SiteAllowanceConfig extends IConfig {
	readonly useWhitelisting: UsingWhitelistingSetting
	readonly whitelistedUrls: WhitelistedUrlsSetting
	readonly useBlacklisting: UsingBlacklistingSetting
	readonly blacklistedUrls: BlacklistedUrlsSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.blacklistedUrls = new BlacklistedUrlsSetting( dep ) )
		this.settings.push( this.useBlacklisting = new UsingBlacklistingSetting( dep ) )
		this.settings.push( this.whitelistedUrls = new WhitelistedUrlsSetting( dep ) )
		this.settings.push( this.useWhitelisting = new UsingWhitelistingSetting( dep ) )
	}
}

export class LocalizationConfig extends IConfig {
	readonly krone: KroneLocalizationSetting
	readonly yen: YenLocalizationSetting
	readonly dollar: DollarLocalizationSetting
	readonly usingAlert: UsingLocalizationAlertSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.krone = new KroneLocalizationSetting( dep ) )
		this.settings.push( this.dollar = new DollarLocalizationSetting( dep ) )
		this.settings.push( this.yen = new YenLocalizationSetting( dep ) )
		this.settings.push( this.usingAlert = new UsingLocalizationAlertSetting( dep ) )
	}
}

export class ConversionHighlightConfig extends IConfig {
	readonly enabled: UsingConversionHighlightingSetting
	readonly color: HighlightColorSetting
	readonly duration: HighlightDurationSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.enabled = new UsingConversionHighlightingSetting( dep ) )
		this.settings.push( this.color = new HighlightColorSetting( dep ) )
		this.settings.push( this.duration = new HighlightDurationSetting( dep ) )
	}
}

export class CurrencyTagConfig extends IConfig {
	readonly convertTo: ConvertToSetting
	readonly disabled: DisabledCurrenciesSetting
	readonly showConversionInBrackets: ShowConversionInBracketsSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.convertTo = new ConvertToSetting( dep ) )
		this.settings.push( this.disabled = new DisabledCurrenciesSetting( dep ) )
		this.settings.push( this.showConversionInBrackets = new ShowConversionInBracketsSetting( dep ) )
	}
}

export class MetaConfig extends IConfig {
	readonly logging: UseDebugLoggingSetting
	readonly useAutoConvertOnPageLoad: UsingAutoConversionOnPageLoadSetting
	readonly colorTheme: ColorThemeSetting
	readonly isFirstTime: IsFirstTimeSetting
	readonly lastVersion: LastVersionSetting
	readonly isPaused: IsPausedSetting
	readonly miniConverter: MiniConverterSetting

	constructor( dep: SettingDep ) {
		super()
		this.settings.push( this.logging = new UseDebugLoggingSetting( dep ) )
		this.settings.push( this.useAutoConvertOnPageLoad = new UsingAutoConversionOnPageLoadSetting( dep ) )
		this.settings.push( this.colorTheme = new ColorThemeSetting( dep ) )
		this.settings.push( this.isFirstTime = new IsFirstTimeSetting( dep ) )
		this.settings.push( this.lastVersion = new LastVersionSetting( dep ) )
		this.settings.push( this.isPaused = new IsPausedSetting( dep ) )
		this.settings.push( this.miniConverter = new MiniConverterSetting( dep ) )
	}
}

export const SubConfigDi = {
	numberStylingConfig: singleton( NumberStylingConfig ),
	currencyStylingConfig: singleton( CurrencyStylingConfig ),
	qualityOfLifeConfig: singleton( QualityOfLifeConfig ),
	siteAllowanceConfig: singleton( SiteAllowanceConfig ),
	localizationConfig: singleton( LocalizationConfig ),
	highlightConfig: singleton( ConversionHighlightConfig ),
	currencyTagConfig: singleton( CurrencyTagConfig ),
	metaConfig: singleton( MetaConfig ),
}

type SubConfigDiTypes = AsServices<typeof SubConfigDi>

export class Configuration {
	readonly numberStyling: NumberStylingConfig
	readonly currencyStyling: CurrencyStylingConfig
	readonly siteAllowance: SiteAllowanceConfig
	readonly qualityOfLife: QualityOfLifeConfig
	readonly localization: LocalizationConfig
	readonly highlight: ConversionHighlightConfig
	readonly currencyTag: CurrencyTagConfig
	readonly meta: MetaConfig
	private configs: IConfig[]

	constructor( {
		             numberStylingConfig,
		             currencyStylingConfig,
		             qualityOfLifeConfig,
		             siteAllowanceConfig,
		             localizationConfig,
		             highlightConfig,
		             currencyTagConfig,
		             metaConfig,
	             }: SubConfigDiTypes ) {
		this.numberStyling = numberStylingConfig
		this.currencyStyling = currencyStylingConfig
		this.qualityOfLife = qualityOfLifeConfig
		this.siteAllowance = siteAllowanceConfig
		this.localization = localizationConfig
		this.highlight = highlightConfig
		this.currencyTag = currencyTagConfig
		this.meta = metaConfig
		this.configs = [
			numberStylingConfig,
			currencyStylingConfig,
			qualityOfLifeConfig,
			siteAllowanceConfig,
			localizationConfig,
			highlightConfig,
			currencyTagConfig,
			metaConfig,
		]
	}

	async load(): Promise<void> {
		await Promise.all( this.configs.map( ( e ) => e.load() ) )
	}
}