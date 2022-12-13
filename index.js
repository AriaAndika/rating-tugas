// @ts-check
import { init } from "./router.js";
import { ServerResponse } from "http";
import { readFile } from "fs/promises";


const app = init();

/** @type {ServerResponse[]} */
const pendings = []

//!================================================================

// listener

app.get(`/`,async (req,res)=>{
	res.setHeader('Content-Type','text/html')
	res.end(await readFile('pages/index.html','utf-8'));
})

app.get('/listen',(req,res)=>{
	pendings.push(res);
})

app.get('/send',(req,res)=>{
	
	console.log(req.query['msg']);
	pendings.forEach(e=>{
		e.end(req.query['msg'])
	})
	
	res.end(`sended ${req.query['msg']}`)
})

app.listen(4040)

//!================================FUNCTION================================


// function setcors(res) {
// 	res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
// 	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
// 	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
// 	res.setHeader('Access-Control-Allow-Headers', '*');
// }