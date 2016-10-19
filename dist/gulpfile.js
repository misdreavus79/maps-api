var gulp = require('gulp');
var Promise = require('bluebird');
var handlebars = require('gulp-compile-handlebars');
var campaignPackage = require('./package.json');
var rename = require('gulp-rename');
var request = require('request');

Promise.promisifyAll(request);

gulp.task('default',function () {
  var options = {
    ignorePartials: true,
    compile: {
      noEscape: true
    },
    helpers : {
      capitals : function(str){
        //return str.toUpperCase();
      },
      rawhelper : function(options) {
        return options.fn();
      }
    }
  };
  var name = campaignPackage.name.replace('@imp/','');
  var sdkVersion = campaignPackage.sdkVersion;
  request.getAsync('http://secure-netstorage.macys.com/social/imp-template-configs/template-config.json','utf-8').then(function(data){
    var templateData = JSON.parse(data.body);
    for(var key in templateData){
      if(templateData[key] === "process.env"){
      	templateData[key] = process.env[key]
      }
    }
    templateData.ASSETS_URL += name;
    templateData.CANONICAL_URL = "http://social.macys.com/" + name;
    if(sdkVersion){
      templateData.IMP_SDK_URL = process.env.IMP_SDK_URL.replace(/\b\d+(?:\.\d+)*\b/,sdkVersion.trim());
    }
    return gulp.src(['templates/**/*.hbs', '!templates/**/partials/*.*','templates/**/*.html'])
  		.pipe(handlebars(templateData, options))
  		.pipe(rename(function (path) {
      		path.extname = ".html"
    		}))
  		.pipe(gulp.dest('./public'));
  });
});
