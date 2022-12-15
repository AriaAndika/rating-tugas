import { networkInterfaces } from "os";


export const getIp = () => {
	console.log(networkInterfaces()['Wi-Fi'])
	return networkInterfaces()['Wi-Fi'][1].cidr.replace(/\/.+/,'')
}


export const getData = (req,cb) => {
	req.on('data',(x)=>{
		cb(JSON.parse(x))
	})
}