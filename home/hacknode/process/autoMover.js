import * as nodeLoader from "/utils/nodeUtils.js";

var scriptFiles = ["/hacknode/hackfiles/tutorial-script.js"];

export async function moveHelper(ns) {
	var hackedNodes = nodeLoader.loadNodesWithAdminAccess(ns);
	var promises = [];
	for(var h = 0; h < hackedNodes.length; h++){
		promises.push(await moveFile(ns, scriptFiles, hackedNodes[h].hostname));
	}
	await Promise.all(promises).then(() => {
        ns.tprint(
			vsprintf("Moved %d files to %d servers!", [scriptFiles.length, hackedNodes.length])
		);
		return true;
    });
}

async function moveFile(ns, files, hostname){
	await ns.scp(files, "home", hostname);
}

