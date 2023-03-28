require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io")
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});
const {connection} = require("./config/db.config");
const {userRouter} = require("./controllers/userauth"); 
const cors = require("cors");
app.use(express.json());
app.use("/auth",userRouter);
app.use(cors({
    origin:"*"
}))
app.get("/",(req,res)=>{
    res.json({message:"server is working"});
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');
socket.on("chat message",(msg)=>{
console.log(msg)
io.emit('message',msg);
})
    
socket.on('disconnect', () => {
console.log('user disconnected');
});
    

  });
  


app.listen(process.env.PORT||8000,async ()=>{
    try {
        await connection
        console.log(`connected to the database succesfully`);
        console.log(`listening on port ${process.env.PORT}`);
    } catch (error) {
        console.log(`error connecting to the database :error is ${error}`)
    }
})
