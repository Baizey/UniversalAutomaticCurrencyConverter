import { singleton } from 'sharp-dependency-injection'
import { TimeSpan } from 'sharp-time-span'
import { ConfigDiTypes } from '../Configuration'
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

export class Logger {
	private readonly useLogging: UseDebugLoggingSetting
	private readonly startTime: number

	constructor( { metaConfig }: ConfigDiTypes ) {
		this.useLogging = metaConfig.logging
		this.startTime = Date.now()
		this.debug( `LogLevel: ${ this.useLogging.value }` )
	}

	private get logLevel(): number {
		return LogLevelConversion[this.useLogging.value]
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

	debug( data: string ) {
		if ( this.logLevel >= LogLevelConversion.debug )
			console.debug( this.wrap( data ) )
	}

	info( data: string ) {
		if ( this.logLevel >= LogLevelConversion.info )
			console.info( this.wrap( data ) )
	}

	warn( data: string ) {
		if ( this.logLevel >= LogLevelConversion.error )
			console.warn( this.wrap( data ) )
	}

	error( error: unknown | Error, message?: string ) {
		message ??= 'Unexpected error'
		const name = error instanceof Error ? error.name : error
		const errorMessage = error instanceof Error ? error.message : error
		const stack = error instanceof Error ? error.stack : error
		console.error( this.wrap( `${ message }\n${ name }\n${ errorMessage }\n${ stack }` ) )
	}

	private wrap( msg: string ): string {
		return `[UACC ${ TimeSpan.since( this.startTime ).seconds.toFixed( 2 ) }] ${ msg }`
	}
}

export const LoggerDi = { logger: singleton( Logger ) }