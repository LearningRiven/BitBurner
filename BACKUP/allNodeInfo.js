import * as nodeLoader from "/utils/nodeLoader.js";
import * as calc from "/utils/calculations.js";

export async function main(ns) {
	//First load all of the reachable nodes
	var reachableNodes = nodeLoader.loadReachableNodes(ns);

	//Port Data
	var pTitle = "Port Requirements";
	var pHeaders = []; var pValues = [];
	pHeaders.push("Needs 0: ");pValues.push(calc.gTotalWithProperty(reachableNodes, ["numOpenPortsRequired", "hasAdminRights"], [0, false], "Has Been Rooted"));
	pHeaders.push("Needs 1: ");pValues.push(calc.gTotalWithProperty(reachableNodes, ["numOpenPortsRequired", "hasAdminRights"], [1, false], "Has Been Rooted"));
	pHeaders.push("Needs 2: ");pValues.push(calc.gTotalWithProperty(reachableNodes, ["numOpenPortsRequired", "hasAdminRights"], [2, false], "Has Been Rooted"));
	pHeaders.push("Needs 3: ");pValues.push(calc.gTotalWithProperty(reachableNodes, ["numOpenPortsRequired", "hasAdminRights"], [3, false], "Has Been Rooted"));
	pHeaders.push("Needs 4: ");pValues.push(calc.gTotalWithProperty(reachableNodes, ["numOpenPortsRequired", "hasAdminRights"], [4, false], "Has Been Rooted"));
	pHeaders.push("Needs 5: ");pValues.push(calc.gTotalWithProperty(reachableNodes, ["numOpenPortsRequired", "hasAdminRights"], [5, false], "Has Been Rooted"));
	pHeaders.push("Needs 6: ");pValues.push(calc.gTotalWithProperty(reachableNodes, ["numOpenPortsRequired", "hasAdminRights"], [6, false], "Doesnt Exist/Not Discovered"));

	//Totals
	var totTitle = "Totals";
	var totHeaders = []; var totValues = [];
	totHeaders.push("Total Bought: "); 				totValues.push(calc.gTotalWithProperty(reachableNodes, ["purchasedByPlayer"], [true], "None Bought"));
	totHeaders.push("Total Hacked: "); 				totValues.push(calc.gTotalWithProperty(reachableNodes, ["purchasedByPlayer", "hasAdminRights"], [false,true], "None Hacked"));
	totHeaders.push("Total Left To Be Hacked: "); 	totValues.push(calc.gTotalWithProperty(reachableNodes, ["purchasedByPlayer", "hasAdminRights"], [false,false], "None Left"));
	totHeaders.push("Total Reachable: "); 			totValues.push(reachableNodes.length);

	var pData = generateMsg(pTitle, pHeaders, pValues, titleFormat(), headerFormat(), valueFormat());
	var totals = generateMsg(totTitle, totHeaders, totValues, titleFormat(), headerFormat(), valueFormat());

	ns.tprint(pData + totals);
}

function titleFormat(){
	return {};
}

function headerFormat(){
	return {};
}

function valueFormat(){
	return {};
}

/**
 * ENGINE BELOW
 */

function generateMsg(title, headers, values, tOptions, hOptions, vOptions){
	var finalMessage = createTitle(title, false);
	var temp = "";
	for(var k = 0; k < headers.length; k++){
		temp = temp + createHeader(headers[k], false) + createValue(values[k], false);
	}
	finalMessage = finalMessage + temp;
	return finalMessage + "\n";
}

function createTitle(title, options){
	if(!options){
		title = stringLoop(5, "=") + title;
		var max = 30;
		if(title.length < max){
			max = max - title.length;
			title = title + stringLoop(max, "=");
		}
		title = "\n" + title + "\n";
	}
	else{
		//TODO
	}
	return title;
}

function createHeader(header, options){
	if(!options){
		header = stringLoop(4, "|") + header;
	}
	else{
		//TODO
	}
	return header;
}

function createValue(value, options){
	if(!options){
		value = value + "\n";
	}
	else{
		//TODO
	}
	return value;
}

function stringLoop(amt, c){
	var str = "";
	for(var k = 0; k < amt; k++){
		str = c + str;
	}
	return str;
}