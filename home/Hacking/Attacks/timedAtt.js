export async function main(ns){
    var target = ns.args[0];
    var thr = ns.args[1];

    var moneyThresh = ns.getServerMaxMoney(target) * 0.95;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;


    while(true) {
        ns.clearLog();
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            ns.print("Running weaken");
            await ns.weaken(target,{
                threads : thr
            });
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            ns.print("Running grow");
            await ns.grow(target,{
                threads : thr
            });
        } else {
            // Otherwise, hack it
            ns.print("Running hack");
            await ns.hack(target,{
                threads : thr
            });
        }
    }
}