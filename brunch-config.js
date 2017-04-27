const path = require('path');
const blaze_download = require('./ci/blaze_download.js');
const blaze_css = [
    "components.tables.min.css",
    "components.inputs.min.css",
    "objects.modals.min.css",
    "components.cards.min.css",
    "components.overlays.min.css",
    "components.buttons.min.css",
    "components.headings.min.css",
    "components.badges.min.css",
    "generics.global.min.css"
];

module.exports = {
    paths: {
        watched: ['front', 'data', 'vendor']
    },

    files: {
        javascripts: {
            joinTo: 'app.js'
        },
        stylesheets: {
            joinTo: {
                'style.css': /^front/,
                'vendor.css': /^vendor/
            }
        }
    },

    modules: {
        nameCleaner: path => path.replace(/^front\//, '')
    },

    conventions: {
        ignored: [
            'data/**/*.js',
            '_*.*',
            'test/**/*.js'
        ],
        assets: [
            /^front\/assets/,
            'front/templates/',
            'front/templates/[a-zA-Z0-9]*.jade',
        ],
    },

    hooks: {
        preCompile: function() {
            blaze_download(blaze_css, path.join(__dirname, 'vendor', 'styles'));
        }
    },

    plugins: {
        babel: {
            presets: ['es2015'],
            plugins: ["inferno"]
        },
        stylus: {
            includeCss: true,
            plugins: ['autoprefixer-stylus']
        },
        eslint: {
            pattern: /^front\/.*\.js(x)*$/,
            warnOnly: true
        },
        cleancss: {
            specialComments: 0,
            removeEmpty: true
        },
        jade: {
            staticBasedir: 'front/templates',
            noRuntime: true
        }
    }
};
