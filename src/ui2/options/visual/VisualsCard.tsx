import { CustomDisplayCard } from './CustomDisplayCard'
import { HighlightCard } from './HighlightCard'
import { NumberFormatCard } from './NumberFormatCard'
import { ThemeCard } from './ThemeCard'

export function VisualsCard() {
	return (
		<>
			<NumberFormatCard/>
			<HighlightCard/>
			<CustomDisplayCard/>
			<ThemeCard/>
		</>
	)
}
