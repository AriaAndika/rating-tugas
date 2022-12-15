
const bulanMap = {
	Dec : 'Desember'
}


const date = `${new Date()}`.split(' ');

const parsed = {
	waktu : date[4],
	tanggal : date[2],
	bulan : bulanMap[date[1]],
	tahun : date[3]
}

const db = [{price : 20000},{price : 40000}]

const r = db.reduce((p,c,i)=>{
	
	return {
		price : p.price + c.price
	}
}).price

console.log(r)