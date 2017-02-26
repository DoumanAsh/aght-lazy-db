module.exports = {
    paths: {
        watched: ['front']
    },

    files: {
        javascripts: {
            joinTo: 'app.js'
        },
        stylesheets: {
            joinTo: {
                'style.css': /^front/
            }
        }
    },

    modules: {
        nameCleaner: path => path.replace(/^front\//, '')
    },

    conventions: {
        ignored: [
            'data/**/*.*',
            '_*.*',
            'test/**/*.js'
        ],
        assets: [
            /^front\/assets/,
            'front/templates/',
            'front/templates/[a-zA-Z0-9]*.jade',
        ],
    },

    plugins: {
        babel: {
            presets: ['es2015'],
            pattern: /^front\/.*\.js$/,
            plugins: ["inferno"]
        },
        stylus: {
            includeCss: true,
            plugins: ['autoprefixer-stylus']
        },
        eslint: {
            pattern: /^front\/.*\.js$/,
            warnOnly: true
        },
        jade: {
            staticBasedir: 'front/templates',
            noRuntime: true
        }
    }
};
