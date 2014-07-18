/**
 * Created by rishabh on 16/7/14.
 */
var express = require('express')
var session = require('cookie-session')

var app = express()

app.use(session({
    keys: ['key1'],
    secureProxy: true // if you do SSL outside of node
}))

app.use(function (req, res, next) {
    var n = req.session.views || 0
    req.session.views = ++n
    res.end(n + ' views')
    next()
})

app.route("/del").get(function(req,res){
    console.log("helll")
    req.session = null
    res.end("session null")
})
app.listen(3000)