const express= require("express")
const cors= require("cors")
const bodyParser=require("body-parser")
const dotenv= require("dotenv").config()
const connectToDatabase = require("./database/connection")
const userRoutes=require('./routes/userRoutes')
const organizerRoutes=require("./routes/organizerRoutes")
const adminRoutes= require("./routes/adminRoutes")
const socketConnection= require("./utils/socketio")
const socketUtils = require("./utils/socketio")



const app= express()

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST","PATCH","DELETE"],
    credentials:true,

}))

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/public', express.static('public'));


app.use('/',userRoutes)
app.use('/organizer',organizerRoutes)
app.use('/admin',adminRoutes)

connectToDatabase()

const PORT= process.env.PORT||4000

const server=app.listen(PORT,()=>{
    console.log(`server is runnig at PORT ${PORT}`);
});

socketUtils.initialize(server)

const io= socketUtils.getIO()