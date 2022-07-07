
const { query } = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const Note = require('../models/notebook.model') ;
express = require('express') ;
const User = require('../models/user.model') ;


var router = express.Router () ;

router.get('/',(req,resp)=>{
   
    var tittle = 'Note Form' ;
    resp.render('noteviews/notebookview',{
        'Notebooktittle' : tittle
    });
})

   
router.post('/', function(req, res, next) {

    console.log(req.body)
    var notee = new Note();
    notee.name=req.body.name;
    notee.date=req.body.date;
    notee.text=req.body.textnote;
   
    const authcookie = req.cookies.authcookie;

    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
      if(data){
      req.user = data.user;
      console.log(data);
      notee.owner=data;
      notee.added_by=data.name;
      }
    });


    console.log(notee);
    notee.save(function(err, user) {
        if (err) return res.json(err);
        res.redirect('/notebook/list');
    });
}) ;

router.get('/list', (req, res) => {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie,"secret_key",(err,data)=>{
        if(data){
        req.user = data.user;
        console.log(data);
        var rol;
        if(data.role=="user"){  
        var query = { owner: data };}else{
            if(data.role=="admin"){  
        var query={};
        rol="admin";}
        }
       
    Note.find(query,(err, docs) => {
        if (!err) {
           
            res.render("noteviews/notebookliste", {
                list: docs,
                user:data,
                role:rol
                
            });
            //console.log(docs[0]._id);
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean()
    // execute query
    .exec(function(error, body) {});
    
}
});
});

    /*
    //text : req.body.text.toString() ,
    bdmodeleob.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    });
*/

router.get('/delete/:id', (req, res) => {
    Note.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/notebook/list');
        }
        else { console.log('Erreur lors du suppression du Note :' + err); }
    });
});

router.get('/edit/:id',(req,res)=>{
    var tittle = 'Modifier Note' ;
    Note.findById(req.params.id, (err, docs) => {
        if (!err) {
           
            res.render("noteviews/notebookedit", {
                'Notebooktittle' : tittle,
                note: docs
                
            });
            //console.log(docs[0]._id);
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
   
})

   
router.post('/edit/:id', function(req,res,next){
    
    const _id = req.params.id;

    Note.findOneAndUpdate({ _id },
      req.body,
      { new: true },
      (err, contact) => {
      if (err) {
        res.status(400).json(err);
      }
      res.redirect('/notebook/list');
    });
});


function checkToken (req, res, next) {
    //get authcookie from request
    const authcookie = req.cookies.authcookie;
    console.log(authcookie);
    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
     if(err){
       res.sendStatus(403);
     } 
     else if(data){
      req.user = data.user;
      console.log(data);
       
      
       next();
    }
    }
    )}


   /* router.get('/admin',(req,res)=>{
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

    router.get('/admin/:id', (req, res) => {
        User.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) {
                res.redirect('/notebook/admin');
            }
            else { console.log('Erreur lors du suppression du Note :' + err); }
        });
    });*/
module.exports = router ;