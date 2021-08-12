let project_folder = require('path').basename(__dirname);
let source_folder = "app";

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/sass/main.sass",
		js: source_folder + "/js/common.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,webp}",
		fonts: source_folder + "/fonts/**/*",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/sass/main.sass",
		js: source_folder + "/js/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,webp}",
	},
	clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webpCSS = require('gulp-webp-css'),
	webpHTML = require('gulp-webp-html');




function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}


function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		//.pipe(webpHTML())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}



function css() {
	return src(path.src.css)
		.pipe(
			sass({
				outputStyle: 'expanded'
			}).on('error', sass.logError)
		)
		.pipe(group_media())
		.pipe(autoprefixer(['last 5 versions']))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: '.min.css'
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: '.min.js'
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)
		// .pipe(
		// 	webp({
		// 		quality: 70
		// 	})
		// )
		// .pipe(dest(path.build.img))
		// .pipe(src(path.src.img))
		// .pipe(
		// 	imagemin({
		// 		progressive: true,
		// 		interlaced: true,
		// 		optimizationLevel: 3, //0 to 7
		// 		svgoPlugins: [
		// 			{
		// 				removeViewBox: true
		// 			}
		// 		]
		// 	})
		// )
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}


function fonts() {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream())
}

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
}


function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, fonts, images));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;



//не установил 
//webp 
//webp-css
//svg спрайт