'use strict';

var _ = require('underscore'),
    path = require('path');

_.mixin({
    deepExtend: require('underscore-deep-extend')(_)
});

module.exports = function (grunt) {

    grunt.registerMultiTask('mergeLocales',
        'Merge locales and languages into json files', function () {

            var options = this.options(this.data);

            _.defaults(options, {
                sourceDirectory: null,
                destinationDirectory: null,
                locales: null,
                fallbackLanguage: null,
                generateLocaleFiles: true,
                generateLanguageFiles: false
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

            locales.forEach(function(locale) {
                var language = locale.split("_")[0];

                if (!languages.hasOwnProperty(language)) {
                    languages[language] = grunt.file.readJSON(path.join(sourceDirectory, language + ".json"));
                }
            });

            if (options.generateLanguageFiles === true) {
                Object.keys(languages).forEach(function (language) {
                    var json = JSON.stringify(_.deepExtend({}, fallback, languages[language]));
                    var destinationFile = path.join(destinationDirectory, language + ".json");
                    grunt.file.write(destinationFile, json);

                    grunt.log.writeln("Generated " + destinationFile);

                });
            }


            if (options.generateLocaleFiles) {

                locales.forEach(function (locale) {

                    var language = locale.split("_")[0];

                    var localePath = sourceDirectory + locale + ".json";
                    if (!locales.hasOwnProperty(locale) && grunt.file.exists(localePath)) {
                        languages[locale] = grunt.file.readJSON(localePath);
                    }

                    var json = JSON.stringify(_.deepExtend({}, fallback, languages[language], languages[locale]));
                    var destinationFile = path.join(destinationDirectory, locale + ".json");
                    grunt.file.write(destinationFile, json);
                    grunt.log.writeln("Generated " + destinationFile);

                });
            }

        });

};