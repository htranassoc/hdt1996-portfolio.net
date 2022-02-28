let node = require('./base_node.js').node
let PORT= require('./node_config.js').nodeS3[0],
    peerPORT=require('./node_config.js').nodeS3[1] ,
    wsPORT=require('./node_config.js').nodeS3[2]
let debug = require('./node_config.js').debug

node(debug,PORT,peerPORT,wsPORT)