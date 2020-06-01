import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoPreprocess from 'svelte-preprocess'
import visualizer from 'rollup-plugin-visualizer'
// import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
// import gzip from 'rollup-plugin-gzip'
// import zopfli from 'node-zopfli-es'
// import brotli from "rollup-plugin-brotli"
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import rimraf from 'rimraf'
const path = require("path");


const production = !process.env.ROLLUP_WATCH


rimraf('public/css', () => console.log('removed CSSs'))
rimraf('public/js', () => console.log('removed JSs'))
rimraf('public/**.map', () => console.log('removed MAPs'))
// rimraf('public/**.gz', () => console.log('removed GZs'))
// rimraf('public/**.br', () => console.log('removed BRs'))

require('dotenv').config({
	path: path.resolve(process.cwd(), production ? '.env.prod' : '.env')
});


function getOutputConf() {
	let output = {
		format: 'es',
		dir: 'public/js/module',
		chunkFileNames: '[name].js',
		sourcemap: !production,
	}

	if (production) {
		output = [
			output,
			{
				format: 'system',
				dir: 'public/js/nomodule',
				chunkFileNames: '[name].js',
				sourcemap: !production,
			}
		]
	}

	return output
}


export default {
	input: 'src/main.js',
	output: getOutputConf(),

	plugins: [
		svelte({
			preprocess: autoPreprocess({
				postcss: true
			}),

			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/css/components.css', !production)
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		postcss({
			extract: 'public/css/vendor.css',
			minimize: production,
			sourceMap: !production,
		}),

		replace({
			values: {
				'process.env.NODE_ENV': production ? '\"production\"' : '\"development\"',
				LOAD_XLSX_FROM: process.env.LOAD_XLSX_FROM,
			},
			exclude: './node_modules/**'
		}),

		json(),

		copy({
			targets: [
				// { src: 'node_modules/flag-icon-css/flags/4x3/**.svg', dest: 'public/flags' },
			]
		}),

		// closureCompiler({
		// 	compilation_level: 'ADVANCED'
		// }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		visualizer({
			filename: 'public/visualizer.html',
			gzipSize: true,
			brotliSize: true
		}),


		// Compresion
		// production && gzip({
		// 	customCompression: content => zopfli.deflateSync(Buffer.from(content)),
		// }),
		// production && brotli(),
	],
	manualChunks(id) {
		if (id.includes('node_modules')) {
			return 'vendor'
		}
	},
	watch: {
		clearScreen: false
	}
}

function serve() {
	let started = false

	return {
		writeBundle() {
			if (!started) {
				started = true

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				})
			}
		}
	}
}
