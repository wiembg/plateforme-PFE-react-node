
const User = require('../models/user.model') ;

const bcrypt = require('bcrypt');



express = require('express') ;



var router = express.Router () ;


router.get('/password',(req,resp)=>{
    var tittle = 'user Form' ;

    resp.render('user/password',{
        layout: false,
        'form' : tittle
    });
})

router.post('/password', function(req,res,next){
    
    const email = req.body.email;
    var newuser;
    bcrypt.genSalt(10,(err,salt)=> 
    bcrypt.hash(req.body.password,salt,
        (err,hash)=> {
            User.findOne({email : email}).exec((err,user)=>{
                newuser=user;
                
                var _id=newuser._id;
                newuser.password=hash;        
                User.findOneAndUpdate({_id  },
                    newuser,
                     { new: true },
                     (err, contact) => {
                     if (err) {
                       res.status(400).json(err);
                     }
                     res.redirect('/login');
                 });
            });
        }));
    
    
   
});


router.get('/',(req,resp)=>{
    var tittle = 'user Form' ;

    resp.render('user/signup',{
        'form' : tittle
    });
})



router.post('/register',(req,res)=>{
    const {name,email, password, password2,phone,role,nom,prename} = req.body;
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
                password : password,
                role:role,
                prename:prename
            });
            /*User.find({},(err, docs) => {
                if (docs.length!=0) {
                    newUser.role= "user";
                }else{
                    newUser.role= "admin";
                }
            }).lean()
            // execute query
            .exec(function(error, body) {});;  */     
           
    
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
                        token= jwt.sign({ email: newUser.email, name: newUser.username, _id: newUser._id, role: newUser.role, phone: newUser.phone }, 'secret_key');
         res.cookie('authcookie',token,{maxAge:900000,httpOnly:true});
         const authcookie = req.cookies.authcookie;
    console.log(authcookie);
    //verify token which is in cookie value
        /*jwt.verify(authcookie,"secret_key",(err,data)=>{
            if(err){
            //res.sendStatus(403);
            res.redirect('/notebook/list');
            } 
            res.redirect('/notebook/list');
        });*/
        res.send({token:token,userJSON:newUser});
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
    })


router.post('inscription/',(req,resp)=>{

    console.log(req.body)

    let Inscripfleids = new addusers() ;
    Inscripfleids.name = req.body.name ;
    Inscripfleids.lastname = req.body.lastname ,
    Inscripfleids.mail = req.body.mailaddress 
    Inscripfleids.creationdate = date.now() ,
    Inscripfleids.birthday = req.body.birthday ,


    Inscripfleids.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    }).then((err)=>{
        if(err)  console.log()
        else console.log('succefuly added !') 
    });
}) ;

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