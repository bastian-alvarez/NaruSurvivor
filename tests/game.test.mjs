import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, DURATION, WORLD } from '../public/engine.js';
import { CHARACTERS, SKILLS } from '../public/data.js';
import { BALANCE } from '../public/balance.js';

test('los seis shinobis tienen cuatro técnicas propias y una inicial',()=>{
 assert.equal(CHARACTERS.length,6);
 for(const c of CHARACTERS){assert.equal(new Set(c.skills).size,4);for(const id of c.skills)assert.ok(SKILLS[id]);const g=new Game(c,'chunin',42);assert.equal(g.skills[0].id,c.skills[0]);assert.equal(g.isBlocked(g.player.x,g.player.y),false);}
});
test('el inventario no supera tres jutsus y permite reemplazar uno',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);assert.ok(g.addSkill('clones'));assert.ok(g.addSkill('rasenshuriken'));assert.equal(g.addSkill('barrage'),false);assert.ok(g.replaceSkill(1,'barrage'));assert.equal(g.skills.length,3);assert.equal(g.skills[1].id,'barrage');assert.equal(g.addSkill('katon'),false);assert.equal(g.replaceSkill(1,'katon'),false);
});
test('el impulso no atraviesa obstáculos ni límites del mapa',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);g.obstacles=[{x:1350,y:1300,r:20,type:'rock'}];g.move(g.player,400,0);assert.ok(g.player.x<1318);g.player.x=WORLD-15;g.move(g.player,400,0);assert.ok(g.player.x<=WORLD-g.player.r);
});
test('los suministros curan vida y dan velocidad breve; las oleadas y golpes son más moderados',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);assert.ok(BALANCE.spawnInterval(0)>1.45);assert.ok(BALANCE.enemies.ninja.damage<18);assert.ok(BALANCE.enemies.hound.damage<14);assert.ok(BALANCE.enemies.anbu.damage<25);
 g.obstacles=[];g.player.hp=50;g.spawnTimer=100;g.scrollTimer=100;g.pickups=[{x:g.player.x,y:g.player.y,r:16,type:'heart',life:20}];let found;g.onEvent=(name,data)=>{if(name==='pickup')found=data;};g.update(.05);assert.ok(g.player.hp>=85&&g.player.hp<86);assert.equal(found.type,'heart');
 g.pickups=[{x:g.player.x,y:g.player.y,r:16,type:'wings',life:20}];g.update(.05);assert.equal(g.player.speedBoost,8);const before=g.player.x;g.update(.1,{x:1,y:0});assert.ok(g.player.x-before>g.player.speed*.05);for(let i=0;i<161;i++)g.update(.05);assert.equal(g.player.speedBoost,0);
});
test('recoger experiencia sube de nivel y pausa hasta elegir una mejora',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);g.collectXp(g.nextXp);g.update(.016);assert.equal(g.level,2);assert.equal(g.status,'levelup');const t=g.time;g.update(.05);assert.equal(g.time,t);g.upgrade('rasengan');assert.equal(g.skills[0].level,2);assert.equal(g.status,'playing');assert.equal(g.choices().length,3);
});
test('derrotar enemigos genera experiencia y los jefes se sellan',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);const e=g.spawnEnemy();g.hit(e,e.hp+1);assert.equal(g.kills,1);assert.ok(g.gems.length>0);const b=g.spawnEnemy(true);g.hit(b,b.hp+1);assert.equal(g.bossesDefeated,1);
});
test('la victoria requiere nueve minutos y tres bijū derrotados',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);g.time=DURATION;g.bossIndex=3;g.update(.016);assert.equal(g.status,'playing');g.bossesDefeated=3;g.update(.016);assert.equal(g.status,'victory');
});
test('los tres jefes aparecen por orden y tienen patrones de ataque distintos',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);g.scrolls=[];g.obstacles=[];
 for(const [i,time] of [150,330,480].entries()){g.time=time;g.update(.016);const boss=g.enemies.find(e=>e.type==='boss');assert.ok(boss);assert.equal(boss.bossNumber,i);boss.attackTimer=0;g.update(.016);assert.equal(g.effects.filter(f=>f.type==='warning').length,[1,3,5][i]);g.effects=[];g.hit(boss,boss.hp+1);g.enemies=[];}
 assert.equal(g.bossesDefeated,3);
});
test('simulación de combate de un minuto mantiene valores válidos',()=>{
 for(const c of CHARACTERS){const g=new Game(c,'genin',123);g.player.hp=g.player.maxHp=100000;g.scrolls=[];for(let i=0;i<1200;i++){if(g.status==='levelup')g.upgrade(g.skills[0].level<8?g.skills[0].id:'power');if(g.status==='scroll')g.status='playing';g.update(.05,{x:Math.sin(i/35),y:Math.cos(i/35)});}assert.ok(Number.isFinite(g.player.x));assert.ok(g.kills>0,`${c.id} debe poder derrotar enemigos`);assert.ok(g.enemies.length<250);assert.ok(g.skills[0].level<=8);}
});
test('la experiencia escasa exige más bajas y no permite saltarse niveles',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);g.enemies=[];
 for(let i=0;i<18;i++){const e=g.spawnEnemy();e.type='ninja';g.hit(e,e.hp+1);}
 assert.equal(g.gems.filter(g=>!g.heal).reduce((n,g)=>n+g.value,0),18);
 g.collectXp(17);g.update(.016);assert.equal(g.level,1);g.collectXp(1);g.update(.016);assert.equal(g.level,2);assert.ok(g.nextXp>35);
});
test('un proyectil consume su penetración sin dañar a toda una fila',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);g.obstacles=[];g.spawnTimer=100;g.scrolls=[];g.skills[0].timer=100;
 for(let i=0;i<5;i++){const e=g.spawnEnemy();e.x=1400;e.y=1300;e.hp=e.maxHp=100;e.speed=0;}
 g.shots=[{x:1400,y:1300,vx:0,vy:0,r:14,damage:30,color:'#fff',life:2,hits:new Set(),maxHits:2}];g.update(.016);
 assert.equal(g.enemies.filter(e=>e.hp<100).length,2);assert.equal(g.shots.length,0);
});
test('los ANBU avisan antes de disparar y el kunai se bloquea con terreno',()=>{
 const g=new Game(CHARACTERS[0],'chunin',42);g.time=50;g.obstacles=[];g.scrolls=[];g.spawnTimer=100;g.skills[0].timer=100;
 const e=g.spawnEnemy();e.type='anbu';e.x=g.player.x+180;e.y=g.player.y;e.throwTimer=0;e.speed=0;
 g.update(.05);assert.ok(e.windup>0);assert.equal(g.enemyShots.length,0);
 for(let i=0;i<14;i++)g.update(.05);assert.equal(g.enemyShots.length,1);
 const shot=g.enemyShots[0];g.obstacles=[{x:shot.x+shot.vx*.05,y:shot.y+shot.vy*.05,r:20}];g.update(.05);assert.equal(g.enemyShots.length,0);
});
test('quedarse quieto en Chūnin es peligroso para todos los shinobis',()=>{
 for(const c of CHARACTERS){const g=new Game(c,'chunin',123);g.scrolls=[];
  for(let i=0;i<1800&&g.status!=='defeat';i++){if(g.status==='levelup')g.upgrade('vitality');g.update(.05);}
  assert.equal(g.status,'defeat',`${c.name} debe necesitar moverse para sobrevivir`);assert.ok(g.time<90);
 }
});
