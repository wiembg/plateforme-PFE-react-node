mongoose = require('mongoose') ;
var Schema = mongoose.Schema;

var Schema = new mongoose.Schema ({
    name :  {
        type : String
    } ,
    date :  {
        type : String
    } ,

    text : {
        type : String
    },
    added_by : {
        type : String
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref : "users" 
    }
}) ;

module.exports = mongoose.model('Note' , Schema) ;
