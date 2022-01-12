export function calculateAvailablePorts(ns){
	var ports = [];
	if(ns.fileExists("BruteSSH.exe", "home")){
		ports.push("BruteSSH.exe");
	}
	if(ns.fileExists("FTPCrack.exe", "home")){
		ports.push("FTPCrack.exe");
	}
	if(ns.fileExists("relaySMTP.exe", "home")){
		ports.push("relaySMTP.exe");
	}
	if(ns.fileExists("HTTPWorm.exe", "home")){
		ports.push("HTTPWorm.exe");
	}
	if(ns.fileExists("SQLInject.exe", "home")){
		ports.push("SQLInject.exe");
	}
	return ports;
}

export function calculateThreads(ns, scriptRam, server, modifier){
	var max = server.maxRam;
	var cur = server.ramUsed;

	var threads = (max - cur) / scriptRam;
	threads = Math.floor(threads/modifier);
	
	return threads;
}