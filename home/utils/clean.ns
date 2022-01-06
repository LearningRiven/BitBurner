var exclude = ["/utils/clean.ns"]

export async function main(ns) {
	var files = ns.ls("home");
	var ct = 0;
	var ct2 = 0;
	var ct3 = 0;
	for(var file of files){
		if((file.indexOf(".ns") !== -1 || file.indexOf(".script") !== -1) && exclude.indexOf(file) === -1){
			ns.rm(file, "home");
			ct++;
		}else if(exclude.indexOf(file) !== -1){
			ct2++;
		}else{
			ct3++;
		}
	}

	var msg = "";
	msg = msg + "\nFound a total of " + (ct+ct2+ct3) + " files.";
	msg = msg + "\nTotal Server Files " + (ct3) + " files.";
	msg = msg + "\nTotal Excluded Files " + (ct2) + " files.";
	msg = msg + "\nTotal Deleted Files " + (ct) + " files.";

	ns.tprint(msg);
}