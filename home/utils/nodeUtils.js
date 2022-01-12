export function loadReachableNodes(ns) {
	//First load all of the children of the node you are connected to
	var nodes = ns.scan("home");
	var data = [];
	var visitedNodes = [];

	//Next loop through the children
	for(var k = 0; k < nodes.length; k++){
		var node = nodes[k];
		//First create a data object with the information we want(data) and add it to the array
		var server = ns.getServer(node);
		var serverObject = parseNode(server);
		data.push(serverObject);
		//Then mark it as a visited node
		visitedNodes.push(node);
		//Finally drilldown into the nodes of this node
		drillDown(ns, node, data, visitedNodes);
	}

	return data;
}

function drillDown(ns, parentNode, data, visitedNodes){
	//First check that this a valid parent node
	if(isValid(parentNode, visitedNodes)){
		return;
	}

	//Scan the node
	var nodes = ns.scan(parentNode);

	//Next loop through the children
	for(var k = 0; k < nodes.length; k++){
		var node = nodes[k];
		//First make sure that this is a valid child
		if(isValid(node, visitedNodes)){
			//Next create a data object with the information we want(data) and add it to the array
			var server = ns.getServer(node);
			var serverObject = parseNode(server);
			data.push(serverObject);

			//Then mark it as a visited node
			visitedNodes.push(node);
			
			//Finally drilldown into the nodes of this node
			drillDown(ns, node, data, visitedNodes);
		}
	}
}

export function parseNode(nodeServer){
	var object = {
		"backdoorInstalled": nodeServer.backdoorInstalled,
		"baseDifficulty": nodeServer.baseDifficulty,
		"cpuCores": nodeServer.cpuCores,
		"ftpPortOpen": nodeServer.ftpPortOpen,
		"hackDifficulty": nodeServer.hackDifficulty,
		"hasAdminRights": nodeServer.hasAdminRights,
		"hostname":  nodeServer.hostname,
		"httpPortOpen": nodeServer.httpPortOpen,
		"ip": nodeServer.ip,
		"maxRam": nodeServer.maxRam,
		"minDifficulty": nodeServer.minDifficulty,
		"moneyAvailable": nodeServer.moneyAvailable,
		"moneyMax": nodeServer.moneyMax,
		"numOpenPortsRequired": nodeServer.numOpenPortsRequired,
		"openPortCount": nodeServer.openPortCount,
		"organizationName": nodeServer.organizationName,
		"purchasedByPlayer": nodeServer.purchasedByPlayer,
		"ramUsed": nodeServer.ramUsed,
		"requiredHackingSkill": nodeServer.requiredHackingSkill,
		"serverGrowth": nodeServer.serverGrowth,
		"smtpPortOpen": nodeServer.smtpPortOpen,
		"sqlPortOpen": nodeServer.sqlPortOpen,
		"sshPortOpen": nodeServer.sshPortOpen
	}

	return object;
}

function isValid(parentNode, visitedNodes){
	if(parentNode === 'home' || visitedNodes.indexOf(parentNode) !== -1){
		return false;
	}
	return true;
}

/**
 * Different combinations of nodes below
 * 
 */
export function loadNodesWithAdminAccess(ns){
	var r = loadReachableNodes(ns);
	var h = [];

	for(var k = 0; k < r.length; k++){
		if(r[k].hasAdminRights){
			h.push(r[k]);
		}
	}

	return h;
}

export function loadAccessibleNodeWithTheHighestMoney(ns){
	var r = loadReachableNodes(ns);
	var highestNode = r[0];

	for(var k = 1; k < r.length; k++){
		if(r[k].hasAdminRights && r[k].moneyMax > highestNode.moneyMax && r[k].hackDifficulty < 30){
			highestNode = r[k];
		}
	}

	return highestNode;
}