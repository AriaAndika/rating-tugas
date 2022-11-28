
const host = ''
const username = 'user';
let clChannel = 0
let last = 0
let history = []

const pl = document.querySelectorAll('video');
const pw = document.querySelector('.blck');
document.querySelector('#pow').addEventListener('click',()=>pow())
document.querySelector('#next').addEventListener('click',()=>next(1))
document.querySelector('#prev').addEventListener('click',()=>next(-1))

const vidLinks = [
	`../rck.mp4`,
	`../atn.mp4`,
	`../syg.mp4`,
	`../blv.mp4`
]

pl.forEach((e,i)=>e.src = vidLinks[i])
pl[1].currentTime = 15;
pl[2].currentTime = 45;
pl[3].currentTime = 14;

async function connect() {
	
	try {
		const x = new XMLHttpRequest();
		x.open('GET',`/pull?id=${username}`,true);
		x.overrideMimeType("application/json")
		x.onload = e =>{
			const data = JSON.parse(x.responseText);
			console.log(data);
			set(data);
		}
		x.send('');
		
		// await fetch(`https://rating.cyclic.app/pull?id=${username}`).then(async e=>{
		// 	const data = await e.json();
		// 	console.log(data);
		// 	set(data);
		// })
		
		
	} catch (error) {
		console.log(clChannel,error)
		
	}
}

document.body.addEventListener('keydown',e=>{
	pl.forEach(e=>{
		e.muted = !e.muted
	})
})
function next(n) {
	if (pl[clChannel].paused) return;
	pl[clChannel].pause();
	pl[clChannel].style.display = 'none';
	clChannel = (clChannel + n) % 4;
	if (clChannel < 0) clChannel = 4 + clChannel;
	pl[clChannel].style.display = 'block';
	pl[clChannel].play();
}

function set({id, channel, lastCh, action, history }) {
	if (clChannel != -1){
		pl[clChannel].pause();
		pl[clChannel].style.display = 'none';
		pw.style.display = 'block';
	}
	
	last = parseInt(lastCh);
	history = history;
	clChannel = parseInt(channel);
	
	if (clChannel == -1){
		pw.style.display = 'block';
	}else{
		pw.style.display = 'none';
		pl[clChannel].style.display = 'block';
		pl[clChannel].play();
	}
	// pl.forEach(e=>e.muted = false)
	
	listen();
}

function pow() {	
	if (pl[clChannel].paused){
		pw.style.display = 'none';
		pl[clChannel].style.display = 'block';
		pl[clChannel].play();
	}else{
		pl[clChannel].pause();
		pl[clChannel].style.display = 'none';
		pw.style.display = 'block';
	}
}
async function listen() {
	const x = new XMLHttpRequest();
	x.open('GET',`/listen?id=${username}&init=${clChannel}`,true);
	x.overrideMimeType("application/json")
	x.onload = () =>{
		const data = JSON.parse(x.responseText);
		console.log(`listener answer: ${data}`);
		set(data);
	}
	x.send('');
	
	// await fetch(`https://rating.cyclic.app/listen?id=${username}&init=${clChannel}`).then(async e=>{
	// 	const data = await e.json();
	// 	console.log("listener answer:",data)
	// 	set(data)
	// })
}
function ok() {
	alert('connected')
	connect();
}
document.querySelector('#con').addEventListener('click',ok);