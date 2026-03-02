/**
 * SVGO configuration tuned for animated SVGs such as `loading-animated.svg`.
 * We keep IDs, viewBox, and attribute detail so keyframes and selectors remain intact,
 * while still trimming obvious bloat. Multipass is on for better compression.
 */
module.exports = {
	multipass: true,
	js2svg: {
		pretty: true,
		indent: 2
	},
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					// Keep inline styles and dataset attributes that drive keyframes.
					removeUnknownsAndDefaults: {
						defaultAttrs: false,
						unknownAttrs: false,
						keepDataAttrs: true,
						keepAriaAttrs: true
					},
					// Matrix consolidation can subtly change animation pivots, so disable it.
					convertTransform: false,
					// Leave shapes as-is to avoid altering stroke animations.
					convertShapeToPath: false,
					removeHiddenElems: false
				}
			}
		},
		// Animation selectors rely on stable IDs and attributes.
		{
			name: 'cleanupIds',
			active: false
		},
		// Keep the viewBox for responsiveness.
		{
			name: 'removeViewBox',
			active: false
		},
		// Gentle numeric cleanup without breaking transform precision.
		{
			name: 'cleanupNumericValues',
			params: {
				floatPrecision: 3
			}
		}
	]
};
