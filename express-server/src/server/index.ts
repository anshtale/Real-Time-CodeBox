import express from "express";
import { createClient } from "redis";
import { WebSocketServer } from "ws";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors());

const redisClient = createClient();
const pubSubClient = createClient();

const userConnections : any = {}

redisClient.on("error", (err) => console.log("Redis Client Error", err));
pubSubClient.on("error", (err) => console.log("Redis PubSub Client Error", err));

const wss = new WebSocketServer({noServer:true});

wss.on('connection',(ws,req)=>{
    const userId : any = req.headers['sec-websocket-key']
    userConnections[userId] = ws;

    ws.on('close',()=>{
        delete userConnections[userId];
    })
})

app.post('/submit',async (req,res)=>{
    const { code,language,userId } = req.body;

    const submissionId = `submission-${Date.now()}-${userId}}`
    console.log(`Received submission from user ${userId}`);

    try{
        await redisClient.lPush("problems",JSON.stringify({code,language,userId}));

        pubSubClient.subscribe("message",(channel,message)=>{
            console.log(`Received message: ${message}`);
        })

        pubSubClient.on('message',(channel,message)=>{
            if(channel == submissionId){
                const ws = userConnections[userId];
                
                if(ws){
                    ws.send(message);
                }
            }
        })

        res.status(200).send("Submission received and stored");
    }catch(err){
        console.log(err);
        res.status(500).send("Failed to store submission");
    }
})

const server = app.listen(3000, () => {
    console.log("Express Server Listening on port 3000");
});

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
});

async function main() {
    try {
      await redisClient.connect();
      await pubSubClient.connect();
      console.log("Redis Client Connected");
    } catch (error) {
      console.log("Failed to connect to Redis", error);
    }
}

  
main();

