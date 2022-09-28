let node = require('./base_node.js').node
let PORT= require('./node_config.js').nodeS4[0],
    peerPORT=require('./node_config.js').nodeS4[1] ,
    wsPORT=require('./node_config.js').nodeS4[2]

node(PORT,peerPORT,wsPORT)