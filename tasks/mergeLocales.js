'use strict';

var _ = require('underscore'),
    path = require('path');

function deepExtend(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property) && source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            deepExtend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
}

_.deepExtend = function(input) {

    for (var i = 1; i < arguments.length; i++) {
        deepExtend(input, arguments[i]);
    }

    return input;

};



module.exports = function (grunt) {

    grunt.registerMultiTask('mergeLocales',
        'Merge locales and languages into json files', function () {

            var options = this.options(this.data);

            _.defaults(options, {
                sourceDirectory: null,
                destinationDirectory: null,
                locales: null,
                fallbackLanguage: null,
                fallback: null,
                fallbackToLanguageFile: true,
                generateLocaleFiles: true,
                generateLanguageFiles: false,
                indent: null
            });

            if (!options.sourceDirectory) {
                grunt.log.error("No sourceDirectory given");
                return;
            }

            if (!options.destinationDirectory) {
                grunt.log.error("No destinationDirectory given");
                return;
            }

            if (!options.locales) {
                grunt.log.error("No supportedLocales given");
                return;
            }

            var destinationDirectory = options.destinationDirectory,
                sourceDirectory = options.sourceDirectory,
                locales = options.locales,
                languages = {},
                fallback = {},
                fallbackLanguage = options.fallbackLanguage;

            if (fallbackLanguage) {
                fallback = languages[fallbackLanguage] = grunt.file.readJSON(path.join(sourceDirectory, fallbackLanguage + ".json"));
            }

            var indent = options.indent;

            if (options.fallbackToLanguageFile) {
                locales.forEach(function(locale) {
                    var language = locale.split("_")[0];

                    if (!languages.hasOwnProperty(language)) {
                        languages[language] = grunt.file.readJSON(path.join(sourceDirectory, language + ".json"));
                    }
                });
            }

            if (options.generateLanguageFiles === true) {
                Object.keys(languages).forEach(function (language) {
                    var json = JSON.stringify(_.deepExtend({}, fallback, languages[language]), null, indent);
                    var destinationFile = path.join(destinationDirectory, language + ".json");
                    grunt.file.write(destinationFile, json);

                    grunt.log.writeln("Generated " + destinationFile);
                });
            }


            if (options.generateLocaleFiles) {

                locales.forEach(function(locale) {
                    var localePath = path.join(sourceDirectory, locale + ".json");
                    if (!locales.hasOwnProperty(locale) && grunt.file.exists(localePath)) {
                        languages[locale] = grunt.file.readJSON(localePath);
                    }
                });

                locales.forEach(function(locale) {

                    var language = locale.split("_")[0];

                    var json = {};

                    let fallbackLocaleConfiguration = (options.fallback || {})[locale];

                    if (options.fallback && fallbackLocaleConfiguration) {
                        fallbackLocaleConfiguration.reverse().forEach(function(fallbackLocale) {

                            languages[fallbackLocale] = languages[fallbackLocale] || grunt.file.readJSON(path.join(sourceDirectory, fallbackLocale + ".json"));

                            _.deepExtend(json, languages[fallbackLocale] || {});
                        });

                        json = JSON.stringify(json, null, indent);
                    } else {
                        json = JSON.stringify(_.deepExtend({}, fallback, languages[language] || {}, languages[locale]), null, indent);
                    }


                    var destinationFile = path.join(destinationDirectory, locale + ".json");
                    grunt.file.write(destinationFile, json);
                    grunt.log.writeln("Generated " + destinationFile);

                });
            }

        });

};