import {hackNodes, growNodes, weakNodes} from "/AdminTools/utils.js";
import {calculateThreads} from "/AdminTools/calcs.js"

var file = "/Hacking/Attacks/distAtt.js";
var tick = 250;
var server = "";
var reservedHomeGB = 0;

export async function main(ns){
    server = ns.args[0];
    var fileSize = ns.args[1];
    reservedHomeGB = ns.args[2];

    ns.disableLog('ALL');
    const maxMoney = ns.getServerMaxMoney(server);
    const minSec = ns.getServerMinSecurityLevel(server);

    //Get nodes with root access
    var h = hackNodes(ns, fileSize);
    var g = growNodes(ns, fileSize);
    var w = weakNodes(ns, fileSize, reservedHomeGB);
    
    while(true){
        ns.clearLog(server);
        ns.print(`${server}:`);

        var money = ns.getServerMoneyAvailable(server);
        if (money === 0) money = 1;
        var sec = ns.getServerSecurityLevel(server);

        var agitate = (sec - minSec) > 20;

        //Now decide how many threads for each
        var weakThreadsNeeded = Math.ceil((sec - minSec) * 20);
        var growThreadsNeeded = Math.ceil(ns.growthAnalyze(server, maxMoney / money));
        var hackThreadsNeeded = Math.ceil(ns.hackAnalyzeThreads(server, money));

        runHackers(ns, h, hackThreadsNeeded, fileSize, agitate);
        runGrowers(ns, g, growThreadsNeeded, fileSize, agitate);
        runWeakers(ns, w, weakThreadsNeeded, fileSize);

        ns.print("Sleeping " + ns.tFormat(tick, true));
        await ns.sleep(tick);
    }

}

async function runHackers(ns, actioneers, needs, fileSize, agitate){
    ns.print(` Stared needing: ${ns.nFormat(needs, "#,##0")} hack threads`)
    ns.print(` __________Have: ${ns.nFormat(actioneers.length, "#,##0")} hack nodes`)

    var arr = [];
    //Collect information
    for(var node of actioneers){
        var serv = ns.getServer(node.hostname);
        if(serv.hostname === "home"){
            serv.maxRam = serv.maxRam - reservedHomeGB;
        }
        var obj = {
            "threads" : calculateThreads(ns, fileSize, serv, 1),
            "hostname" : node.hostname
        };
        if(needs > 0 && obj.threads > 0 && !agitate){
            arr.push(obj);
            needs = needs - node.threads;
        }
    }
    
    ns.print(` ${ns.nFormat(needs, "#,##0")} hack threads left, executing on ${ns.nFormat(arr.length, "#,##0")} Nodes\n`);
    executeHack(ns, arr);
}
async function runGrowers(ns, actioneers, needs, fileSize, agitate){
    ns.print(` Stared needing: ${ns.nFormat(needs, "#,##0")} grow threads`)
    ns.print(` __________Have: ${ns.nFormat(actioneers.length, "#,##0")} grow nodes`)

    var arr = [];
    //Collect information
    for(var node of actioneers){
        var serv = ns.getServer(node.hostname);
        if(serv.hostname === "home"){
            serv.maxRam = serv.maxRam - reservedHomeGB;
        }
        var obj = {
            "threads" : calculateThreads(ns, fileSize, serv, 1),
            "hostname" : node.hostname
        };
        if(needs > 0 && obj.threads > 0 && !agitate){
            arr.push(obj);
            needs = needs - node.threads;
        }
    }

    ns.print(` ${ns.nFormat(needs, "#,##0")} grow threads left, executing on ${ns.nFormat(arr.length, "#,##0")} Nodes\n`);
    executeGrow(ns, arr);
}
async function runWeakers(ns, actioneers, needs, fileSize){
    ns.print(` Stared needing: ${ns.nFormat(needs, "#,##0")} hack threads`)
    ns.print(` __________Have: ${ns.nFormat(actioneers.length, "#,##0")} hack nodes`)

    var arr = [];
    //Collect information
    for(var node of actioneers){
        var serv = ns.getServer(node.hostname);
        if(serv.hostname === "home"){
            serv.maxRam = serv.maxRam - reservedHomeGB;
        }
        var obj = {
            "threads" : calculateThreads(ns, fileSize, serv, 1),
            "hostname" : node.hostname
        };
        if(needs > 0 && obj.threads > 0){
            arr.push(obj);
            needs = needs - node.threads;
        }
    }
    
    ns.print(` ${ns.nFormat(needs, "#,##0")} weak threads left, executing on ${ns.nFormat(arr.length, "#,##0")} Nodes\n`);
    executeWeaken(ns, arr);
}

async function executeWeaken(ns, arr){
    var ex = 0;
    for(var obj of arr){
        var threads = obj.threads;
        var hostname = obj.hostname;
        if(threads && hostname){
            ns.exec(file, hostname, threads, server, threads, "weaken");
            ex = ex + threads;
        }
    }
    ns.print(` Executed: ${ns.nFormat(ex, "#,##0")} weak threads on ${ns.nFormat(arr.length, "#,##0")} Nodes`)
}

async function executeGrow(ns, arr){
    var ex = 0;
    for(var obj of arr){
        var threads = obj.threads;
        var hostname = obj.hostname;
        if(threads && hostname){
            ns.exec(file, hostname, threads, server, threads, "grow");
            ex = ex + threads;
        }
    }
    ns.print(` Executed: ${ns.nFormat(ex, "#,##0")} grow threads on ${ns.nFormat(arr.length, "#,##0")} Nodes`)
}

async function executeHack(ns, arr){
    var ex = 0;
    for(var obj of arr){
        var threads = obj.threads;
        var hostname = obj.hostname;
        if(threads && hostname){
            ns.exec(file, hostname, threads, server, threads, "hack");
            ex = ex + threads;
        }
    }
    ns.print(` Executed: ${ns.nFormat(ex, "#,##0")} hack threads on ${ns.nFormat(arr.length, "#,##0")} Nodes`)
}
