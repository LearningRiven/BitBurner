export function gTotalWithProperty(arr, keys, vals) {
	var ct = 0;
	if(keys.length !== vals.length){
		return ct;
	}

	for(var k = 0; k < arr.length; k++){
		var conditions = true;
		for(var j = 0; j < keys.length; j++){
			var key = keys[j];
			var val = vals[j];
			if(arr[k][key] !== val){
				conditions = false;
			}
		}
		if(conditions){
			ct++;
		}
	}
	
	return ct;
}

export function gSumWithProperty(arr, primaryKey, keys, vals){
	var sum = 0;
	if(keys.length !== vals.length){
		return ct;
	}
	for(var k = 0; k < arr.length; k++){
		var conditions = true;
		for(var j = 0; j < keys.length; j++){
			var ky = keys[j];
			var va = vals[j];
			if(arr[k][ky] !== va){
				conditions = false;
			}
		}
		if(conditions){
			sum = sum + arr[k][primaryKey];
		}
	}
	
	return sum;
}

export function gAverageSums(n, d){
	var totalN = 0;
	var totalD = 0;

	for(var k = 0; k < n.length; k++){
		totalN = totalN + n[k];
	}
	for(var k = 0; k < d.length; k++){
		totalD = totalD + d[k];
	}

	if(totalD === 0){
		totalD = 1;
	}

	return totalN/totalD;
}

export function calculateAvailablePorts(ns){
	var ports = [];
	if(ns.fileExists("BruteSSH.exe", "home")){
		ports.push("BruteSSH.exe");
	}
	if(ns.fileExists("FTPCrack.exe", "home")){
		ports.push("FTPCrack.exe");
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