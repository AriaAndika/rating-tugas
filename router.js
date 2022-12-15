import { createServer, ServerResponse } from "http";
import { getData } from "./ip.js";

export const init = () => new App();

class App{
	constructor(){
		this.getlist = [];
		this.postlist = [];
	}
	
	/** @param {string} url @param {(url: Url,res: ServerResponse)=>void} callback */
	get(url,callback){
		this.getlist.push([url,callback])
	}
	
	post(url,callback){
		// await getPostData()
		this.postlist.push([url,callback])
	}
	
	listen(port,cb){
		this.server = createServer((req,res)=>{
			const url = new Url(req.url || "");
			console.log(req.method,req.url)
			if (req.method == 'POST'){
				this.postlist.some(([path,callback])=>{
					if (url.path == path){
						try {
							getData(req,body=>callback(Object.assign(url,{body}),res));
						} catch (err) {
							console.log(err)
							res.end("500 Server Error")
						}
						return true;
					}
				})
			}else if (req.method == 'GET'){
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
			}else{
				setcors(res);
				res.end('')
			}
			
		}).listen(port || 4040,()=>console.log(`listening in 4040...`));
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

function setcors(res) {
	res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
	res.setHeader('Access-Control-Allow-Headers', '*');
}