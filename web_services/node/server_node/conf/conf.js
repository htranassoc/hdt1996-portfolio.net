let destination = "/home/htran/Desktop/hdt1996-portfolio.net"
let host = require(`${destination}/conf/server_config.json`).host
let domain = require(`${destination}/conf/server_config.json`).domain
let debug = false
let base_dir = `${destination}/proxy/certs/`


let p2p_nodes =
[
	[8010, 8020, 8030],
	[8011, 8021, 8031],
	[8012, 8022, 8032],
	[8013, 8023, 8033]
]

let stream_nodes =
[
	
]

module.exports=
{
    debug:debug,
    p2p_nodes: p2p_nodes,
    host:host,
    domain:domain,
    base_dir,base_dir
}
