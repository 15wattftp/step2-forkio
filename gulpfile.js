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


const BsServer =  function() {
  browserSync.init({
      server: {
          baseDir: "./"
      },
          tunnel:true
      // .port:65133
  });
};


// const BsReload = () => {
//   return browserSync.reload();
  
// };

function script() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(concat("script.js"))
    .pipe(rename({suffix: '.min'}))
    .pipe(
      uglify({
        toplevel: true,
      })
    )
    .pipe(dest("./dist/js/"))
    .pipe(browserSync.stream());
}

//                              уточнить как выставить последовательность в SAAS    + include path
function styles() {
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

// function html() {
//   return .src("./src/**/*.html")
//         .pipe(dest("./dist/"))
        
// }

function watcher() {
//   browserSync.init({
//     server: {
//         baseDir: "./"
//     }
// });
BsServer();

//.on('change', browserSync.reload)
  watch("./src/styles/**/*.scss", styles); 
  // watch("./src/styles/**/*.scss", ['sass']);
  watch("./src/js/**/*.js", script);
  watch("./**/*.html").on('change', browserSync.reload);
}

// function clearDist() {
//   del("./dist/*");
// }

async function clearDist() {
  return await del("./dist/*");
}

// exports.styles = styles;
// exports.script = script;
// exports.html = html;
// exports.watcher = watcher;
// exports.clearDist = clearDist;

exports.build = series(clearDist,  parallel(script, styles),parallel( watcher));
// exports.dev =series();