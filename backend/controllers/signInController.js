
const User = require('../models/user.model') ;
jwt = require('jsonwebtoken'),
express = require('express') ;
const bcrypt = require('bcrypt');
var token;

var router = express.Router () ;

router.get('/',(req,resp)=>{
    var tittle = 'login Form' ;

    resp.render('user/login',{
        layout: false,
        'form' : tittle
    });
})
router.post('/auth',(req,res)=>{
   console.log(req.body.email);
    User.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) throw err;
        console.log(user);
        if (!user || !(bcrypt.compareSync(req.body.password, user.password))) {
            
      //console.log(user.comparePassword(req.body.password));
      
          return res.status(401).json({ message: 'Authentification échouée. Utilisateur ou mot de passe invalide.' });
        }
        
         token= jwt.sign({ email: user.email, name: user.username, _id: user._id, role: user.role, phone : user.phone }, 'secret_key');
         res.cookie('authcookie',token,{maxAge:900000,httpOnly:true});
         const authcookie = req.cookies.authcookie;
    console.log(authcookie);
    //verify token which is in cookie value
        jwt.verify(authcookie,"secret_key",(err,data)=>{
            if(err){
            //res.sendStatus(403);
                if(user.role=="banned"){
                    res.cookie('authcookie',token,{maxAge:1000,httpOnly:true});
                    res.redirect('/banned');
                }else{
                    /*if(user.role=="Etudiant"){
                        res.send({token:token,userJSON:user});
                    }else{
                        if(user.role=="Enseignant"){
                            res.send('/enseignant');
                        }
                        else{
                            res.send('/admin/etudiant');
                        }
                    }*/
                    res.send({token:token,userJSON:user});
                } 
            }
        });
      });
      //res.redirect('/notebook/list');
});

router.post('/logout',(req,res)=>{
    res.cookie('authcookie',token,{maxAge:3000,httpOnly:true});
    return res.json("done");
    res.redirect('/user/login');

}) 


/*
   
router.post('inscription/',(req,resp)=>{

    console.log(req.body)
    let bdmodeleob = new notebookfleids() ;
    bdmodeleob.name = req.body.name ;
    bdmodeleob.date = req.body.date ,
    bdmodeleob.text = req.body.textnote 

    bdmodeleob.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    }).then((err)=>{
        if(err)  console.log()
        else console.log('succefuly added !') 
    });
}) ;


    /*
    //text : req.body.text.toString() ,
    bdmodeleob.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    });
*/


module.exports = router ;