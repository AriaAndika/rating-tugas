// @ts-checks
import { init } from "./router.js";
import { ServerResponse } from "http";
import { readFile, writeFile } from "fs/promises";


const app = init();
const db = await readFile('./db.json').then(e=>JSON.parse(e));

/** @type {ServerResponse[]} */
const pendings = []

let lastMode = '';
let state = 0;

//!================================================================

// listener

app.get(`/`,async (req,res)=>{
	setcors(res)
	
	res.setHeader('Content-Type','text/html')
	res.end(await readFile('pages/index.html','utf-8'));
})

app.get('/init',(req,res)=>{
	setcors(res);
	res.end(`${state}`);
})

app.post('/write',(req,res)=>{
	setcors(res);
	write(req.body);
	res.end('Success');
})

app.get('/listen',(req,res)=>{
	setcors(res)
	// pendings.push(res);
	res.end(`${process.env['state']}|${process.env['lastState']}`)
})

app.get('/send',(req,res)=>{
	console.log('ESP32:',req.query['msg']);
	// pendings.forEach(e=>{
	// 	e.end(req.query['msg'])
	// })
	process.env['state'] = `${parseInt(process.env['state']) + 1}`;
	process.env['lastState'] = req.query['msg'];
	// lastMode = req.query['msg'];
	setcors(res)
	res.end(`sended ${req.query['msg']}`)
})

app.get('/all',(req,res)=>{
	setcors(res);
	res.end(JSON.stringify(db));
})

app.listen(4040,console.log);

//!================================FUNCTION================================


function setcors(res) {
	res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
	res.setHeader('Access-Control-Allow-Headers', '*');
}

function write(data) {
	const bulanMap = {
		Dec : 'Desember'
	}
	data.forEach(e=>{
		delete e.img
		delete e.desc
		delete e.sold
	})
	const date = `${new Date()}`.split(' ');
	const parsed = {
		waktu : date[4],
		tanggal : date[2],
		bulan : bulanMap[date[1]],
		tahun : date[3],
		total : data.reduce((p,c,i)=>{
			return {
				price : p.price + c.price
			}
		}).price,
		data
	}
	db.push(parsed);
	writeFile('db.json',JSON.stringify(db));
}