import {loadAccessibleNodeWithTheHighestMoney} from "/utils/nodeUtils.js";

export async function main(ns){
    var highestMoneyNode = loadAccessibleNodeWithTheHighestMoney(ns);

    ns.tprint("Node Name        : " + highestMoneyNode.hostname);
    ns.tprint("Max Money        : " + ns.nFormat(highestMoneyNode.moneyMax, "$ #,##0.00"));
    ns.tprint("Current Money    : " + ns.nFormat(highestMoneyNode.moneyAvailable, "$ #,##0.00"));
    ns.tprint("Server Growth    : " + ns.nFormat(highestMoneyNode.serverGrowth, "#,##0.00"));
    ns.tprint("Min Difficulty   : " + ns.nFormat(highestMoneyNode.minDifficulty, "#,##0.00"));
    ns.tprint("Hack Difficulty  : " + ns.nFormat(highestMoneyNode.hackDifficulty, "#,##0.00"));

    while(true){
        await ns.sleep(100);
        ns.clearLog();

        //Server Logs
        ns.print("Node Name        : " + highestMoneyNode.hostname);
        ns.print("Max Money        : " + ns.nFormat(highestMoneyNode.moneyMax, "$ #,##0.00"));
        ns.print("Current Money    : " + ns.nFormat(highestMoneyNode.moneyAvailable, "$ #,##0.00"));
        ns.print("Server Growth    : " + ns.nFormat(highestMoneyNode.serverGrowth, "#,##0.00"));
        ns.print("Min Difficulty   : " + ns.nFormat(highestMoneyNode.minDifficulty, "#,##0.00"));
        ns.print("Hack Difficulty  : " + ns.nFormat(highestMoneyNode.hackDifficulty, "#,##0.00"));

        var ten         = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.1, 2))
        var twenty      = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.2, 2))
        var thirty      = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.3, 2))
        var forty       = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.4, 2))
        var fifty       = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.5, 2))
        var sixty       = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.6, 2))
        var seventy     = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.7, 2))
        var eighty      = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.8, 2))
        var ninety      = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 1.9, 2))
        var oneHundred  = Math.ceil(ns.growthAnalyze(highestMoneyNode.hostname, 2, 2))

        ns.print("\nGrowth Analysis");
        ns.print("10% Growth Threads: " + ns.nFormat(ten, "#,###") + " Threads");
        ns.print("20% Growth Threads: " + ns.nFormat(twenty, "#,###") + " Threads");
        ns.print("30% Growth Threads: " + ns.nFormat(thirty, "#,###") + " Threads");
        ns.print("40% Growth Threads: " + ns.nFormat(forty, "#,###") + " Threads");
        ns.print("50% Growth Threads: " + ns.nFormat(fifty, "#,###") + " Threads");
        ns.print("60% Growth Threads: " + ns.nFormat(sixty, "#,###") + " Threads");
        ns.print("70% Growth Threads: " + ns.nFormat(seventy, "#,###") + " Threads");
        ns.print("80% Growth Threads: " + ns.nFormat(eighty, "#,###") + " Threads");
        ns.print("90% Growth Threads: " + ns.nFormat(ninety, "#,###") + " Threads");
        ns.print("100% Growth Threads: " + ns.nFormat(oneHundred, "#,###") + " Threads");
    }
}