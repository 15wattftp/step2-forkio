const { series, parallel, watch, src, dest } = require("gulp");
const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify-es").default; //   ЗАМЕНИТЬ НА  Terser    Uglify - не поддерживается больше
const del = require("del"); //    покурить Асинхронное применение чтобы не ругалось
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const imagemin = require("gulp-imagemin");
const sourcemaps = require('gulp-sourcemaps');


const BsServer =  function() {
  browserSync.init({
      server: {
          baseDir: "./"
      },
          tunnel:true
      // .port:65133
  });
}



function imageTask() {
  return gulp.src('src/img/**/*.*')
            .pipe(imagemin
              ([
                      imagemin.gifsicle({interlaced: true}),
                      imagemin.mozjpeg({quality: 75, progressive: true}),
                      imagemin.optipng({optimizationLevel: 5}),    
              ]))
            .pipe(gulp.dest('dist/img/'));



}

function scriptTask() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("script.js"))
    
    .pipe(rename({suffix: '.min'}))
    
    .pipe(
      uglify({
        toplevel: true,
      })
    )
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest("./dist/js/"))
    .pipe(browserSync.stream());
}

//                              уточнить как выставить последовательность в SAAS    + include path
function stylesTask() {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat("style.css"))
    .pipe(rename({suffix: '.min'}))
    .pipe(
      autoprefixer({
        overrideBrowserslist: [">0.1%"], //   прочекать на ФайлБраузеров
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(dest("./dist/styles/"))
    .pipe(browserSync.stream());
}

// function htmlTask() {
//   return .src("./src/**/*.html")
//         .pipe(dest("./dist/"))
        
// }

function watcherTask() {

BsServer();

//.on('change', browserSync.reload)
  watch("./src/styles/**/*.scss", stylesTask); 
  watch("./src/js/**/*.js", scriptTask);
  watch("./**/*.html").on('change', browserSync.reload);
};

// function clearDist() {
//   del("./dist/*");
// }

async function clearDist() {
  return await del("./dist/*");
}

// exports.stylesTask = stylesTask;
// exports.scriptTask = scriptTask;
// exports.htmlTask = htmlTask;
// exports.watcherTask = watcherTask;
 exports.clearDist = clearDist;
exports.imageTask = imageTask;


exports.build = series(clearDist,  parallel(scriptTask, stylesTask , imageTask), watcherTask);
exports.dev = series(parallel(scriptTask, stylesTask , imageTask), watcherTask); 
