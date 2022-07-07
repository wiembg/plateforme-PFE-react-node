mongoose = require('mongoose') ;
var Schema = mongoose.Schema;

var Schema = new mongoose.Schema ({
   
    datedeb :  {
        type : String
    } ,
    datefin :  {
        type : String
    } ,
    delai :  {
        type : String
    } 
   
}) ;

module.exports = mongoose.model('annee' , Schema) ;
