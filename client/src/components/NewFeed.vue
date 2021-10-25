<template>
  <div class="feeds">
    <h1>
      <div class="animated fadeInLeft">Add </div>
      <div class="animated fadeInRight">Feed </div>
    </h1>
      <div class="form">
        <div>
          <input type="text" name="feedUrl" placeholder="URL" v-model="feedUrl">
        </div>
        <!--<div>
          <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>-->
        <div>
          <button class="app_feed_btn" @click="newFeed">Add</button>
        </div>
      </div>
  </div>
</template>

<script>
  import axios from 'axios'
  var RSSParser = require('rss-parser')
  const moment = require('moment')
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
  let parser = new RSSParser(
    {
      defaultRSS: 2.0,
      customFields: {
        item: ['fetchedDate']
      }
    })
export default {
  name: 'NewFeed',
  data () {
    return {
      feedUrl: ''
    }
  },
  methods: {
    newFeed() {
      console.log(this.feedUrl)
      var self=this
      parser.parseURL(CORS_PROXY + this.feedUrl, function (err, feed) {
        if (err) { alert("Error found in URL") }
        else {
          feed.feedUrl = self.feedUrl
          for (let i = 0; i < feed.items.length; i++) {
            feed.items[i].fetchedDate = moment().toISOString()
          }
          axios.post(`http://localhost:8081/feeds`, feed)
            .then(response => {
              console.log(response)
              if (response.data.success === true) {
                alert("Added Successfully")
                self.$router.push({
                  name: 'Feeds'
                })
              }
              else {
                alert(response.data.message)
                self.$router.push({
                  name: 'Feeds'
                })
              }
            })
            .catch(e => {
              this.errors.push(e)
              if (e.response.status === 401) {
                alert('unauthorized')
                this.$router.push({
                  name: 'Login'
                })
              }
            })
        }
      })
    }
  }
}
</script>

<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_feed_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
  html, body {
    height: 100%;
    font-family: 'Varela Round' sans-serif;
    text-align: center;
  }

  h1 div {
    position: relative;
    float: left;
  }

    h1 div:first-child {
      color: #3498db;
      margin-right: 1rem;
    }
</style>
