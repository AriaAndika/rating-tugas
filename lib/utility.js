/** use for checking value with expensive computation
 * @param {any} condition 
 * @param {Function=} calltrue 
 * @param {Function=} callfalse */
export function If(condition,calltrue,callfalse) {
	if (condition) return calltrue?.(condition) ?? true;
	else return callfalse?.(condition) ?? false;
}

/** use for async callback
 * @param {any} condition 
 * @param {Function} calltrue 
 * @param {Function=} callfalse */
export async function IfAsync(condition,calltrue,callfalse) {
	if (condition) return await calltrue(condition);
	else return await callfalse?.(condition);
}


/** 
 * @param {any} target
 * @param {Function} callback */
export function re(target,callback) {
	let [len, data] = 
		Array.isArray(target) || typeof target == 'string' ? [target.length,target] : 
		typeof target == 'object' ? [Object.keys(target).length,Object.entries(target)] : [target];
	for (let i = 0; i < len; i++) callback(data?.[i] || i, i+1, target);
}

/** 
 * @param {any} target
 * @param {Function} callback */
export async function reAsync(target,callback) {
	let [len, data] = 
		Array.isArray(target) || typeof target == 'string' ? [target.length,target] : 
		typeof target == 'object' ? [Object.keys(target).length,Object.entries(target)] : [target];
	for (let i = 0; i < len; i++) await callback(data?.[i] || i, i, target, target.length || target);
}

export const delay = (ms) => new Promise(res=>setTimeout(()=>res(),ms));
export const odd = (num)=> num % 2 == 0

export const Arx = {
	
	last :
	/**
	 * @function
	 * @template A
	 * @param {A[]} ar
	 * @returns {A}
	 */
	(ar) => ar[ar.length-1]
	
}

export const idgen = () => {
	let map = 'abcdefghijklmnopqrstuvwxyz'
	
	let out = '';
	re(4,()=>{
		out += map[Math.floor(Math.random() * map.length)]
	})
	return out
}