//Cleans out the whole workspace (in order to refresh the game file structure)
export async function main(ns) {
	//Disable Log
	ns.disableLog('ALL');

	var homeFiles = ns.ls("home").filter(r => (r.includes(".js") || r.includes(".ns") || r.includes(".script")));
	var excluded = [];
	var deleted = 0;

	for(var homeFile of homeFiles){
		var canDelete = verify(homeFile, excluded);
		if(canDelete){
			ns.rm(homeFile, "home");
			deleted++;
		}
	}

	var msg = "";
	msg = msg + ns.vsprintf("\n[INFO] Found a total of %i files!", [homeFiles.length]);
	msg = msg + ns.vsprintf("\n[INFO] Excluded  : %s", [excluded.toString()]);
	msg = msg + ns.vsprintf("\n[INFO] Removed   : %i files!\n\n", [deleted]);
	ns.tprint(msg);

}

function verify(homeFile, excluded){
	var valid = true;

	//Check that it is an allowed file type to delete, also dont tell it to delete itself
	if(!(homeFile.indexOf(".js") === -1 || homeFile.indexOf(".ns") === -1 || homeFile.indexOf(".script") === -1 || homeFile.indexOf("cleanAll.js") === -1)){
		valid = false;
	}

	//Check for excluded files
	if(!(homeFile.indexOf("cleanAll.js") === -1)){
		excluded.push(homeFile);
		valid = false;
	}

	return valid;
}