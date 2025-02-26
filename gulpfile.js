/* eslint-disable */
var gulp = require('gulp'),
  path = require('path'),
  ngFsUtils = require('@angular/compiler-cli/src/ngtsc/file_system'),
  ngc = require('@angular/compiler-cli/src/main').main,
  commonjs = require('@rollup/plugin-commonjs'),
  rename = require('gulp-rename'),
  del = require('del'),
  runSequence = require('gulp4-run-sequence'),
  inlineResources = require('./tools/gulp/inline-resources'),
  gru2 = require('gulp-rollup-2'),
  resolve = require("@rollup/plugin-node-resolve");

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');

/**
 * 1. Delete /dist folder
 */
gulp.task('clean:dist', function () {

  // Delete contents but not dist folder to avoid broken npm links
  // when dist directory is removed while npm link references it.
  return deleteFolders([distFolder + '/**', '!' + distFolder]);
});

/**
 * 2. Clone the /src folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp.src([`${srcFolder}/**/*`, `!${srcFolder}/node_modules`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});


/**
 * 4. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
gulp.task('ngc', async function () {
  ngFsUtils.setFileSystem(new ngFsUtils.NodeJSFileSystem());
  return ngc([
    '-p', `${tmpFolder}/tsconfig.es5.json`], (error) => {
      if (error) {
        throw new Error('ngc compilation failed: ' + error);
      }
    });
});

/**
 * 5. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:fesm', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
  // transform the files here.
    .pipe(gru2.rollup(
      {
        input: `${buildFolder}/index.js`,
        cache: true,
        plugins: [
          commonjs({
            include: 'node_modules/rxjs/**',
          }),
          resolve.nodeResolve({
            jsnext: true,
            module: true
          })],
          inlineDynamicImports:true,
        output: [
          {
                file: 'ionic-gallery-modal.js',
                format: 'es'
          },
     ]}
    ))
    .pipe(gulp.dest(distFolder));
});

/**
 * 6. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
  // transform the files here.
    .pipe(gru2.rollup(
      {
        input: `${buildFolder}/index.js`,
        cache: true,
        plugins: [
            commonjs({
              include: 'node_modules/rxjs/**',
            }),
            resolve.nodeResolve({
              jsnext: true,
              module: true
            })],
            inlineDynamicImports:true,
        output: [
          {
                file: 'ionic-gallery-modal.umd.js',
                name: 'ionic-gallery-modal',
                format: 'umd',
                exports: 'named',
                globals: {
                  typescript: 'ts'
                }
          },
     ]}
    ))
    .pipe(rename('ionic-gallery-modal.umd.js'))
    .pipe(gulp.dest(distFolder));
});

/**
 * 7. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because with don't need individual modules anymore, just the Flat ES module generated
 *    on step 5.
 */
gulp.task('copy:build', function () {
  return gulp.src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 8. Copy package.json from /src to /dist
 */
gulp.task('copy:manifest', function () {
  return gulp.src([`${srcFolder}/package.json`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 9. Copy README.md from / to /dist
 */
gulp.task('copy:readme', function () {
  return gulp.src([path.join(rootFolder, 'README.MD')])
    .pipe(gulp.dest(distFolder));
});

/**
 * 10. Delete /.tmp folder
 */
gulp.task('clean:tmp', function () {
  return deleteFolders([tmpFolder]);
});

/**
 * 11. Delete /build folder
 */
gulp.task('clean:build', function () {
  return deleteFolders([buildFolder]);
});

gulp.task('compile', async function () {
  runSequence(
    'clean:dist',
    'copy:source',
    'inline-resources',
    'ngc',
    'rollup:fesm',
    'rollup:umd',
    'copy:build',
    'copy:manifest',
    'copy:readme',
    'clean:build',
    'clean:tmp',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
        deleteFolders([distFolder, tmpFolder, buildFolder]);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

/**
 * Watch for any change in the /src folder and compile files
 */
gulp.task('watch', function () {
  gulp.watch(`${srcFolder}/**/*`, ['compile']);
});

gulp.task('clean', gulp.series('clean:dist', 'clean:tmp', 'clean:build'));

gulp.task('build', gulp.series('clean', 'compile'));
gulp.task('build:watch', gulp.series('build', 'watch'));
gulp.task('default', gulp.series('build:watch'));
/**
 * Deletes the specified folder
 */
function deleteFolders(folders) {
  return del(folders);
}
