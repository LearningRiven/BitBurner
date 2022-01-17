import {loadNodesWithAdminAccess} from "/AdminTools/utils.js";

export async function main(ns){
    var target = ns.args[0];
    var leftOver = ns.args[1];
    var homeServer = ns.getServer("home");
    var t = Math.floor((homeServer.maxRam - leftOver - homeServer.ramUsed)/2.4);
    var threads = 
    ns.exec("/Hacking/Attacks/timedAtt.js", "home", t, target, t);
    var adminNodes = loadNodesWithAdminAccess(ns);
    var launchedOn = [];
    
    for(var node of adminNodes){
        await ns.sleep(1000);
        if(node.hasAdminRights && node.maxRam !== 0){
            var threads = Math.floor((node.maxRam - node.ramUsed)/2.4);
            if(threads > 0){
                ns.exec("/Hacking/Attacks/timedAtt.js", node.hostname, threads, target, threads);
                launchedOn.push(node);
            }
        }
    }

    ns.tprint(msgGen(ns, launchedOn, target, threads, adminNodes));

}

function msgGen(ns, launchedOn, target, threads, adminNodes){
	var status = "";

    var totalThreads = 0;
	for(var node of launchedOn){
		if(node.hasAdminRights && node.maxRam !== 0){
            var threads = Math.floor((node.maxRam - node.ramUsed)/2.4);
            if(threads > 0){
                totalThreads = totalThreads + threads;
            }
        }
	}

	status = status + "\n\n[INFO] Target: " + target + "\n\n";
	status = status + "[INFO] Total threads across all nodes: " + totalThreads + "\n";
	status = status + "[INFO] Total nodes that have the script running: " + launchedOn.length + "\n";
	status = status + "[INFO] Total that had admin access: " + adminNodes.length + "\n";
	status = status + "\n[LAUNCH FINISHED] Finished Launching Scripts!";
	return status;
}