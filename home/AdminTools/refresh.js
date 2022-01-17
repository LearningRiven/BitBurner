import {rootAllHelper} from "/Hacking/ProcessHelpers/rooter.js";
import {killAllHelper} from "/Hacking/ProcessHelpers/stopper.js";
import {moveHelper} from "/Hacking/ProcessHelpers/mover.js";

export async function main(ns) {
    await rootAllHelper(ns);
    await moveHelper(ns);
    killAllHelper(ns);
}