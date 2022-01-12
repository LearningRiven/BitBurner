import {loadNodesWithAdminAccess} from "/utils/nodeUtils.js";

export async function main(ns){
    ns.exec("/hacknode/hackfiles/tutorial-script.js", "home", 1200, "omega-net", 1200);

    var fileSize = 2.4;
    var adminNodes = loadNodesWithAdminAccess(ns);
    
    for(var node of adminNodes){
        await ns.sleep(1000);
        if(node.hasAdminRights && node.maxRam !== 0){
            var threads = Math.floor((node.maxRam - node.ramUsed)/2.4);
            if(threads > 0){
                ns.exec("/hacknode/hackfiles/tutorial-script.js", node.hostname, threads, "omega-net", threads);
            }
        }
    }

}