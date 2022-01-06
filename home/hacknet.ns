export async function main(ns) {
	//Handle the base case of starting the script in the beginning of the game
	if(ns.getServerMoneyAvailable("home") >= ns.hacknet.getPurchaseNodeCost() && ns.hacknet.numNodes() === 0){
		ns.hacknet.purchaseNode();
	}

	//Handle everything else continuously
	while(true){
		//Find the weakest node
		var weakestIndex = weakestIndex(ns);
		var weakestNode = ns.hacknet.getNodeStats(weakestIndex);
		var augMult = ns.getHacknetMultipliers().production * ns.getBitNodeMultipliers().HacknetNodeMoney;
		performChoice(ns, weakestNode, augMult);
	}
}

function decide(ns, weakestNode, gainMul){
	var ram = 8;

	//Load relevant node stats
	let X = weakestNode.level;
	let Y = weakestNode.ram;
	let Z = weakestNode.cores;

	//Load costs
	var lc = ns.hacknet.getLevelUpgradeCost(weakestIndex, 1);
	var rc = ns.hacknet.getRamUpgradeCost(weakestIndex, 1);
	var cc = ns.hacknet.getCoreUpgradeCost(weakestIndex, 1);
	var nc = ns.hacknet.getPurchaseNodeCost();

	//Load gains
	var lg = gainMul * gainFromLevelUpgrade(X, Y, Z);
	var rg = gainMul * gainFromRamUpgrade(X, Y, Z);
	var cg = gainMul * gainFromCoreUpgrade(X, Y, Z);

	var np = calculateNodeProd(ns);
	var money = ns.getPurchasedServerCost(ram);

	//Only buy if we are less than 35% of the way to a new server
	if(np < (money * 0.35)){
		if(lg > rg && lg > cg && (lg/nc) < 0.75){
			if(lc <= ns.getServerMoneyAvailable("home")){
				ns.hacknet.upgradeLevel(weakestIndex, 1);
				ns.tprint("/nPurchased Level: " +
						  "/n------Level  : " + X + " (Gain: " + lg + ")" +
						  "/n------Ram(GB): " + Y  + "(Gain: " + rg + ")" +
						  "/n------Cores  : " + Z  + "(Gain: " + cg + ")" + 
						  "/n--Next Server: " + nFormat(nc, "$ 0,000.##") + "(Server Cash " + nFormat(ns.getServerMoneyAvailable("home"), "$ 0,000.##") + ")");
			}
		}
		else if(rg > lg && rg > cg && (rg/nc) < 0.75){
			if(rc <= ns.getServerMoneyAvailable("home")){
				ns.hacknet.upgradeRam(weakestIndex, 1);
				ns.tprint("/nPurchased Ram: " +
						  "/n------Level  : " + X + " (Gain: " + lg + ")" +
						  "/n------Ram(GB): " + Y  + "(Gain: " + rg + ")" +
						  "/n------Cores  : " + Z  + "(Gain: " + cg + ")" + 
						  "/n--Next Server: " + nFormat(nc, "$ 0,000.##") + "(Server Cash " + nFormat(ns.getServerMoneyAvailable("home"), "$ 0,000.##") + ")");
			}
		}
		else if(cg > lg && cg > rg && (cg/nc) < 0.75){
			if(cc <= ns.getServerMoneyAvailable("home")){
				ns.hacknet.upgradeCore(weakestIndex, 1);
				ns.tprint("/nPurchased Core: " +
						  "/n------Level  : " + X + " (Gain: " + lg + ")" +
						  "/n------Ram(GB): " + Y  + "(Gain: " + rg + ")" +
						  "/n------Cores  : " + Z  + "(Gain: " + cg + ")" + 
						  "/n--Next Server: " + nFormat(nc, "$ 0,000.##") + "(Server Cash " + nFormat(ns.getServerMoneyAvailable("home"), "$ 0,000.##") + ")");
			}
		}
		else{
			if(nc <= ns.getServerMoneyAvailable("home")){
				ns.hacknet.upgradeCore(weakestIndex, 1);
				ns.tprint("/nPurchased Node: " +
						  "/n------Level  : " + X + " (Gain: " + lg + ")" +
						  "/n------Ram(GB): " + Y  + "(Gain: " + rg + ")" +
						  "/n------Cores  : " + Z  + "(Gain: " + cg + ")" + 
						  "/n--Next Server: " + nFormat(nc, "$ 0,000.##") + "(Server Cash " + nFormat(ns.getServerMoneyAvailable("home"), "$ 0,000.##") + ")");
			} 
		}
	}
}

function calculateNodeProd(ns){
	var nodes = ns.hacknet.getNodeStats();
	var total = 0;

	for(var node in nodes){
		total = total + node.production;
	}

	return total;
}

function gainFromLevelUpgrade(X, Y, Z) {
    return (1*1.6) * Math.pow(1.035,Y-1) * ((Z+5)/6);
}
function gainFromRamUpgrade(X, Y, Z) {
    return (X*1.6) * (Math.pow(1.035,(2*Y)-1) - Math.pow(1.035,Y-1)) * ((Z+5)/6);
}
function gainFromCoreUpgrade(X, Y, Z) {
    return (X*1.6) * Math.pow(1.035,Y-1) * (1/6);
}

function weakestIndex(ns){
	var w = 0;
	for(var k = 0; k < ns.hacknet.numNodes(); k++){
		var pStats = ns.hacknet.getNodeStats(k);
		var cStats = ns.hacknet.getNodeStats(w);
		if(pStats.production > cStats.production){
			w = k;
		}
	}
	return w;
}

async function waitTillCash(ns, target){
    if(ns.getServerMoneyAvailable("home") < target)
        ns.print(`Waiting for cash to reach ${target}`);
    while(ns.getServerMoneyAvailable("home") < target)
        await ns.sleep(5000);
}

