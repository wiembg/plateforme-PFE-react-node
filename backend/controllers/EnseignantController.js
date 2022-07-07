
const User = require('../models/user.model') ;
jwt = require('jsonwebtoken'),
express = require('express') ;
const bcrypt = require('bcrypt');
const PFE = require('../models/pfe.model') ;

var token;

var router = express.Router () ;

router.get('/',(req,resp)=>{
   
    var tittle = 'Note Form' ;
    resp.render('enseignant/AjouterEnseignant',{
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
                    newUser.role= "Enseignant";
                }else{
                    newUser.role= "Enseignant";
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
           
            res.render("enseignant/enseignantEdit", {
                
                enseignant: docs
                
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
      res.redirect('/enseignant/membre');
    });
});


router.get('/list', (req, res) => {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie,"secret_key",(err,data)=>{
        if(data){
        if(data.role=="user"){  
            res.sendStatus(403);
        }
        else{
            if((data.role=="admin")||(data.role=="Enseignant")){  
        var query={};
        PFE.find({accepted_by_name:"none"},(err, docs) => {
            if (!err) {     
                return res.json(docs);          
                res.render("Enseignant/listPFE", {
                    list: docs,
                });
            }
            else {
                console.log('Error in retrieving PFE list :' + err);
            }
        }).lean()
        // execute query
        .exec(function(error, body) {});
        
    }
    
    }
        }  
});
});


router.get('/accept/:id', function(req,res,next){
    
   
    PFE.findOne({_id:req.params.id}).exec((err,pfe)=>{
    newpfe=pfe;
    const authcookie = req.cookies.authcookie;
    console.log(authcookie);
    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
     if(err){
       res.sendStatus(403);
     } 
     else if(data){
                newpfe.accepted_by_name=data.name;
                newpfe.accepted_by_id=data._id;
                newpfe.accepted_by_date=new Date(Date.now()).toLocaleString().split(',')[0]
                
                PFE.findOneAndUpdate({_id:newpfe._id  },
                    newpfe,
                     { new: true },
                     (err, contact) => {
                     if (err) {
                       res.status(400).json(err);
                     }
                     res.redirect('/enseignant/list');
                 });
                }
            });
            });
    
});


router.get('/membre',(req,res)=>{
    User.find({role:"Enseignant"},(err, docs) => {
        if (!err) {
            return res.json(docs);

            res.render("Enseignant/listeEnseignant", {
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


router.get('/pfe', (req, res) => {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie,"secret_key",(err,data)=>{
        if(data){
        if(data.role=="user"){  
            res.sendStatus(403);
        }
        else{
            if((data.role=="admin")||(data.role=="Enseignant")){  
        var query={};
        PFE.find({},(err, docs) => {
            if (!err) {   
                return res. json(docs);            
                res.render("Enseignant/allPFE", {
                    list: docs,
                });
            }
            else {
                console.log('Error in retrieving PFE list :' + err);
            }
        }).lean()
        // execute query
        .exec(function(error, body) {});
        
    }
    
    }
        }  
});
});


router.get('/accepted/:id', (req, res) => {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie,"secret_key",(err,data)=>{
        if(data){
        
        if((data.role=="admin")||(data.role=="Enseignant")){  
        var query={};
        PFE.find({accepted_by_id:req.params.id},(err, docs) => {
            if (!err) {     
                return res.json(docs);          
                res.render("Enseignant/listPFE", {
                    list: docs,
                });
            }
            else {
                console.log('Error in retrieving PFE list :' + err);
            }
        }).lean()
        // execute query
        .exec(function(error, body) {});
        
    }
    
    
        }  
});
});



module.exports = router;
