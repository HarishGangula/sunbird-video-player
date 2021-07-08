var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const host = 'dev.sunbirded.org';
const dock_host = 'dock.sunbirded.org'
var app = express();
app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use(['/action/questionset/v1/*',
    '/action/question/v1/*',
    '/action/object/category/definition/v1/*',
    '/action/collection/v1/*'
    ], proxy(host, {
    https: true,
    limit: '50mb',
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '/api/')
        console.log('proxyReqPathResolver questionset', req.originalUrl);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 3')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        // proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = ""
        proxyReqOpts.headers['authorization'] = '';
        proxyReqOpts.headers['x-authenticated-user-token'] = '';
        return proxyReqOpts;
    }
}));

http.createServer(app).listen(app.get('port'), 3000);
