const socket= require("socket.io")

let io;

function initialize(server) {
  io = socket(server, {
    cors: {
      origin: ["https://main.d3crfbmtohnqjn.amplifyapp.com"],
      credentials: true,
    },
  });
    
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

}


module.exports = {
    initialize,
    getIO: () => io,
  };