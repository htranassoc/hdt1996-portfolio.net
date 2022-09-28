let destination = "/home/htran/Desktop/hdt1996-portfolio.net"
let host = require(`${destination}/server_config.json`).host
let domain = require(`${destination}/server_config.json`).domain
let debug = false
let base_dir = `${destination}/proxy/certs/`


let nodeS1 = [8010, 8020, 8030]
let nodeS2 = [8011, 8021, 8031]
let nodeS3 = [8012, 8022, 8032]
let nodeS4 = [8013, 8023, 8033]

module.exports=
{
    debug:debug,
    nodeS1:nodeS1,
    nodeS2:nodeS2,
    nodeS3:nodeS3,
    nodeS4:nodeS4,
    host:host,
    domain:domain,
    base_dir,base_dir
}
