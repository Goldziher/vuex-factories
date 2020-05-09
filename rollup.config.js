import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const input = 'src/index.ts'
const output = (type) => ({
	output: {
		exports: 'named',
		file: type === 'umd' ? 'dist/umd/index.min.js' : `dist/${type}/index.js`,
		format: type,
		name: 'vuex-factories',
		sourcemap: true,
		globals: {
			vuex: 'vuex',
		},
	},
})
const external = ['vuex']
const plugins = [
	typescript({
		useTsconfigDeclarationDir: false,
	}),
	terser(),
]

export default [
	{
		input,
		external,
		...output('esm'),
		plugins,
	},
	{
		input,
		external,
		...output('cjs'),
		plugins,
	},
	{
		input,
		external,
		...output('umd'),
		plugins,
	},
]
