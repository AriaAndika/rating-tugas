// @ts-check
import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import { createServer } from "http";

export const init = () => new App();


class App{
	constructor(){
		this.getlist = [];
	}
	
	get(url,callback){
		this.getlist.push([url,callback])
	}
	
	listen(port){
		this.server = createServer((req,res)=>{
			const url = new Url(req.url || "");
			console.log(url.path,req.url);
			if (servePublic(url.path.substring(1),res)) {
				return;
			}
			this.getlist.some(([path,callback])=>{
				if (url.path == path){
					try {
						callback(url,res);
					} catch (err) {
						console.log(err)
						res.end("500 Server Error")
					}
					return true;
				}
			})
		}).listen(port || 4040)
	}	
}

export class Url{
	/** @param {string} str*/
	constructor(str){
		this.path = str.split('?')[0];
		// @ts-ignore
		const queries = str.match(/(?<=\?).+/)?.[0].split('&').map(e=>e.split('='));
		if (queries){
			this.query = Object.fromEntries(queries)
		}
	}
}

export class user{
	id = '';
	channel = -1;
	lastCh = 0;
	action = 0;
	history = [];
	constructor(id,assign) {
		this.id = id;
		if (assign){
			this.channel = assign.channel
			this.lastCh = assign.lastCh
			this.action = assign.action
			this.history = assign.history
		}
	}
	next(){
		if (this.channel == -1) return this;
		this.lastCh = this.channel;
		this.channel = (this.channel + 1) % 4;
		this.history = [...this.history,[this.channel,new Date().toString()]];
		this.action++;
		console.log(this.id,'next')
		return this;
	}
	power(){
		if (this.channel == -1){
			this.channel = this.lastCh;
			this.history = [...this.history,[this.channel,new Date().toString()]];
		}else{
			this.lastCh = this.channel;
			this.channel = -1;
			this.history = [...this.history,[this.channel,new Date().toString()]];
		}
		this.action++;
		return this;
	}
	prev(){
		if (this.channel == -1) return this;
		this.lastCh = this.channel
		this.channel = --this.channel < 0 ? 3 : this.channel;
		this.history = [...this.history,[this.channel,new Date().toString()]];
		this.action++;
		return this;
	}
}

export async function serve(publicpath) {
	global.public = await readdir(publicpath);
}

const mediaTypes = {
	// app
	js : `application/javascript`,
	json : `application/json`,
	urlencoded : `application/x-www-form-urlencoded`,
	// img
	gif : `	image/gif`,
	jpg :  `image/jpeg`,
	png : `image/png`,
	ico : 'image/vnd',
	// txt
	css : `text/css`,
	csv : `text/csv`,
	html : `text/html`,
	plain : `text/plain`,
	txt : `text/plain`,
	xml : `text/xml`,
	// vid
	mpeg : `video/mpeg`,
	mp4 : `video/mp4`
}

function last(arr) {
	return arr[arr.length-1];
}

function servePublic(filename,res) {
	const data = global.public.find( e => e == filename);
	if (!data) {
		console.log('no public found',filename);
		return false;
	}
	console.log('public',filename);
	
	const s = createReadStream(`public/${filename}`);
	s.on('open', function () {
		let format = last(filename.split('.'));
		console.log('format:',format)
		res.setHeader('Content-Type', mediaTypes[ format ] ?? 'text/plain' );
		s.pipe(res);
	});
	return true;
}
