const express = require('express');
const urlRoute = require('./routes/url');
const  staticRoute = require('./routes/staticRouter');
const  userRoute = require('./routes/user');
const {connectMongoDB} = require('./connect');
const path = require('path');
const cookieParser = require('cookie-parser');
const {restrictToLoggedInUserOnly,checkAuth} = require("./middlewares/auth")
const URL = require('./models/urls');
const shortid = require('shortid');
const app = express();
const PORT = 8001;

//middleware - plugin
app.use(express.json())
app.use(express.urlencoded({ extended : false}));
app.use(cookieParser());
// connection to MongoDB
connectMongoDB('mongodb://localhost:27017/short-url').then( () => console.log("Yeah...MongoDB Connected.."));

app.set('view engine','ejs')
app.set("views",path.resolve('./views'))
//routes
app.use('/', checkAuth, staticRoute)
app.use('/user', userRoute)
app.use('/url',restrictToLoggedInUserOnly, urlRoute);


app.get('/url/:shortId',async(req,res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push: {
            visitHistory: {
                timestamp : Date.now()
            },
        }
    });
    console.log(`Redirecting to: ${entry.redirectUrl}`);
    res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log('Server Started...'));
