var RSSParser = require('rss-parser');
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
let parser = new RSSParser();

module.exports.parseURL = function (url) {
  parser.parseURL(CORS_PROXY + url, function (err, feed) {
    console.log(feed);
    console.log (feed.items)
    //feed.items.forEach(function (item) {
    //  console.log(item.title + ':' + item.link);
    //  //return (item)
    //})
  })
}
