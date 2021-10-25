<template>
  <div class="feeds">
    <h1>
      <div class="animated fadeInLeft">Edit </div>
      <div class="animated fadeInRight">Feed</div>
    </h1>
    <div class="form">
      <div>
        <input type="text" name="title" placeholder="TITLE" v-model="feedUrl">
      </div>
      <div>
        <button class="app_feed_btn" @click="updateFeed">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
import FeedsService from '@/services/FeedsService'
export default {
  name: 'EditFeed',
  data () {
    return {
      feedUrl: ''
    }
  },
  mounted () {
    this.getFeed()
  },
  methods: {
    async getFeed () {
      const response = await FeedsService.getFeed({
        id: this.$route.params.id
      })
      this.feedUrl = response.data.feedUrl
    },
    async updateFeed () {
      const response=await FeedsService.updateFeed({
        id: this.$route.params.id,
        feedUrl: this.feedUrl
      })
      if (response.data.success == false) {
        alert('Error found! Please check console')
      }
      else {
        alert("Successfully Edited!")
        console.log(response.data.success)
        this.$router.push({ name: 'Feeds' })
      }
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

  .app_post_btn {
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
