function calcPixel<T extends number>( n: T ): `${ T }px` { return `${ n }px` }

export const Pixel = {
	of: calcPixel,
	one: calcPixel( 1 ),
	small: calcPixel( 12 ),
	normal: calcPixel( 15 ),
	big: calcPixel( 20 ),
	field: calcPixel( 40 ),
	halfField: calcPixel( 20 ),
	fieldWithUnderline: calcPixel( 39 ),
	fieldWithBorder: calcPixel( 38 ),
}

function calcPercent<T extends number>( n: T ): `${ T }%` { return `${ n }%` }

export const Percent = {
	of: calcPercent,
	all: calcPercent( 100 ),
	half: calcPercent( 50 ),
	third: calcPercent( 33.3333 ),
	quarter: calcPercent( 25 ),
}