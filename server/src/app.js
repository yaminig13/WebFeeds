var mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const moment = require('moment')
const morgan = require('morgan')
var Feed = require("../models/feed");
var auth = require('../src/auth');
var passport = require('passport');
require('../config/passport')(passport);
var RSSParser = require('rss-parser');
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
let parser = new RSSParser(
    {
        customFields: {
            item: ['fetchedDate']
        }
    });
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(cors())
app.use('/api/auth', auth);

mongoose.connect('mongodb://localhost:27017/webfeeds');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

updateFeeds();

deleteFeeds();

function deleteFeeds() {   
        var end = moment().subtract(30, 'days')
        end=end.toISOString()
        console.log(end)
        Feed.updateMany({}, { $pull: { items: { pubDate: { $lt: end } } } }, function (error, res)
        {
            if (error) 
            { console.error(error); }
            else 
                console.log(res)
        })
}

function updateFeeds() {
    deleteFeeds();
    Feed.find({}, function (error, posts) {
        if (error) { console.error(error); }
        else { 
            var count=0
            for (let i = 0; i < posts.length; i++) {
                parser.parseURL(posts[i].feedUrl, function (err, pfeed) {
                    if (err) {
                        
                        console.error(err);
                        posts[i].updateCount = -1;
                        console.log(posts[i].updateCount)
                    }
                    else { 
                        count = 0;
                        maxDate = new Date(Math.max.apply(null, posts[i].items.map(function (e) {
                            return new Date(e.isoDate);
                        })));
                        for (let j = 0; j < pfeed.items.length; j++) {
                            if (moment(pfeed.items[j].isoDate).isAfter(maxDate)) {
                                pfeed.items[j].fetchedDate = moment().toISOString();
                                posts[i].items.push(pfeed.items[j]);
                                console.log(pfeed.items[j].isoDate)
                                count = count + 1
                                
                            }
                        }
 
                        posts[i].updateCount = count
                    }
                    posts[i].lastBuildDate = moment().toISOString();
                    posts[i].save(function (error) {
                        if (error) {
                            console.log(error)
                        }
                    })
                })
            }
        }
    })
    //setTimeout(updateFeeds,600000);
};

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

app.get('/feeds', passport.authenticate('jwt', { session: false }), (req, res) => {
    var token = getToken(req.headers);
   
    if (token) {
        var userId = req.user._id;
        updateFeeds();
        Feed.find({user:userId}).sort({ _id: -1 }).exec(function (error, feeds) {
            if (error) { console.error(error); }
            res.send({
                feeds: feeds
            })
        })
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }

})

app.post('/feeds',passport.authenticate('jwt', { session: false}), (req, res) => {
    var db = req.db;
    var token = getToken(req.headers);

    var feedUrl = req.body.feedUrl;
    var user = req.user;
    var items = req.body.items;
    var description = req.body.description;
    var docs = req.body.docs;
    var lastBuildDate = req.body.lastBuildDate;

    var new_feed = new Feed({
        feedUrl: feedUrl,
        user: user,
        items: items,
        description: description,
        docs: docs,
        lastBuildDate: lastBuildDate
    })
    if (token) {
        new_feed.save(function (error) {
            if (error) {
                res.send({
                    success: false,
                    message: 'Feed could not be added. Please check console'
                })
            }
            else {
                res.send({
                    success: true,
                    message: 'Feed saved successfully!'
                })
            }
        })
    }
    else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    
    }
})

app.get('/feed/:id', (req, res) => {
    var db = req.db;
    Feed.findById(req.params.id, 'feedUrl', function (error, post) {
        if (error) { console.error(error); }
        res.send(post)
    })
})

app.get('/parsefeed/:id', (req, res) => {
    var db = req.db;
    console.log(req.params.id)
    
    Feed.findById(req.params.id, function (error, post) {
        if (error) { console.error(error); }
        res.send(post)
    }) 
})
// Update a post
app.put('/feeds/:id', (req, res) => {
    var db = req.db;
    Feed.findById(req.params.id, function (error, feed) {
        if (error) { console.error(error); }

        feed.feedUrl = req.body.feedUrl
        //feed.description = req.body.description
        feed.save(function (error) {
            if (error) {
                res.send({
                    success: false
                })
                console.log(error)
            }
            else {
                res.send({
                    success: true
                })
            }
        })
    })
})


app.listen(process.env.PORT || 8081)
