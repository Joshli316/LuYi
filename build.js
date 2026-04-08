const esbuild = require('esbuild');
const watch = process.argv.includes('--watch');

const ctx = esbuild.context({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'dist/app.js',
  format: 'iife',
  target: 'es2020',
  sourcemap: true,
  minify: !watch,
});

if (watch) {
  ctx.then(c => {
    c.watch();
    console.log('Watching for changes...');
  });
} else {
  ctx.then(c => c.rebuild().then(() => {
    console.log('Build complete: dist/app.js');
    c.dispose();
  }));
}
