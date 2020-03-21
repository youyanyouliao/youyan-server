var server = require('./server/server')
var app = server.app;
var conn = server.conn;
var fs = server.fs;
var userWeb = require('./webApi/user')
var userAdmin = require('./adminApi/user')
var carouselAdmin = require('./adminApi/carousel')
var activityAdmin = require('./adminApi/activity')
userWeb.userApiInit(app,conn);
userAdmin.userApiInit(app,conn);
carouselAdmin.carouselApiInit(app,conn,fs);
activityAdmin.activityApiInit(app,conn,fs);