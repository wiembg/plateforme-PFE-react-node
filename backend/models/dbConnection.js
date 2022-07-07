const mongoose = require('mongoose') ;
const uri = "mongodb+srv://admin:nj0ilSHnymDIGqpE@cluster0.2jq8m.mongodb.net/Plateforme?retryWrites=true&w=majority";


mongoose.connect(uri,{ useUnifiedTopology: true , useNewUrlParser: true } )
    .then( ()=>
        {
            console.log('bd connecte') ;
        }
    ).catch(()=>
        {
            console.log('probleme connection base donne !')
        }
    )
    
