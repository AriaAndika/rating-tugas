import { If } from "./utility.js";

//!=====================================================================

/** @param {string} s */
export const use = s => document.querySelector(s);
use.all = s => document.querySelectorAll(s);

/** @param {string} el */
use.new = el => {
	const attr = el.match(/\[.*?\]/g)?.map(e=>e.slice(1,-1).split('='));
	const inner = el.match(/\{.*\}/g)?.map(e=>e.slice(1,-1));
	el = el.replace(/\[.*\]/g,'');
	el = el.replace(/\{.*\}/g,'');
	const tag = If(el.match(/[^#\.\[\]]+/), tag => tag.index == 0 ? tag : 'div' )
	const id = el.match(/#[^#\.\[\]]+/)?.[0].substring(1);
	const className = el.match(/\.[^#\.\[\]]+/g)?.map( cls => {
		return cls.substring(1)
	});
	
	const elem = document.createElement(`${tag}`);
	If(id,e=>elem.id = e);
	If(className,e=>e.forEach( cls => elem.classList += cls + ' ' ));
	If(attr,e=>e.forEach(([k,v])=>elem.setAttribute(k,v)))
	If(inner,e=>elem.innerText = e)
	return elem;
};



use.style = (sel,content) => {
	let styleElem = If(use('#use-own'),
		elem =>{
			console.log(elem);
			return elem;
		},
		()=> use.new('style#use-own')
	);
	styleElem.innerHTML += `${sel}{${content}}`;
}



/** @param {string|HTMLElement} target */
use.hook = (target,cb) => {
	const t = typeof target == 'string' ? use(target) : target;
	t.addEventListener('input',e=>cb(e.currentTarget.value))
}



/** @param {string|HTMLElement} target */
use.formHook = (target,cb) => {
	const t = typeof target == 'string' ? use(target) : target;
	t.addEventListener('input',e=>{
		const elems = t.querySelectorAll('[name]');
		
		cb(Object.fromEntries([...[...elems].map(e=>[e.getAttribute('name'),e.value])]))
	})
}