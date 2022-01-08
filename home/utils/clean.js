//Note that you must directly add the directory from home of what you want to keep
var files = ["/utils/clean.js", "install-vue.js", "/bitburner-vue/"]

export async function main(ns) {
	var homeFiles = ns.ls("home").filter(r => (r.includes(".js") || r.includes(".ns") || r.includes(".script")));
	
	var deleted = 0;
	var excluded = 0;
	for(var homeFile of homeFiles){
		var canDelete = verify(ns, homeFile);
		if(canDelete){
			ns.rm(homeFile, "home");
			deleted++;
		}
		else{
			excluded++;
		}
	}
	var remaining = ns.ls("home").filter(r => (r.includes(".js") || r.includes(".ns") || r.includes(".script")));

	var msg = "";
	msg = msg + ns.vsprintf("\nFound a total of %i   files!", [homeFiles.length]);
	msg = msg + ns.vsprintf("\nExcluded       : %i   files!", [excluded]);
	msg = msg + ns.vsprintf("\nRemoved        : %i   files!", [deleted]);
	msg = msg + ns.vsprintf("\nFiles Remaining: %i   files!\n\n%s", [remaining.length,remaining.toString()]);
	ns.tprint(msg);

}

function verify(ns, homeFile){
	var valid = true;

	//Check that it is an allowed file type to delete
	if(!(homeFile.indexOf(".js") === -1 || homeFile.indexOf(".ns") === -1 || homeFile.indexOf(".script") === -1)){
		valid = false;
	}

	//If the file is a non game file, now you must check whether it needs to be excluded
	if(valid){
		for(var fileToExclude of files){
			if(homeFile.includes(fileToExclude)){
				valid = false;
			}
		}
	}

	return valid;
}