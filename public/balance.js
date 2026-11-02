// Shared progression and combat rules for the current survival balance.
export const BALANCE={
 version:'1.3',startingXp:18,levelXp:level=>Math.round(20+level*9+Math.pow(level,1.45)),
 enemyCap:220,scrollInterval:75,bossHeal:25,bossXp:30,healChance:.018,healAmount:8,
 contactGrace:.55,projectileGrace:.4,baseRegen:.05,
 spawnInterval:time=>Math.max(.72,1.78-time/440),
 waveSize:time=>Math.min(12,1+Math.floor(time/30)),
 enemies:{ninja:{hp:46,damage:16,speed:90,xp:2},hound:{hp:32,damage:12,speed:145,xp:2},anbu:{hp:100,damage:22,speed:110,xp:3}}
};
