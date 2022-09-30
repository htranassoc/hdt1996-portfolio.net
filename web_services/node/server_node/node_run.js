let p2p_base = require('./conf/p2p_base.js').node
let p2p_nodes = require('./conf/conf.js').p2p_nodes

for(let pn = 0; pn < p2p_nodes.length; pn++)
{
	let sio_port= p2p_nodes[pn][0]
	let pjs_port= p2p_nodes[pn][1]
	let ws_port= p2p_nodes[pn][2]
	console.log("")
	p2p_base(sio_port,pjs_port,ws_port)
}





