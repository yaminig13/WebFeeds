var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const moment = require('moment')
var FeedsSchema = new Schema({

    feedUrl: {
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    docs: {
        type: String,
        default: '',
        trim: true
    },
    items: {
        type: Array
    },
    lastBuildDate: {
        type: Date,
        default: '',
        trim: true
    },
    updateCount: {
        type: Number,
        default: 0,
        trim: true

    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Statics
 */
FeedsSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};


var Feed = mongoose.model("Feed", FeedsSchema);
module.exports = Feed;