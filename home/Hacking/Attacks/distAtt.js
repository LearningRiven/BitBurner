export async function main(ns){
    var target = ns.args[0];
    var thr = ns.args[1];
    var action = ns.args[2];

    if(action === "grow"){
        await ns.grow(target,{
            threads : thr
        });
    }
    else if(action === "weaken"){
        await ns.weaken(target,{
            threads : thr
        });
    }
    else if(action === "hack"){
        await ns.hack(target,{
            threads : thr
        });
    }
}