// Shared progression and combat rules for the current survival balance.
export const BALANCE={
 version:'1.1',startingXp:18,levelXp:level=>Math.round(20+level*9+Math.pow(level,1.45)),
 enemyCap:220,scrollInterval:75,bossHeal:25,bossXp:30,healChance:.018,healAmount:8,
 contactGrace:.55,projectileGrace:.4,baseRegen:.05,
 spawnInterval:time=>Math.max(.58,1.45-time/420),
 waveSize:time=>Math.min(12,1+Math.floor(time/30)),
 enemies:{ninja:{hp:55,damage:18,speed:90,xp:1},hound:{hp:38,damage:14,speed:145,xp:1},anbu:{hp:120,damage:25,speed:110,xp:2}}
};
