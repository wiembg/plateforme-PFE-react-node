mongoose = require('mongoose') ;
var Schema = mongoose.Schema;

var Schema = new mongoose.Schema ({
   
    pfe : {
        type : String
    },
	entreprise: {
		type: String 
	},
	encadrantchoisi: {
		type:String
	},
    added_by_id : {
        type : String
    },
    added_by_name : {
        type : String
    },
    accepted_by_id : {
        type : String
    },
    accepted_by_name : {
        type : String
    },
    accepted_by_date : {
        type : String
    },
	refused: {
		type:Boolean
	}	
}) ;

module.exports = mongoose.model('pfe' , Schema) ;
