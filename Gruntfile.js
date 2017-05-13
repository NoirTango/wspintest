module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      './web/static/build/home.js': ['./web/static/homeView.js'],
      './web/static/build/stats.js': ['./web/static/statsView.js'],
      './web/static/build/import.js': ['./web/static/importView.js'],
      './web/static/build/grades.js': ['./web/static/gradesVuew.js']
    },
    watch: {
      files: [ "./web/static/*.js"],
      tasks: [ 'browserify' ]
    }
  })
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
}

