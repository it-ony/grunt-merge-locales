grunt-merge-locales
===================

Deep merge localized json files, based on their language, with the option to a fallback 
language.

Install
-------

```
$ npm install --save-dev grunt-merge-locales
```

Usage
-----

In your Gruntfile

```js

module.exports = function (grunt) {

    grunt.initConfig({

        mergeLocales: {
                    // default options
                    options: {
                        fallbackLanguage: 'en'
                    },
                    
                    i18n: {
                        sourceDirectory: 'source/directory',
                        destinationDirectory: 'destination/directory',
                        locales: [
                            "de_AT",
                            "de_CH",
                            "en_GB",
                            "en_IE"
                        ]
                    }
        }
}

grunt.loadNpmTasks('grunt-merge-locales');

```

Options
-------

### fallbackLanguage

Type: `String`
Default: `null`

Loads a language as fallback language, which will deep merged to every generated file.

### generateLanguageFiles

Type: `Boolean`
Default: false

Generates languages files from the source files and if `fallbackLanguage` is set,
also merges the fallback language into it.

### generateLocaleFiles

Type: `Boolean`
Default: true

Generates localized i18n files based on the given `locales`. It merges the locale from 
the source directory with the language file of the locale and also the fallbackLanguage
if given.

### indent

Type: `Number`
Default: null

The number of spaces to indent the json file during formatting. If null is given the file
will be minified.

License
-------

MIT