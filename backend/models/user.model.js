mongoose = require('mongoose') ;


var Schema = new mongoose.Schema ({
    username :  {
        type : String
    } ,
   
    email : {
        type : String
    },
    password : {
        type : String ,
    },
    role : {
        type : String ,
    },
    phone : {
        type : String ,
    },
	prename : {
		type : String
	}
},
{ timestamps: { createdAt: 'created_at' } }) ;

module.exports = mongoose.model('users' , Schema) ;
