const { query } = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const Note = require('../models/notebook.model') ;
express = require('express') ;
const User = require('../models/user.model') ;
const Annee = require('../models/annee.model') ;
const PFE = require('../models/pfe.model') ;
var cors = require('cors')


var router = express.Router () ;


router.get('/team',(req,res)=>{
    var tittle = 'Modifier Note' ;
    var query;
    User.find(query,(err, docs) => {
        if (!err) {
           
            res.render("user/management", {
                users: docs,
               
                
                
            });
            //console.log(docs[0]._id);
        }
        else {
            console.log('Error in retrieving users list :' + err);
        }
    }).lean()
    // execute query
    .exec(function(error, body) {});
   
})

router.post('/delete/:id', (req, res) => {
  
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            console.log("aaaaaaaaaaa");
            res.redirect('/admin/etudiant');
        }
        else { console.log('Erreur lors du suppression du Note :' + err); }
    });
});

router.get('/annee',(req,resp)=>{
   
    var tittle = 'Note Form' ;
    Annee.findOne({}, function(err, docs) {
        console.log(docs);
        if (docs) { 
            
            /*resp.render('user/anneeEdit',{
                annee: docs,
            });*/
            return resp. json(docs);
        }
        else {
            resp.render('user/annee',{
                'Annee' : tittle
            });
        }
    }).lean();;
   
})


router.post('/annee', function(req, res, next) {
    Annee.remove({}, function(err,removed) {
        console.log(err);
    });
    console.log(req.body)
    var annee = new Annee();
    annee.datedeb=req.body.datedeb;
    annee.datefin=req.body.datefin;
    annee.delai=req.body.delai;
   
    /*const authcookie = req.cookies.authcookie;

    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
      if(data){
      req.user = data.user;
      console.log(data);
      annee.owner=data;
      annee.added_by=data.name;
      }
    });
*/

    console.log(annee);
    annee.save(function(err, user) {
        if (err) return res.json(err);
        return res.json("true");
        res.redirect('/admin/annee');
    });
}) ;


router.post('/annee/edit', function(req,res,next){
    
    Annee.findOneAndUpdate({ },
      req.body,
      { new: true },
      (err, contact) => {
      if (err) {
        res.status(400).json(err);
      }
      res.redirect('/admin/annee');
    });
});



router.get('/infoEtudiant/:id',(req,res)=>{
    PFE.findOne({added_by_id:req.params.id}, (err, docs) => {
        if (!err) {
           console.log(docs);
           return res.json(docs);
            res.render("user/infoEtudiant", {
                Sujet: docs
                
            });
            //console.log(docs[0]._id);
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
   
})



router.get('/infoEnseignant/:id',(req,res)=>{
    PFE.find({accepted_by_id:req.params.id}, (err, docs) => {
        if (!err) {
           console.log(docs);
            res.render("user/infoEnseignant", {
                Sujets: docs
                
            });
            //console.log(docs[0]._id);
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
   
})


router.post('/ban/:id', (req, res) => {

    User.findOneAndUpdate({_id:req.params.id},  {'role':"banned"}, {new: true}, function(err, doc) {
        if (!err) {
            res.redirect('/login');
        }
    });
});


module.exports = router ;