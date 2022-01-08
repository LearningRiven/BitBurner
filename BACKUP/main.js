import {rootAllHelper} from "/automation/rootNodes.js";
import {killAllHelper} from "/automation/stopProcesses.js";
import {moveHelper} from "/automation/moveFiles.js";
import {fileRunner} from "/automation/runFiles.js";

export async function main(ns) {
	let p1 = await rootAllHelper(ns);
    let p2 = await moveHelper(ns);
    Promise.all([p1,p2]).then(() => {
        killAllHelper(ns);
        fileRunner(ns);
    });
}