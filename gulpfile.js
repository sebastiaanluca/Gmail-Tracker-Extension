/*
 * Requirements and plugins
 */

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

// Auto-load all node (npm) plugins and
// assign them to an accessible variable.
var $ = require('gulp-load-plugins')({
    pattern: ['*'],
    replaceString: /\bgulp[\-.]/
});



/*
 * Constants and variables
 */

var env = process.env.ENV || 'development';

var shouldCompressSASS = false;
var shouldUglifyJS = false;

var ASSETS_SOURCE = './src/';
var ASSETS_DESTINATION = './build/';

var JS_VENDORS = './' + ASSETS_SOURCE + 'js/vendors.json';

var DESTINATON_STYLESHEETS_DIR = 'stylesheets';
var DESTINATION_SCRIPTS_DIR = 'scripts';

var DESTINATIONS = [ASSETS_DESTINATION + DESTINATON_STYLESHEETS_DIR, ASSETS_DESTINATION + DESTINATION_SCRIPTS_DIR, ASSETS_SOURCE + 'js/*/config/generated'];



/**
 * Custom error handler for gulp-plumber.
 */
var onError = function (err) {
    // Highlight terminal
    $.util.beep();
    
    // Show notification
    $.notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);
    
    // Confirm end of function to continue (Plumber stuff)
    if (this.hasOwnProperty('emit')) {
        this.emit('end');
    }
};

/**
 * Notify user on JS hints.
 */
var onHints = function (file) {
    if (file.jshint.success) {
        // Don't show something if success
        return false;
    }
    
    var errors = file.jshint.results.map(function (data) {
        if (data.error) {
            return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
    }).join("\n");
    
    return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
};

/**
 * Read a directory and get a list of all folders in it.
 */
function getFolders(dir) {
    return fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

/**
 * Check if an array of file exist.
 */
function statAll(files) {
    files.forEach(fs.statSync); // Will trow an error if file not found
}

/**
 * Reload a file directly from its source by invalidating
 * the cache first (as `require` only loads a file once).
 */
function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

/**
 * Parse a single folder with script files.
 */
function parseJSFolder(folder) {
    var pipeline = gulp
    .src([
        ASSETS_SOURCE + 'js/' + folder + '/' + folder + '.js',
        ASSETS_SOURCE + 'js/' + folder + '/**.js',
        ASSETS_SOURCE + 'js/' + folder + '/**/*Module.js',
        //ASSETS_SOURCE + 'js/' + folder + '/config/ConfigModule.js',
        ASSETS_SOURCE + 'js/' + folder + '/common/**/**.js',
        ASSETS_SOURCE + 'js/' + folder + '/core/**/**.js',
        ASSETS_SOURCE + 'js/' + folder + '/sections/**.js',
        ASSETS_SOURCE + 'js/' + folder + '/**/**.js'
    ])
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe($.jshint()).pipe($.jshint.reporter('default'))
        
        // File per folder
    .pipe($.concat(folder + '.js'));
    
    if (shouldUglifyJS === true) {
        pipeline = pipeline.pipe($.ngAnnotate()).pipe($.uglify());
    }
    
    pipeline = pipeline
    .pipe($.rename({
        suffix: '.min'
    })) // Add .min
    .pipe(gulp.dest(ASSETS_DESTINATION + DESTINATION_SCRIPTS_DIR));
    
    return pipeline;
}

/*
 * Tasks
 */

/**
 * Parse all SASS files
 *
 * Parses all SASS files and generates an expanded CSS file per source file.
 * Generates a compressed file and no sourcemaps in production environments.
 */
gulp.task('sass', function () {
    return gulp.src(ASSETS_SOURCE + 'sass/*.scss')
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe(shouldCompressSASS === true ? $.rubySass({
        style: 'compressed',
        noCache: true,
        sourcemap: 'none'
    }) : $.rubySass({
        style: 'expanded',
        noCache: true
    }))
    .pipe($.autoprefixer()) // 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    .pipe($.rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(ASSETS_DESTINATION + DESTINATON_STYLESHEETS_DIR));
});



/**
 * Parse vendor script files according to vendors.json
 *
 * Uglify contents, concatenate all scripts, and copy to destination
 * but with Dependency Injection still maintained for AngularJS.
 */
gulp.task('js:vendors', function () {
    try {
        
        // Need to delete the cache first since
        // "require" only loads a file once
        // and we want to use this function in `watch`
        var vendors = requireUncached(JS_VENDORS);
        
        // Prefix each script location with the full path
        for (var index in vendors.scripts) {
            vendors.scripts[index] = vendors.scripts[index];
        }
        
        // Check for faulty links
        statAll(vendors.scripts);
        
    } catch (error) {
        error.message = 'Failed to parse vendor file! Check vendors.json for errors.\n' + error.message;
        onError(error);
    }
    
    return gulp.src(vendors.scripts)
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe($.ngAnnotate()).pipe($.uglify())
    .pipe($.concat('vendors.min.js'))
    .pipe(gulp.dest(ASSETS_DESTINATION + DESTINATION_SCRIPTS_DIR));
});

gulp.task('js:config:oauth', function () {
    return gulp.src('./oauth.token')
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe($.replace(
    /OAuth2 client "([^"]+)" created.\nID: ([a-zA-Z0-9]+)\nSecret: ([a-zA-Z0-9]+)/g,
    '{"Config": {"oauth":{"client_id":"$2", "client_secret":"$3"}}}'))
    .pipe($.rename({
        basename: 'app/config/generated/oauth',
        extname: '.json'
    }))
    .pipe(gulp.dest(ASSETS_SOURCE + 'js'));
});

/**
 * Parse all JSON config files to .js modules
 *
 * INFO // Use `ENV=production gulp` to specify the environment (useful when deploying)
 */
gulp.task('js:config', ['js:config:oauth'], function () {
    return gulp.src(ASSETS_SOURCE + 'js/*/config/' + env + '.json')
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe($.jsonEditor(require(ASSETS_SOURCE + 'js/app/config/generated/oauth.json')))
    .pipe($.ngConstant({
        name: 'config'
    }))
    .pipe($.rename({
        basename: 'generated/ConfigModule'
    }))
    .pipe($.header(['/**',
        ' * WARNING',
        ' * ',
        ' * This file has automatically been generated from <%= env %>.json by gulp.',
        ' ',
        ' * Do NOT modify it as it will be overwritten!',
        ' */',
        ' ',
        ''].join('\n'), {
        env: env
    }))
    .pipe(gulp.dest(ASSETS_SOURCE + 'js'));
});

/**
 * Parse all JavaScript files
 *
 * Go through all directories in the js folder and create a minified, uglified,
 * concatenated js file of all files in that directory. Also produces hints
 * and warnings via JS Hint.
 */
gulp.task('js', ['js:config'], function () {
    // https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
    var folders = getFolders(ASSETS_SOURCE + 'js/');
    var tasks = folders.map(parseJSFolder);
    return $.eventStream.concat.apply(null, tasks);
});



/**
 * Delete all files in destination folders.
 */
gulp.task('clean:destinations', function (callback) {
    $.del(DESTINATIONS, callback);
});

/**
 * Delete all files in generated folders.
 */
gulp.task('clean:generated', function (callback) {
    $.del(ASSETS_SOURCE + '**/generated', callback);
});

/**
 * Just throw a quick notification in the CLI when everything was built.
 */
gulp.task('build:notify', function (callback) {
    $.util.log($.util.colors.green('Files successfully parsed!'));
    callback();
});



/**
 * Wrapper task for clean functions.
 */
gulp.task('clean', ['clean:destinations']);

/**
 * Perform clean task and build all files + notify user.
 */
gulp.task('build', ['clean'], function (callback) {
    $.runSequence(['js:vendors', 'js', 'sass'], ['build:notify', 'clean:generated'], callback);
});

/**
 * Watch the necessary directories for changes and rebuild source files,
 * reload browsers if anything was changed.
 */
gulp.task('watch', function (callback) {
    gulp.watch(ASSETS_SOURCE + 'sass/**/**.scss', ['sass']);
    gulp.watch([ASSETS_SOURCE + 'js/**/**.js', ASSETS_SOURCE + 'js/*/config/' + env + '.json'], ['js']);
    gulp.watch(JS_VENDORS, ['js:vendors']);
    
    $.util.log($.util.colors.magenta('Watching for changes…'));
    
    callback();
});

/**
 * Build all files, but minify and compress them first.
 */
gulp.task('production', function (callback) {
    shouldCompressSASS = true;
    shouldUglifyJS = true;
    gulp.start('build');
});



/**
 * Wrapper task for setting up a livereload server,
 * building all files, and watching for changes.
 */
gulp.task('default', function (callback) {
    $.runSequence('build', 'watch', callback);
});