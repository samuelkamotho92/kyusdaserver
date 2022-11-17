const mongoose = require('mongoose');
const app = require('./app.js');
//setting up our cors
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running on PORT:${process.env.PORT}`)
    })
})