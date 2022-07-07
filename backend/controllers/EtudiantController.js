
const User = require('../models/user.model') ;
jwt = require('jsonwebtoken'),
express = require('express') ;
const bcrypt = require('bcrypt');
const PFE = require('../models/pfe.model') ;

var token;

var router = express.Router () ;

router.get('/',(req,resp)=>{
   
    var tittle = 'Note Form' ;
    resp.render('etudiant/AjouterEtudiant',{
        'Notebooktittle' : tittle
    });
})

router.post('/',(req,res)=>{
    const {name,email, password, password2,phone} = req.body;
    let errors = [];
    console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    if(password !== password2) {
        console.log("1");
        res.send(500,'Password differents!') ; 
        return next();
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        res.send(500,'Password < 6!') ; 
        return next();
    }
    if(errors.length > 0 ) {
        console.log("erreurs");
     } else {
        //validation passed
       User.findOne({email : email}).exec((err,user)=>{
        //console.log(user);   
        if(user) {
            console.log( 'email already registered');
            res.send(500,'Email existe deja!') ; 
           } else {
            const newUser = new User({
                username : name,
                email : email,
                phone : phone,
                password : password
                
            });
            User.find({},(err, docs) => {
                if (docs.length!=0) {
                    newUser.role= "Etudiant";
                }
            }).lean()
            // execute query
            .exec(function(error, body) {});;        
           
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        
            res.redirect('/admin/etudiant');
    
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
    })


    
router.get('/edit/:id',(req,res)=>{
    User.findById(req.params.id, (err, docs) => {
        if (!err) {
            console.log(docs);
            return res.json(docs);
            res.render("etudiant/etudiantEdit", {
                etudiant: docs
                
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

    User.findOneAndUpdate({ _id },
      req.body,
      { new: true },
      (err, contact) => {
      if (err) {
        res.status(400).json(err);
      }
      res.redirect('/etudiant');
    });
});




router.get('/list',(req,res)=>{
    User.find({role:"Etudiant"},(err, docs) => {
        if (!err) {
            return res.json(docs);
            res.render("Etudiant/listeEtudiant", {
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







module.exports = router;
