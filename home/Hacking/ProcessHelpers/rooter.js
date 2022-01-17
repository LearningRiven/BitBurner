import {loadReachableNodes} from "/AdminTools/utils.js";
import {calculateAvailablePorts} from "/AdminTools/calcs.js";

export async function rootAllHelper(ns){
	var reachableNodes = loadReachableNodes(ns);
	var ports = calculateAvailablePorts(ns);

	var nodesHacked = [];
	var failedNodes = [];
	var totalNodes  = [];

	var resp = await performRoot(ns, ports, nodesHacked, failedNodes, totalNodes, reachableNodes);
	var status = msgGen(ns, nodesHacked, failedNodes, totalNodes, reachableNodes);
	ns.tprint(status);
	return resp;
}

async function performRoot(ns, ports, nodesHacked, failedNodes, totalNodes, reachableNodes){
	ns.tprint("[PROCESSING] Processing all reachable nodes!");
	for(var node of reachableNodes){
		await openPorts(ns, ports, nodesHacked, failedNodes, totalNodes, node);
	};
	ns.tprint("[FINISHED PROCESSING] Finished processing nodes!");
}

async function openPorts(ns, ports, nodesHacked, failedNodes, totalNodes, node){

	var status = "";
	if(!node.purchasedByPlayer){
		status = status + "[INFO] " + node.hostname + "!\n"
		if((ports.indexOf("BruteSSH.exe") !== -1 && !node.sshPortOpen)){
			await ns.brutessh(node.hostname);
			status = status + "[SUCCESS] Successfully brute forced into the SSH Port!\n";
		}else if(!node.sshPortOpen){
			status = status + "[FAILURE] Couldnt open the SSH Port, no BruteSSH.exe on home!\n";
		}

		if((ports.indexOf("FTPCrack.exe") !== -1 && !node.ftpPortOpen)){
			await ns.ftpcrack(node.hostname);
			status = status + "[SUCCESS] Successfully cracked the FTP Port!\n";
		}else if(!node.ftpPortOpen){
			ns.tprint("[FAILURE] Couldnt open the FTP Port, no FTPCrack.exe on home!");
			status = status + "[FAILURE] Couldnt open the FTP Port, no FTPCrack.exe on home!\n";
		}

		if((ports.indexOf("relaySMTP.exe") !== -1 && !node.smtpPortOpen)){
			await ns.relaysmtp(node.hostname);
			status = status + "[SUCCESS] Successfully relayed the SMTP Port!\n";
		}else if(!node.smtpPortOpen){
			status = status + "[FAILURE] Couldnt relay the SMTP Port, no relaySMTP.exe on home!\n";
		}
		
		if((ports.indexOf("HTTPWorm.exe") !== -1 && !node.httpPortOpen)){
			await ns.httpworm(node.hostname);
			status = status + "[SUCCESS] Successfully wormed the HTTP Port!\n";
		}else if(!node.httpPortOpen){
			status = status + "[FAILURE] Couldnt wormed HTTP Port, no HTTPWorm.exe on home!\n";
		}
		
		if((ports.indexOf("SQLInject.exe") !== -1 && !node.sqlPortOpen)){
			await ns.sqlinject(node.hostname);
			status = status + "[SUCCESS] Successfully injected SQL!\n";
		}else if(!node.sqlPortOpen){
			status = status + "[FAILURE] couldnt inject SQL, no SQLInject.exe on home!\n";
		}

		if(node.numOpenPortsRequired <= node.openPortCount && ns.getPlayer().hacking >= node.requiredHackingSkill && !node.hasAdminRights){
			await ns.nuke(node.hostname);
			nodesHacked.push(node);
		}else if(!node.hasAdminRights){
			failedNodes.push(node);
		}
		totalNodes.push(node);
	}

	if(status !== ""){
		ns.tprint(status);
	}

	return true;
}

function msgGen(ns, successfulNodes, failedNodes, totalNodes, reachableNodes){
	var status = "";
	for(var node of failedNodes){
		var c1 = node.numOpenPortsRequired <= node.openPortCount ? "[X]" : "[ ]";
		var c2 = ns.getPlayer().hacking >= node.requiredHackingSkill ? "[X]" : "[ ]";
		var c3 = node.sshPortOpen ? "[X]" : "[ ]";
		var c4 = node.ftpPortOpen ? "[X]" : "[ ]";
		var c5 = node.smtpPortOpen ? "[X]" : "[ ]";
		var c6 = node.httpPortOpen ? "[X]" : "[ ]";
		var c7 = node.sqlPortOpen ? "[X]" : "[ ]";

		
		status = status + "\n\n[FAILURE] Couldnt root node " + node.hostname + "!\n";
		status = status + c1 + " Required ports: " + node.numOpenPortsRequired + " (Current: "  + node.openPortCount + ")\n";
		status = status + c2 + " Required hacking: " + node.requiredHackingSkill + " (Current " + ns.getPlayer().hacking + ")\n";
		status = status + c3 + " SSH Port\n";
		status = status + c4 + " FTP Port\n";
		status = status + c5 + " SMTP Port\n";
		status = status + c6 + " HTTP Port\n";
		status = status + c7 + " SQL Port\n";
		status = status + "RAM: " + ns.nFormat(node.maxRam, "0.00 b") + "\n";
		status = status + "CPU: " + ns.nFormat(node.cpuCores, "0") + " Cores\n";
		status = status + "Max Money: " + ns.nFormat(node.moneyMax, "$ 0.00 a");
	}
	status = status + "\n\n[INFO] New Nodes: " + successfulNodes.length + "\n";
	status = status + "[INFO] Failed Nodes: " + failedNodes.length + "\n";
	status = status + "[INFO] Total non player admin nodes: " + (totalNodes.length - failedNodes.length) + " (" + ns.nFormat((totalNodes.length - failedNodes.length)/totalNodes.length, "0.00%") + ")\n";
	status = status + "[INFO] Total non player owned nodes: " + totalNodes.length + "\n";
	status = status + "[INFO] Total nodes that are accessible: " + reachableNodes.length + "\n";
	status = status + "\n[ROOT FINISHED] Finished Rooting Process";
	return status;
}