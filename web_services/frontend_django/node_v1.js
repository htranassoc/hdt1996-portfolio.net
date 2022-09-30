let node = require('./base_node.js').node
let PORT= require('./node_config.js').nodeS1[0],
    peerPORT=require('./node_config.js').nodeS1[1] ,
    wsPORT=require('./node_config.js').nodeS1[2]

node(PORT,peerPORT,wsPORT)