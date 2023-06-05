const express= require("express")
const cors= require("cors")
const bodyParser=require("body-parser")
const dotenv= require("dotenv").config()
const connectToDatabase = require("./database/connection")
const userRoutes=require('./routes/userRoutes')
const organizerRoutes=require("./routes/organizerRoutes")




const app= express()

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST"],
    credentials:true,

}))

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use('/',userRoutes)
app.use('/organizer',organizerRoutes)


connectToDatabase()

const PORT= process.env.PORT||4000

app.listen(PORT,()=>{
    console.log(`server is runnig at PORT ${PORT}`);
});
