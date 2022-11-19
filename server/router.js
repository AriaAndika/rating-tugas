import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { parseUrl, If } from "./utility.js";
import { parseHTML } from "./parser.js";

export const mediaTypes = {
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
	xml : `text/xml`,
	webp : 'image/webp',
	// vid
	mpeg : `video/mpeg`,
	mp4 : `video/mp4`
}

export function listen(port = 4040, callback){
	createServer((req,res) => {
		if (req.url.match(/\/api\//))
			api(req,res);
		else if (req.method == 'GET') 
			get(req,res)
	}).listen(port, callback?.(port))
}

/**
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
async function get(req,res) {	
	let isDone = false;
	let status = 200;
	let rewrite = ''
	
	// parsing url
	let {query,path} = parseUrl(req.url);
	
	// config`s rewrite
	process.meta.rewrite.every( ([from,to]) => {
		let b = false;
		if (from.match(/(\*\*|:)/) && path.match( RegExp( from.replace('**','.+') )))
			b = true;
		else
			b = path == from;
		rewrite = b ? to : '';
		return !b;
	})
	
	// serving public directory
	If( process.public?.find( e => e == path), e =>{
		isDone = true;
		async function _get() {
			var s = createReadStream(`${process.meta.public}${path}`);
			const ex = path.split('.');
			console.log(ex,mediaTypes[ex[ex.length-1]])
			s.on('open', function () {
				res.setHeader('Content-Type', mediaTypes[ex[ex.length-1]] );
				s.pipe(res);
			});
		}
		_get(path);
	})
	
	// done when public file founded
	if (isDone) return;
	//!================================IMPORTING================================
	// import js
	/** @type {{html?,css?}} */ 
	const js = await import(`../pages${rewrite || path}/index.js`).then( async e => {
		return await e.default({path,query})
	}).catch(()=>{});
	
	// import html and css
	/** @type {{html: string, css: string}} */
	let {html, css, head} = {
		html: await readFile(js?.html || `pages${rewrite || path}/index.html`,'utf-8').catch(()=>{status=400;return process.error(`Page not exist`)}),
		css: 	await readFile(js?.css || `pages${rewrite || path}/index.css`,'utf-8').catch(()=>''),
		head: ''
	}
	
	//!================================PARSING================================
	// html preprocess
	if (js?.data){
		html = parseHTML(html, js.data);
	}
	
	// embedded css in the html
	{
		const styleTag = html.match(/<style>[\s\S]+<\/style>/g)?.join('') || false;
		if (styleTag){
			css = css.concat( styleTag.replace(/<\/*style>/g,'') ).replace(/[\n\r\t]/g,'');
			html = html.replace(styleTag,'');
		}
	}
	// embedded head in the html
	{
		const headTags = html.match(/<head>[\s\S]+<\/head>/g)?.join('') || false;
		if (headTags){
			head = head.concat( headTags.replace(/<\/*head>/g,'') );
			html = html.replace(headTags,'');
		}
	}
	
	
	//!================================FINISHING================================
	res.setHeader('Content-Type','text/html');
	res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
	res.writeHead(status);
	res.end(
		process.template.replace(/<!--\s*@head\s*-->/,head).replace(/\/\*\s*@style\s*\*\//,css || '').replace(/<!--\s*@body\s*-->/,html)
	);
}

/**
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
async function api(req,res) {
	let stats = 200;
	let {query,path} = parseUrl(req.url);
	let post;
	
	if (req.method == 'POST'){
		post = await getPostData(req).then(e=>JSON.parse(e));
	}
	
	const data = await import(`../pages${path}.js`)
		.then(async e=>await e[req.method.toLowerCase?.()]({path,query,post})).catch( err => {console.log('server/router/118:',err);stats = 400;return {err : "error"}});
		
	if (req.method == 'POST'){
		console.log('Return post request:',post);
	}
	
	res.setHeader('Content-Type','application/json');
	res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
	res.writeHead(stats);
	res.end(JSON.stringify(data));
}


function getPostData(req) {
	return new Promise((resolve, reject) => {
		try {
			let body = ''
			req.on('data', (chunk) => {
				body += chunk.toString()
			})
			req.on('end', () => {
				resolve(body)
			})
		} catch (error) {
			reject(error);
		}
	})
}