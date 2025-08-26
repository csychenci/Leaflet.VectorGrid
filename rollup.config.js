import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

const pkg = JSON.parse(await import('fs').then(fs => fs.readFileSync('./package.json', 'utf8')));

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) ${new Date().getFullYear()} ${pkg.authors ? pkg.authors.map(a => a.replace(/ <.*>/, '')).join(', ') : 'Authors'}
 * ${pkg.license} License
 */`;

const baseConfig = {
  input: 'src/bundle.js',
  external: ['leaflet'],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    webWorkerLoader({
      targetPlatform: 'browser',
      inline: true
    })
  ]
};

export default [
  // UMD build (for browsers)
  // {
  //   ...baseConfig,
  //   output: {
  //     file: 'dist/Leaflet.VectorGrid.js',
  //     format: 'umd',
  //     name: 'L.VectorGrid',
  //     banner,
  //     globals: {
  //       leaflet: 'L'
  //     }
  //   }
  // },
  // UMD minified build
  // {
  //   ...baseConfig,
  //   output: {
  //     file: 'dist/Leaflet.VectorGrid.min.js',
  //     format: 'umd',
  //     name: 'L.VectorGrid',
  //     banner,
  //     globals: {
  //       leaflet: 'L'
  //     }
  //   },
  //   plugins: [
  //     ...baseConfig.plugins,
  //     terser({
  //       format: {
  //         comments: /^!/
  //       }
  //     })
  //   ]
  // },
  // Bundled build (includes all dependencies)
  // {
  //   input: 'src/bundle.js',
  //   output: {
  //     file: 'dist/Leaflet.VectorGrid.bundled.js',
  //     format: 'umd',
  //     name: 'L.VectorGrid',
  //     banner
  //   },
  //   plugins: [
  //     resolve({
  //       browser: true,
  //       preferBuiltins: false
  //     }),
  //     commonjs(),
  //     webWorkerLoader({
  //       targetPlatform: 'browser',
  //       inline: true
  //     })
  //   ]
  // },
  // Bundled minified build
  {
    input: 'src/bundle.js',
    output: {
      file: 'dist/Leaflet.VectorGrid.bundled.min.js',
      format: 'umd',
      name: 'L.VectorGrid',
      banner
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      webWorkerLoader({
        targetPlatform: 'browser',
        inline: true
      }),
      terser({
        format: {
          comments: /^!/
        }
      })
    ]
  },
  // TypeScript declarations
  {
    input: 'src/index.d.ts',
    output: {
      file: 'dist/Leaflet.VectorGrid.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];