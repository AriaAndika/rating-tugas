import { createServer } from 'http';
import {  server } from "websocket";
import { idgen } from './lib/utility.js';


const http = createServer((req,res)=>{
	
	
	res.end("ok");
})

const ws = new server({
	"httpServer" : http
})


/** @type {{ob: connection}} */
const clients = {}


ws.on('request', req => {
	const client = req.accept(null,req.origin);
	const id = idgen();
	clients[id] = client;
	console.log("CLIENT CONNECTED",Object.keys(clients))
	client.on('message',msg=>{
		Object.values(clients).forEach(c=>{
			c.send(msg.utf8Data)
		})
	})
	client.on('close',()=>{delete clients[id];console.log("CLIENT DISCONNECTED",Object.keys(clients))})
})


http.listen(4040,()=>console.log("Listening in 4040..."));