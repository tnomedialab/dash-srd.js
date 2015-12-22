/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['src/utils/ServiceBus.js',
            'src/utils/CrossOriginRequest.js',
            'src/utils/XMLToJSON.js',
            'src/srdplayer/Initialize.js',
            'src/srdplayer/MPDRetriever.js',
            'src/srdplayer/MPDParser.js',
            'src/srdplayer/PlaybackControls.js',
            'src/srdplayer/UIEventHandlers.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
