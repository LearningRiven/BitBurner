//UNUSED FOR NOW
import {calculateThreads} from "/AdminTools/calcs.js";
import {loadNodesWithAdminAccess, parseNode} from "/AdminTools/utils.js";

var homeMod = 1.5;
var awayMod = 1;

export async function fileRunner(ns, args) {
    var startedOn = [];
    var home = args[0];
    var file = args[1];
    var target = args[2];
    var fileSize = await ns.getScriptRam(file, "home");
    if(fileSize > 0){
        startOnNodes(ns, startedOn, file, fileSize, target);
        if(home){
            startOnHome(ns, startedOn, file, fileSize, target);
        }
        
        // ns.tprint(
        //     ns.vsprintf("Finished starting scripts on %d nodes (Total Threads: %d)", [startedOn.length, (startedOn.length*threads)])
        // );
    }
}
    

async function startOnHome(ns, startedOn, file, fileSize, target){
    var homeServer = parseNode(ns.getServer("home"));
    var threads = await threadHelper(ns, fileSize, homeServer, homeMod);

    if(threads > 0){
        runAttack(ns, homeServer, threads, file, startedOn, target, fileSize, Math.ceil(homeServer.maxRam/homeMod));
    }

    ns.tprint(
        ns.vsprintf("Finished starting scripts on home, %d GB usage per thread (Threads: %d, Total Usage: %d GB)", [fileSize ,threads,fileSize*threads])
    );
}

async function startOnNodes(ns, startedOn, file, fileSize, target){
    var hackedNodes = loadNodesWithAdminAccess(ns);
    for(var node of hackedNodes){
        if(node.maxRam !== 0 && node.ramUsed === 0){
            var threads = await threadHelper(ns, fileSize, node, awayMod);
            if(threads > 0){
                await runAttack(ns, node, threads, file, startedOn, target, fileSize, Math.ceil(node.maxRam/awayMod));
            }
        }
    }
}

async function runAttack(ns, node, threads, file, startedOn, target, fileSize, maxRam){
    await ns.exec(file, node.hostname, threads, target, fileSize, node.hostname, maxRam);
    startedOn.push(node);
}

function threadHelper(ns, fileSize, node, mod){
    var threads = calculateThreads(ns, fileSize, node, mod);
    return threads;
}