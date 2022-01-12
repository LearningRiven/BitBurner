import * as nodeLoader from "/utils/nodeUtils.js";
import * as calc from "/utils/nodeCalculations.js";

export async function main(ns){
	var reachableNodes = nodeLoader.loadReachableNodes(ns);
	var ports = calc.calculateAvailablePorts(ns);

	var nodesHacked = [];
	var cantRoot = 0;
	var noBrute = 0;
	var noFTP = 0;

	let resp = await performRoot(ns, ports, nodesHacked, reachableNodes, cantRoot, noBrute, noFTP);

	ns.tprint("\n\n" + "Root Results: " + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because of hacking level", [cantRoot]) + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because due to missing BruteSSH.exe", [noBrute]) + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because due to missing FTPCrack.exe", [noFTP]) + "\n");
	ns.tprint(vsprintf("Rooted %d new nodes!", [nodesHacked.length]));

	return resp;
}


export async function rootAllHelper(ns){
	var reachableNodes = nodeLoader.loadReachableNodes(ns);
	var ports = calc.calculateAvailablePorts(ns);

	var nodesHacked = [];
	var cantRoot = 0;
	var noBrute = 0;
	var noFTP = 0;
	var noSMTP = 0;
	var noWorm = 0;
	var noSQL = 0;
	var totalHacked = [];

	let resp = await performRoot(ns, ports, nodesHacked, reachableNodes, cantRoot, noBrute, noFTP, noSMTP, noWorm, noSQL, totalHacked);

	ns.tprint("\n\n" + "Root Results: " + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because of hacking level", [cantRoot]) + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because due to missing BruteSSH.exe", [noBrute]) + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because due to missing FTPCrack.exe", [noFTP]) + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because due to missing relaySMTP.exe", [noSMTP]) + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because due to missing HTTPWorm.exe", [noWorm]) + "\n");
	ns.tprint(vsprintf("Couldnt root %d nodes because due to missing SQLInject.exe", [noSQL]) + "\n");
	ns.tprint(vsprintf("\nRooted %d new nodes!", [nodesHacked.length]));
	ns.tprint(vsprintf("Total %d hacked nodes!", [totalHacked.length + nodesHacked.length]));

	return resp;
}

async function performRoot(ns, ports, nodesHacked, reachableNodes, cantRoot, noBrute, noFTP, noSMTP, noWorm, noSQL, totalHacked){
	for(var node of reachableNodes){
		await openPorts(ns, ports, nodesHacked, node, cantRoot, noBrute, noFTP, noSMTP, noWorm, noSQL, totalHacked);
	};
}

async function openPorts(ns, ports, nodesHacked, node, cantRoot, noBrute, noFTP, noSMTP, noWorm, noSQL, totalHacked){
	if(!node.hasAdminRights){
		if((ports.indexOf("BruteSSH.exe") !== -1 && !node.sshPortOpen)){
			await ns.brutessh(node.hostname);
		}else{
			noBrute++;
		}

		if((ports.indexOf("FTPCrack.exe") !== -1 && !node.ftpPortOpen)){
			await ns.ftpcrack(node.hostname);
		}
		else{
			noFTP++;
		}

		if((ports.indexOf("relaySMTP.exe") !== -1 && !node.smtpPortOpen)){
			await ns.relaysmtp(node.hostname);
		}
		else{
			noSMTP++;
		}
		
		if((ports.indexOf("HTTPWorm.exe") !== -1 && !node.httpPortOpen)){
			await ns.httpworm(node.hostname);
		}
		else{
			noWorm++;
		}
		
		if((ports.indexOf("SQLInject.exe") !== -1 && !node.sqlPortOpen)){
			await ns.sqlinject(node.hostname);
		}
		else{
			noSQL++;
		}

		if(!node.purchasedByPlayer && node.numOpenPortsRequired <= node.openPortCount){
			await ns.nuke(node.hostname);
			nodesHacked.push(node);
		}
		else{
			cantRoot++;
		}
	}
	else{
		totalHacked.push(node);
	}
}