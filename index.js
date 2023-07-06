const express= require("express")
const cors= require("cors")
const bodyParser=require("body-parser")
const dotenv= require("dotenv").config()
const connectToDatabase = require("./database/connection")
const userRoutes=require('./routes/userRoutes')
const organizerRoutes=require("./routes/organizerRoutes")
const socket= require("socket.io")
const { on } = require("./model/userModel")




const app= express()

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST","PATCH"],
    credentials:true,

}))

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/public', express.static('public'));


app.use('/',userRoutes)
app.use('/organizer',organizerRoutes)


connectToDatabase()

const PORT= process.env.PORT||4000

const server=app.listen(PORT,()=>{
    console.log(`server is runnig at PORT ${PORT}`);
});


const io= socket(server,{
    cors: {
        origin:["http://localhost:5173"],
        credentials: true,
      },
})

global.onlineUsers =new Map()
io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
        console.log(onlineUsers,"online users");
    });

    socket.on("send-msg",(data)=>{
        console.log(data,"send-message data");
        const sendUserSocket=onlineUsers.get(data.to);
        console.log(sendUserSocket,"user socket");
        if(sendUserSocket){
           console.log("user socket true");
            socket.to(sendUserSocket).emit("msg-receive",data.msg)
        }
    })
})