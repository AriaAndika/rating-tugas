// @ts-check
import { init,serve,user } from "./router.js";
import { setTimeout } from "timers/promises";
import { readFile } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";



const app = init();
const db = {};
const cache = {}

Object.entries(JSON.parse(await readFile('db.json','utf-8'))).forEach(([id,data])=>{
	db[id] = new user(id,data);
})

cache.home = await readFile('pages/index.html','utf-8');


await serve('public')

//!================================================================

app.get('/',(/** @type {any} */ req,/** @type {ServerResponse<IncomingMessage>} */ res)=>{
	res.setHeader('Content-Type','text/html')
	res.end(cache.home);
})

// initialize
/** 
 * @param { string } user
 * @link http://localhost:4040/pull?id=user
*/
app.get('/pull',(/** @type {import("./router.js").Url} */ url,/** @type {ServerResponse} */ res)=>{
	setcors(res);
	initUser(url.query.id);
	res.end( JSON.stringify(db[url.query.id]) );
})


// listener
/** 
 * @param { string } id 
 * @param { number } init
 * @link http://localhost:4040/listen?id=user&init=0
*/
app.get('/listen',async (url,res)=>{
	const id = url.query.id;
	initUser(id);
	setcors(res);
	
	const current = db[id].action;
	
	while (current == db[id].action) await setTimeout(100);
	res.end(JSON.stringify(db[id]));
})


// controller
/** 
 * @param { 'next' | 'prev' | 'power' } m
 * @link http://localhost:4040/set?m=next&id=user
*/
app.get('/set',(url,res)=>{
	setcors(res);
	initUser(url.query.id);
	
	db[url.query.id][url.query.m]();
	res.end(JSON.stringify(db[url.query.id]));
})


// records
app.get('/all',(_,res)=>{
	setcors(res);
	res.end(JSON.stringify(db));
})


console.log(app.getlist);
app.listen();

//!================================FUNCTION================================

const initUser = id => {
	if (!db[id])
		db[id] = new user(id);
	
}



function setcors(res) {
	res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
	res.setHeader('Access-Control-Allow-Headers', '*');
	
}