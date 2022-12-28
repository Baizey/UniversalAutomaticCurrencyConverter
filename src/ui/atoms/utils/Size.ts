function calcPixel<T extends number>( n: T ): `${ T }px` { return `${ n }px` }

export const Size = Object.freeze( {
	of: ( n: number ) => n,
	zero: 0,
	one: 1,
	small: 12,
	medium: 15,
	large: 20,
	field: 40,
} )

export const Pixel = Object.freeze( {
	of: calcPixel,
	zero: calcPixel( Size.zero ),
	one: calcPixel( Size.one ),
	small: calcPixel( Size.small ),
	medium: calcPixel( Size.medium ),
	large: calcPixel( Size.large ),
	field: calcPixel( Size.field ),
	halfField: calcPixel( Size.field / 2 ) as '20px',
	fieldWithUnderline: calcPixel( Size.field - 1 ) as '39px',
	fieldWithBorder: calcPixel( Size.field - 2 ) as '38px',
} )

function calcPercent<T extends number>( n: T ): `${ T }%` { return `${ n }%` }

export const Percent = Object.freeze( {
	of: calcPercent,
	all: calcPercent( 100 ),
	half: calcPercent( 50 ),
	third: calcPercent( 33.3333 ),
	quarter: calcPercent( 25 ),
} )