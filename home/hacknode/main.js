import {rootAllHelper} from "/hacknode/process/autoRooter.js";
import {killAllHelper} from "/hacknode/process/autoStopper.js";
import {moveHelper} from "/hacknode/process/autoMover.js";
import {fileRunner} from "/hacknode/process/autoRunner.js";

export async function main(ns) {
	let p1 = await rootAllHelper(ns);
    let p2 = await moveHelper(ns);
    Promise.all([p1,p2]).then(() => {
        killAllHelper(ns);
        // fileRunner(ns, [true, "/hacknode/hackfiles/tutorial-script.js", "joesguns"]);
    });
}