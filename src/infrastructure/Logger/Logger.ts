import { TimeSpan } from 'sharp-time-span'
import { ConfigDi } from '../Configuration'
import { LoggingSettingType, UseDebugLoggingSetting } from '../Configuration/setting'

export enum LogLevel {
	profile = 'profile',
	debug = 'debug',
	info = 'info',
	warn = 'warn',
	error = 'error',
}

type LogEvent = |
	{
		logLevel: LogLevel.info | LogLevel.debug | LogLevel.warn;
		message: string;
	} |
	{
		logLevel: LogLevel.error;
		message?: string;
		error: Error;
	};

const LogLevelConversion = Object.freeze( {
	[LoggingSettingType.nothing]: 0,
	[LoggingSettingType.error]: 1,
	[LoggingSettingType.info]: 2,
	[LoggingSettingType.debug]: 3,
	[LoggingSettingType.profile]: 4,
} )

export type LoggerDi = { logger: Logger }

export class Logger {
	private readonly useLogging: UseDebugLoggingSetting
	private readonly startTime: number

	constructor( { metaConfig }: ConfigDi ) {
		this.useLogging = metaConfig.logging
		this.startTime = Date.now()
		this.debug( `LogLevel: ${ this.useLogging.value }` )
	}

	debug( data: string ) {
		if ( this.logLevel() >= LogLevelConversion.debug )
			console.debug( data )
	}

	info( data: string ) {
		if ( this.logLevel() >= LogLevelConversion.info )
			console.info( data )
	}

	warn( data: string ) {
		if ( this.logLevel() >= LogLevelConversion.error )
			console.warn( data )
	}

	error( error: Error, message?: string ) {
		message ??= 'Unexpected error'
		if ( this.logLevel() > LogLevelConversion.nothing )
			console.error( this.wrap( `${ message }\n${ error.name }\n${ error.message }\n${ error.stack }` ) )
	}

	log( logEvent: LogEvent ) {
		switch ( logEvent.logLevel ) {
			case LogLevel.debug:
				return this.debug( logEvent.message )
			case LogLevel.info:
				return this.info( logEvent.message )
			case LogLevel.warn:
				return this.warn( logEvent.message )
			case LogLevel.error:
				return this.error( logEvent.error, logEvent.message )
		}
	}

	private logLevel(): number {
		return LogLevelConversion[this.useLogging.value]
	}

	private wrap( msg: string ): string {
		return `[UACC ${ TimeSpan.since( this.startTime ).seconds.toFixed( 2 ) }] ${ msg }`
	}
}
