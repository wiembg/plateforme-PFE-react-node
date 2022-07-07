
const User = require('../models/user.model') ;
jwt = require('jsonwebtoken'),
express = require('express') ;
const bcrypt = require('bcrypt');
const PFE = require('../models/pfe.model') ;
const Annee = require('../models/annee.model') ;

var token;

var router = express.Router () ;



router.get('/pfe',(req,resp)=>{
    const authcookie = req.cookies.authcookie;
    var id,user,delai;
    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
      if(data){
        id=data._id;
        user=data;
      }
    });

    PFE.findOne({added_by_id:id}, function(err, docs) {
        console.log(docs);
        if (docs) { 
            Annee.findOne({}, (err, doc) => {
                if (!err) {
                    delai=doc.delai;                   
                }
                //x=doc.pfe
                console.log(delai);

                var date_diff_indays = function(date1, date2) {
                    dt1 = new Date(date1);
                    dt2 = new Date(date2);
                    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
                    }
                    var days=date_diff_indays(Date.now(), delai);
                    return resp.json({
                        docs,user,
                        days: days
                    });
            resp.render('Etudiant/editPFE',{
                layout:false,
                Sujet: docs,user,delai,days
            });
        })
           
        }
        else {
            Annee.findOne({}, (err, doc) => {
                if (!err) {
                    delai=doc.delai;                   
                }
            
                console.log(delai);

                var date_diff_indays = function(date1, date2) {
                    dt1 = new Date(date1);
                    dt2 = new Date(date2);
                    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
                    }
                    var days=date_diff_indays(Date.now(), delai);
                    return resp.json({
                        docs,
                        days: days
                    });
            resp.render('Etudiant/pfe',{
                layout:false,Sujet: docs,user,delai,days
            });
        });
        }
    }).lean();;
    
})


router.post('/pfe', function(req, res, next) {

    console.log(req.body)
    var Pfe = new PFE();
    Pfe.pfe=req.body.pfe;
    
   
    const authcookie = req.cookies.authcookie;

    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
      if(data){
      Pfe.added_by_name=data.name;
      Pfe.added_by_id=data._id;
      Pfe.accepted_by_name="none";
        Pfe.accepted_by_id="none";
      }
    });

    console.log(Pfe);
    Pfe.save(function(err, user) {
        if (err) return res.json(err);
        res.redirect('/etudiant');
    });
}) ;


router.get('/pfe/:id',(req,res)=>{
    var tittle = 'Modifier Sujet PFE' ;
    PFE.findById(req.params.id, (err, docs) => {
        if (!err) {
           console.log(docs);
            res.render("Etudiant/editPFE", {
                layout:false,
                'Notebooktittle' : tittle,
                Sujet: docs
                
            });
            //console.log(docs[0]._id);
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
   
})

   
router.post('/pfe/:id', function(req,res,next){
    
    const _id = req.params.id;
    console.log(req.body);
    
    //console.log(Object.keys(req.body)[0]);
    PFE.findOneAndUpdate({ _id },
      req.body,
      { new: true },
      (err, contact) => {
      if (err) {
        res.status(400).json(err);
      }
      return res.json("true");
      res.redirect('/template/pfe');
    });
});



router.get('/user',(req,resp)=>{
    const authcookie = req.cookies.authcookie;
    var id,user,delai;
    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
      if(data){
        resp.json(data);
      }
    });

});







module.exports = router;
