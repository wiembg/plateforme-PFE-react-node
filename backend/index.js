/*const express = require('express');
const bodyParser = require("body-parser");
const app =express()
app.use(bodyParser.json());
const path = require('path');
const db = require("./models/BD");

var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true}));



const collection = "Note";

const noetbookController = require('./controllers/notebookController') ;
const signUpController = require('./controllers/signUpController') ;

const signInController = require('./controllers/signInController')
app.use('/notebook',noetbookController) ;

app.use('/user/form',signUpController) ;

app.use('/user/login',signInController) ;

/*app.get('/getTodos',(req,res)=>{
    // get all Todo documents within our todo collection
    // send back to user as json
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
});


db.connect((err)=>{
    // If err unable to connect to database
    // End application
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    // Successfully connected to database
    // Start up our Express Application
    // And listen for Request
    else{
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }
});

*/

require('./models/BD');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser')

const utilisationController = require('./controllers/utilisationController');
const etudiantController = require('./controllers/etudiantController');
const enseignantController = require('./controllers/enseignantController');
const notebookController = require('./controllers/notebookController');
const signUpController = require('./controllers/signUpController') ;
const signInController = require('./controllers/signInController')
const userController = require('./controllers/userController');
const cors = require('cors')
const User = require('./models/user.model') ;
const PFE = require('./models/pfe.model') ;
var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true}));
app.listen(3251, () => {
    console.log('Express server started at port : 3251');
});
app.use(cookieParser());
var authh= function checkToken (req, res, next) {
    //get authcookie from request
    const authcookie = req.cookies.authcookie;
    console.log(authcookie);
    //verify token which is in cookie value
    jwt.verify(authcookie,"secret_key",(err,data)=>{
     if(err){
        //res.redirect("/Login"); 
        
        //console.log(err);
       res.sendStatus(403);
     } 
     else if(data){
      req.user = data.user;
      console.log(data);
       
      
       next();
    }
    }
    )}

    var adminauthh= function checkTokenadmin (req, res, next) {
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
          if((data.role=="admin")||(data.role=="Enseignant")){
            next();
          }else{
              
            res.sendStatus(403);
          }
           
          
          
        }
        }
        )}

        /*app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Credentials', true);
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            next();
        });*/
        app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
//app.use(cors());
/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });*/

app.get("/getAllInstructors", (req,res) => {
  User.find({role:"enseignant"}).exec((err, EList) => {
      if (err || EList.length == 0) {
          return res.status(400).json({
              error: "no found"
          });
      }
      res.json(EList);

  }
  );
})

app.get("/getAllStudents", (req,res) => {
  User.find({role:"etudiant"}).exec((err, EList) => {
      if (err || EList.length == 0) {
          return res.status(400).json({
              error: "no found"
          });
      }
      res.json(EList);

  }
  );
});

app.post("/ajouterPFE", (req,res) => {
  const {pfe,entreprise,encadrantchoisi,added_by_id,added_by_name} = req.body;
  const P = new PFE({
    pfe,
    entreprise,
    encadrantchoisi,
    added_by_id,
    added_by_name,
    accepted_by_id:"",
    refused:false
  });
  P.save().then((value) => {
    res.send(P);
  });
});

app.post("/getPFE", (req,res) => {
  const {uid} = req.body;
  PFE.findOne({added_by_id:uid}, function(err,doc) {
    if (err) { throw err; }
    else {
      res.send(doc);
    }
    }
  );
});

app.post("/getMesEncadrements", (req,res) => {
  const {encadrant,accepted_by_id} = req.body;
  PFE.find({encadrantchoisi:encadrant,accepted_by_id:accepted_by_id}, function(err,doc) {
    if (err) { throw err; }
    else {
      res.send(doc);
    }
    }
  );
});

app.get("/getPFES", (req,res) => {
  PFE.find({}, function(err,doc) {
    if (err) { throw err; }
    else {
      res.send(doc);
    }
    }
  );
});

app.post("/getMesDemandesEncadrements", (req,res) => {
  const {encadrant} = req.body;
  console.log(encadrant);
  PFE.find({encadrantchoisi:encadrant, accepted_by_id:"",refused:false}, function(err,doc) {
    if (err) { throw err; }
    else {
      res.send(doc);
    }
    }
  );
});

app.post("/accepterDemandePFE", (req,res) => {
  const {_id, encID} = req.body;
  PFE.findOneAndUpdate({_id:_id}, {accepted_by_id:encID},function(err,doc) {
    if (err) { throw err; }
    else {
      res.send(doc);
    }
    }
  );
});

app.post("/refuserDemandePFE", (req,res) => {
  const {_id, encID} = req.body;
  PFE.findByIdAndRemove(_id,function(err,doc) {
    if (err) { throw err; }
    else {
      res.send(doc);
    }
    }
  );
});

app.use('/user',signUpController) ;

app.use('/user/login',signInController) ;
app.use(authh); 
app.use('/template',utilisationController) ;

app.use('/notebook',notebookController) ;
app.use('/enseignant',enseignantController) ;

app.use(adminauthh);

app.use('/etudiant',etudiantController) ;
app.use('/admin',userController) ;





