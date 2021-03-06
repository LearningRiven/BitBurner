export async function main(ns) {
	//Handle the base case of starting the script in the beginning of the game
	if(ns.getServerMoneyAvailable("home") >= ns.hacknet.getPurchaseNodeCost() && ns.hacknet.numNodes() === 0){
		ns.hacknet.purchaseNode();
	}

	//Handle everything else continuously
	ns.tprint("Current Total Node Production: " + ns.nFormat(calculateNodeProd(ns), "$ #,##0.00"));
	
	while(true){
		// Find the weakest node
		var weakestI = weakestIndex(ns);
		var weakestN;
		try{ 
			weakestN = ns.hacknet.getNodeStats(weakestI);
		}
		catch(err) {
			ns.tprint(err);
			ns.tprint("Weakest Node" + weakestI);
			break;
		}
		// var augMult = ns.getHacknetMultipliers().production * ns.getBitNodeMultipliers().HacknetNodeMoney;
		await decide(ns, weakestN, weakestI);
		await ns.sleep(50);
	}
}

async function decide(ns, weakestNode, weakestI){

	//Load relevant node stats
	let X = weakestNode.level;
	let Y = weakestNode.ram;
	let Z = weakestNode.cores;

	//Load costs
	var lc = ns.hacknet.getLevelUpgradeCost(weakestI, 1);
	var rc = ns.hacknet.getRamUpgradeCost(weakestI, 1);
	var cc = ns.hacknet.getCoreUpgradeCost(weakestI, 1);
	var nc = ns.hacknet.getPurchaseNodeCost();

	//Load gains
	var lg = X < 200 ? gainFromLevelUpgrade(X, Y, Z) : 0;
	var rg = Y < 64 ? gainFromRamUpgrade(X, Y, Z) : 0;
	var cg = Z < 16 ? gainFromCoreUpgrade(X, Y, Z) : 0;
	var serverMoney = ns.getServerMoneyAvailable("home");
	

	ns.clearLog();
	if(serverMoney > nc){
		ns.hacknet.purchaseNode();
	}
	//Upgrade Core
	else if(worthWaitingForCore(ns, serverMoney, cg, cc, rg, rc, lg, lc, nc) && Z < 16){
		if(serverMoney > cc){
			ns.hacknet.upgradeCore(weakestI, 1);
			ns.print("Bought core");
		}
		else{
			ns.print("Waiting for core");
		}
	}
	//Upgrade Ram
	else if(worthWaitingForRam(ns, serverMoney, cg, cc, rg, rc, lg, lc, nc) && Y < 64){
		if(serverMoney > rc){
			ns.hacknet.upgradeRam(weakestI, 1);
			ns.print("Bought ram");
		}
		else{
			ns.print("Waiting for ram");
		}
	}
	//Upgrade a Level
	else if(worthWaitingForLevel(ns, serverMoney, cg, cc, rg, rc, lg, lc, nc) && X < 200){
		if(serverMoney > lc){
			ns.hacknet.upgradeLevel(weakestI, 1);
			ns.print("Bought level");
		}
		else{
			ns.print("Waiting for level");
		}
	}
	ns.print("\nNode Production : " + ns.nFormat(calculateNodeProd(ns), "$ 0,000.##"));
	ns.print("\nHack Node Number: " + weakestI);
	ns.print("Time To Level: " + ns.nFormat(calculateTimeTill(ns, serverMoney, lc), "0,000") + " Seconds");
	ns.print("Time To Ram  : " + ns.nFormat(calculateTimeTill(ns, serverMoney, rc), "0,000") + " Seconds");
	ns.print("Time To Core : " + ns.nFormat(calculateTimeTill(ns, serverMoney, cc), "0,000") + " Seconds");
	ns.print("Weakest Level: " + X);
	ns.print("Weakest Ram  : " + Y);
	ns.print("Weakest Core : " + Z);
	ns.print("Level Gain   : " + ns.nFormat(lg, "0,000.####"));
	ns.print("Ram Gain   : " + ns.nFormat(rg, "0,000.####"));
	ns.print("Core Gain   : " + ns.nFormat(cg, "0,000.####"));
	ns.print("Level Cost   : " + ns.nFormat(lc, "$ 0,000.##"));
	ns.print("Ram Cost     : " + ns.nFormat(rc, "$ 0,000.##"));
	ns.print("Core Cost    : " + ns.nFormat(cc, "$ 0,000.##"));
	ns.print("Serv Cost    : " + ns.nFormat(nc, "$ 0,000.##"));
	ns.print("Home Amt     : " + ns.nFormat(serverMoney, "$ 0,000.##"));
}

function calculateTimeTill(ns, serverMoney, cost){
	var moneyLeft = cost - serverMoney;
	if(moneyLeft < 0 || isNaN(cost)){
		return 0;
	} 
	else{
		var prodPerSec = calculateNodeProd(ns);
		var seconds = Math.floor(moneyLeft / prodPerSec);
		return seconds;
	}
}

function worthWaitingForCore(ns, serverMoney, coreGain, coreCost, ramGain, ramCost, levelGain, levelCost){
	var timeToCore = calculateTimeTill(ns, serverMoney, coreCost);
	if(timeToCore < 60 && coreGain > ramGain && coreGain > levelGain){
		return true;
	}
	return false;
}
function worthWaitingForRam(ns, serverMoney, coreGain, coreCost, ramGain, ramCost, levelGain, levelCost){
	var timeToRam = calculateTimeTill(ns, serverMoney, ramCost);
	if(timeToRam < 40 && ramGain > levelGain){
		return true;
	}
	return false;
}
function worthWaitingForLevel(ns, serverMoney, coreGain, coreCost, ramGain, ramCost, levelGain, levelCost, nodeCost){
	// var timeToLevel = calculateTimeTill(ns, serverMoney, levelCost);
	return true;
}

function calculateNodeProd(ns){
	var nodes = ns.hacknet.numNodes();
	var total = 0;

	for(var k = 0; k < nodes; k++){
		total = total + ns.hacknet.getNodeStats(k).production;
	}

	return total;
}

function gainFromLevelUpgrade(X, Y, Z) {
	var calc = (1*1.6) * Math.pow(1.035,Y-1) * ((Z+5)/6);
    return roundNumber(calc, 4);
}
function gainFromRamUpgrade(X, Y, Z) {
	var calc = (X*1.6) * (Math.pow(1.035,(2*Y)-1) - Math.pow(1.035,Y-1)) * ((Z+5)/6);
	calc = roundNumber(calc, 4) + 0.0001;
    return calc;
}
function gainFromCoreUpgrade(X, Y, Z) {
	var calc = (X*1.6) * Math.pow(1.035,Y-1) * (1/6);
	calc = roundNumber(calc, 4) + 0.0002;
    return calc;
}

function roundNumber(num, dec) {
	return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

function weakestIndex(ns){
	var w = 0;
	for(var k = 0; k < ns.hacknet.numNodes(); k++){
		var pStats = ns.hacknet.getNodeStats(k);
		var cStats = ns.hacknet.getNodeStats(w);
		if(pStats.production < cStats.production){
			w = k;
		}
	}
	return w;
}

