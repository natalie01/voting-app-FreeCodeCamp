var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema =  mongoose.Schema({
	author: {type: String, ref: 'User', required: true},
	title : {type : String,required:true},
	options :[{
    op : Number,
    option: String,
    votes : Number
     }]
})

var Poll = module.exports = mongoose.model('Poll', pollSchema);
