import {loadNodesWithAdminAccess} from "/AdminTools/utils.js";

var scriptFiles = ["/Hacking/Attacks/distAtt.js", "/Hacking/Attacks/timedAtt.js"];

export async function moveHelper(ns) {
	var hackedNodes = loadNodesWithAdminAccess(ns);
	var promises = [];
	for(var h = 0; h < hackedNodes.length; h++){
		promises.push(await moveFile(ns, scriptFiles, hackedNodes[h].hostname));
	}
	let resp = await Promise.all(promises).then(() => {
        ns.tprint(
			vsprintf("Moved %d files to %d servers!", [scriptFiles.length, hackedNodes.length])
		);
    });
	return resp;
}

async function moveFile(ns, files, hostname){
	await ns.scp(files, "home", hostname);
}

