let node = require('./base_node.js').node
let PORT= require('./node_config.js').nodeS2[0],
    peerPORT=require('./node_config.js').nodeS2[1] ,
    wsPORT=require('./node_config.js').nodeS2[2]
let debug = require('./node_config.js').debug

node(debug,PORT,peerPORT,wsPORT)