<template>
  <div class="feeds">
    <nav
      class="navbar navbar-expand-md navbar-dark bg-dark sidebarNavigation"
      data-sidebarClass="navbar-dark bg-dark"
    >
      <div class="container-fluid">
        <b-button
          variant="outline-info"
          v-bind:to="{ name: 'NewFeed' }"
          class=""
          >Add Feed</b-button
        >
        <b-button variant="outline-info" @click="update()"
          >Update Feeds</b-button
        >
        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul class="nav navbar-nav nav-flex-icons ml-auto">
            <li class="nav-item">
              <b-link class="nav-link" @click="logout()"> Logout </b-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <h1>
      <div class="animated fadeInLeft">DBW</div>
      <div class="animated fadeInRight">Feed Aggregator</div>
    </h1>

    <div v-if="feeds.length > 0" class="table-wrap">
      <table class="table">
        <tr>
          <td width="550">URL</td>
          <td width="300" align="center">Last Updated</td>
          <td width="200" align="center">Items Added</td>
          <td width="100" align="center">Action</td>
        </tr>
        <tr v-for="feed in feeds" :key="feed.id">
          <td>
            <router-link
              v-bind:to="{ name: 'ParseFeed', params: { id: feed._id } }"
              >{{ feed.feedUrl }}</router-link
            >
          </td>
          <td align="center">
            {{ format_date(feed.lastBuildDate) }}
          </td>
          <td align="center" v-if="feed.updateCount == -1">
            <i class="fas fa-exclamation-circle"></i>
          </td>
          <td align="center" v-else>
            {{ feed.updateCount }}
          </td>
          <td align="center">
            <router-link
              class="btn btn-primary btn-xs"
              v-bind:to="{ name: 'EditFeed', params: { id: feed._id } }"
            >
              <span class="glyphicon glyphicon-edit"></span>
              Edit
            </router-link>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      There are no feeds.. Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'NewFeed' }" class="add_feed_link"
        >Add Feed</router-link
      >
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'feeds',
  data() {
    return {
      feeds: [],
      feedUrl: '',
      errors: []
    }
  },
  created() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.get(`http://localhost:8081/feeds`)
      .then(response => {
        this.feeds = response.data.feeds
      })
      .catch(e => {
        this.errors.push(e)
        if (e.response.status === 401) {
          alert('unauthorized')
          this.$router.push({
            path: '/patients'
          })
        }
      })
  },
  methods: {
    logout() {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    },
    format_date(value) {
      if (value) {
        return moment(String(value)).format('MMMM Do YYYY, h:mm:ss a');
      }
    },
    update() {
      axios.get(`http://localhost:8081/feeds`)
        .then(response => {
          this.feeds = response.data.feeds
          alert("Successfully Updated")
        })

    }
  }
}
</script>

  <style type="text/css">
.table-wrap {
  width: 90%;
  margin: 0 auto;
  text-align: center;
}

table th,
table tr {
  text-align: left;
}

table thead {
  background: #f2f2f2;
}

table tr td {
  padding: 10px;
}

table tr:nth-child(odd) {
  background: #f2f2f2;
}

table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}

a {
  color: #4d7ef7;
  text-decoration: none;
}

a.add_post_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
h1 {
  margin-top: 5%;
  font-size: 3rem;
  display: inline-block;
}

html,
body {
  height: 100%;
  font-family: "Varela Round" sans-serif;
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
