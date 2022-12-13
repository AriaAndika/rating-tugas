// @ts-check
// import { readFile } from "fs/promises";
// import { createServer } from "https";
import { createServer, ServerResponse } from "http";

export const init = () => new App();

class App{
	constructor(){
		this.getlist = [];
	}
	
	/** @param {string} url @param {(url: Url,res: ServerResponse)=>void} callback */
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
