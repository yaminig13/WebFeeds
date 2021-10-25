import Api from '@/services/Api'

export default {
  updateFeed (params) {
    return Api().put('feeds/' + params.id, params)
  },

  getFeed (params) {
    return Api().get('feed/' + params.id)
  },
  parseFeed (params) {
    return Api().get('parsefeed/' + params.id)
  }
}
