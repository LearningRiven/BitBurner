import {parseNode, loadNodesWithAdminAccess} from "/AdminTools/utils.js";

var scriptFiles = [];

export function killAllHelper(ns) {
    var hNodes = loadNodesWithAdminAccess(ns);
    var homeNode = parseNode(ns.getServer("home"));
    hNodes.push(homeNode);

    var killedNodes = [];

    var total = 0;
    for(var k = 0; k < hNodes.length; k++){
        ns.killall(hNodes[k].hostname);
        killedNodes.push(hNodes[k]);
        total++;
    }
    
    ns.tprint("Killed all scripts on a total of " + total + " servers!");

}

export function killSomeHelper(ns){
    var hNodes = loadNodesWithAdminAccess(ns);
    var homeServer = parseNode(ns.getServer("home"));
    hNodes.push(homeServer);
    var processes = 0;
    var killedNodes = [];

    for(var node of hNodes){
        var filesKilled = 0;
        for(var file of scriptFiles){
            filesKilled = killFilesOnANode(ns, node, file, killedNodes, filesKilled);
        }
        processes = processes + filesKilled;
    }

    ns.tprint(ns.vsprintf("Killed %d processes on %d nodes!",[processes, killedNodes.length]));
}

function killFilesOnANode(ns, node, file, killedNodes, processes){
    var p1 = ns.ps(node.hostname);
    for (var process of p1){
        if(process.filename.indexOf(file) !== -1){
            var complete = ns.kill(process.pid);
            if(complete){
                killedNodes.push(node);
                processes = processes + 1;
            }
        }
    }
    return processes;
}