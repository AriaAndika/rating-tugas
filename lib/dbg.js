import { use } from "./usedom.js";
import { delay } from "./utility.js";

const dbgList = [];
export const getDebugger = () => new PopDebugger()
export const getStaticDebugger = () => new StaticDebugger()


class PopDebugger{
	/** @type {HTMLDivElement} */
	elem;
	hide;
	constructor () {
		dbgList
		// style
		document.head.append(use.new(`style#popdebugger{
			.popdebugger{
				font-family: consolas;
				position: fixed;
				bottom: 1rem;
				left: 100vw;
				background: #222;
				color: white;
				transition: right .7s;
				padding: 1rem;
			}
		}`.replace(/[\t\n\r]/g,'')))
		this.elem = use.new(`div.popdebugger`);
		this.elem.style.right = `-30rem`;
		document.body.append(this.elem);
	}
	async log(msg){
		this.elem.style.right = `1rem`;
		this.elem.innerText = msg;
		await delay(3000);
		this.elem.style.right = `-14rem`;
	}
}

class StaticDebugger{
	/** @type {HTMLDivElement} */
	elem;
	constructor () {
		
		// style
		document.head.append(use.new(`style#staticdebugger{
			.staticdebugger{
				font-family: consolas;
				position: fixed;
				min-width: 12rem;
				min-height: 2rem;
				bottom: 1rem;
				right: 1rem;
				background: #222;
				color: white;
				padding: 1rem;
			}
		}`.replace(/[\t\n\r]/g,'')))
		this.elem = use.new(`div.staticdebugger`);
		document.body.append(this.elem)
	}
	async log(msg){
		this.elem.innerText = msg;
	}
}