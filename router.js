// @ts-check
import { createServer } from "http";
import { writeFile } from "fs/promises";


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
			console.log(url.path,req.url)
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

export const write = async (db) => {
	writeFile('server/db.json',JSON.stringify(db));
}