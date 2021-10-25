<template>
  <div class="feeds">
    <h1>
      <div class="animated fadeInLeft">Feed </div>
      <div class="animated fadeInRight">Items</div>
    </h1>
    <div class="form">
      <div v-if="items.length > 0">
        <table>
          <tr>
            <td>Title</td>
            <td>Content Snippet</td>
            <td width="150">Published on Website</td>
            <td width="150">Published Here</td>
          </tr>
          <tr v-for="item in sortedItems">
            <td><a :href=item.link>{{ item.title }}</a></td>
            <td>{{item.contentSnippet}}</td>
            <td>{{format_date(item.pubDate)}}</td>
            <td>{{format_date(item.fetchedDate)}}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        No items available to display
      </div>
    </div>
  </div>
</template>

<script>
  import FeedsService from '@/services/FeedsService'
  import moment from 'moment'

  export default {
    name: 'ParseFeed',
    data() {
      return {
        feedUrl: '',
        items: []
      }
    },
    mounted() {
      this.parse()
    },
    methods: {
      async parse() {
        const response = await FeedsService.parseFeed({
          id: this.$route.params.id
        })
        this.feedUrl = response.data.feedUrl
        this.items = response.data.items
      },
      format_date(value) {
        if (value) {
          return moment(String(value)).format('MMMM Do YYYY, h:mm:ss a');
        }
      }
    },
    computed: {
      sortedItems: function () {
        console.log(this.items)
        this.items.sort((a, b) => {
          return new Date(b.pubDate) - new Date(a.pubDate);
        });
        return this.items;
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
  .table-wrap {
    width: 60%;
    margin: 0 auto;
    text-align: center;
  }

  table th, table tr {
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
  h1 {
    margin-top: 5%;
    font-size: 3rem;
    display: inline-block;
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
