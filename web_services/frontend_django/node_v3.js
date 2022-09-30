let node = require('./base_node.js').node
let PORT= require('./node_config.js').nodeS3[0],
    peerPORT=require('./node_config.js').nodeS3[1] ,
    wsPORT=require('./node_config.js').nodeS3[2]

node(PORT,peerPORT,wsPORT)