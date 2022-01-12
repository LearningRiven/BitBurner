import {loadReachableNodes} from "/utils/nodeUtils.js";

export function main(ns){
    var nodes = loadReachableNodes(ns);
    var count = 0;

    for(var node of nodes){
        if(node.purchasedByPlayer){
            ns.deleteServer(node.hostname);
            count++;
        }
    }

    ns.tprint(ns.vsprintf("Deleted %d player owned servers.", [count]));
}