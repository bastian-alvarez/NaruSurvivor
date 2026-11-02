import { SKILLS, DIFFICULTIES, BOSS_NAMES } from './data.js';
import { BALANCE } from './balance.js';
import { drawShinobi, drawHound, drawBijuu, drawTree, drawPond, drawRock, makeGround, drawLandmark } from './art.js';
export const WORLD=2600, DURATION=540;
const TAU=Math.PI*2;
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function rng(seed){return()=>{seed|=0;seed=seed+0x6d2b79f5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export class Game {
 constructor(character,difficulty='chunin',seed=Date.now()){
  this.character=character;this.difficulty=difficulty;this.rules=DIFFICULTIES[difficulty];this.random=rng(seed);
  this.time=0;this.level=1;this.xp=0;this.nextXp=BALANCE.startingXp;this.kills=0;this.status='playing';this.bossIndex=0;this.bossesDefeated=0;
  this.player={x:1300,y:1300,r:13,hp:character.hp,maxHp:character.hp,speed:character.speed,power:character.power||1,speedBoost:0,invulnerable:2,dash:0,dashCooldown:0,facing:1,moving:false};
  this.skills=[{id:character.skills[0],level:1,timer:.3}];this.enemies=[];this.shots=[];this.enemyShots=[];this.gems=[];this.effects=[];this.scrolls=[];this.pickups=[];this.obstacles=[];this.decor=[];this.landmarks=[];this.orbitHits=new Map();this.spawnTimer=0;this.scrollTimer=BALANCE.scrollInterval;this.pickupTimer=26;this.onEvent=()=>{};
  this.enemyId=0;this.generateMap();this.scrolls.push({x:1510,y:1280,r:15});this.pickups.push({x:1110,y:1370,r:16,type:'heart',life:150});
 }
 generateMap(){
  for(let i=0;i<175;i++){
   const x=100+this.random()*2400,y=100+this.random()*2400;
   if(Math.hypot(x-1300,y-1300)<220)continue;
   this.obstacles.push({x,y,r:i<11?43+this.random()*39:i<35?22+this.random()*20:15+this.random()*9,type:i<11?'water':i<35?'rock':'tree',seed:this.random()});
  }
  for(let i=0;i<1400;i++)this.decor.push({x:this.random()*WORLD,y:this.random()*WORLD,type:this.random(),size:this.random()});
  this.landmarks=[{x:1300,y:1000,type:'gate'},{x:900,y:1220,type:'sign'},{x:1640,y:1390,type:'lantern'},{x:1120,y:1610,type:'shrine'},{x:2040,y:890,type:'gate'},{x:600,y:1800,type:'lantern'}];
 }
 isBlocked(x,y,r=13){return x<r||y<r||x>WORLD-r||y>WORLD-r||this.obstacles.some(o=>Math.hypot(x-o.x,y-o.y)<r+o.r);}
 move(entity,dx,dy){
  // Substeps keep fast impulses from tunneling through small obstacles.
  const n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/8));
  for(let i=0;i<n;i++){if(!this.isBlocked(entity.x+dx/n,entity.y,entity.r))entity.x+=dx/n;if(!this.isBlocked(entity.x,entity.y+dy/n,entity.r))entity.y+=dy/n;}
 }
 addSkill(id){
  if(!this.character.skills.includes(id)||this.skills.some(s=>s.id===id)||this.skills.length>=3)return false;
  this.skills.push({id,level:1,timer:.3});return true;
 }
 replaceSkill(index,id){if(index<0||index>=this.skills.length||!this.character.skills.includes(id)||this.skills.some(s=>s.id===id))return false;this.skills[index]={id,level:1,timer:.3};return true;}
 upgrade(id){
  const s=this.skills.find(s=>s.id===id);if(s&&s.level<8)s.level++;
  else if(id==='power')this.player.power+=.12;
  else if(id==='vitality'){this.player.maxHp+=20;this.player.hp=Math.min(this.player.maxHp,this.player.hp+35);}
  else if(id==='speed')this.player.speed+=12;
  this.status='playing';this.player.invulnerable=1.4;
 }
 choices(){
  const pool=[...this.skills.filter(s=>s.level<8).map(s=>({id:s.id,level:s.level+1})),{id:'power'},{id:'vitality'},{id:'speed'}];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  // Always offer an owned jutsu until all of them are maxed.
  const skill=this.skills.find(s=>s.level<8);const list=pool.slice(0,3);if(skill&&!list.some(c=>SKILLS[c.id]))list[0]={id:skill.id,level:skill.level+1};return list;
 }
 collectXp(amount){this.xp+=amount;}
 dash(){const p=this.player;if(this.status!=='playing'||p.dashCooldown>0)return false;p.dash=.2;p.dashCooldown=3.5;p.invulnerable=Math.max(p.invulnerable,.3);this.onEvent('dash');return true;}
 spawnEnemy(boss=false){
  const p=this.player,a=this.random()*TAU,rad=boss?430:620;let x=clamp(p.x+Math.cos(a)*rad,30,WORLD-30),y=clamp(p.y+Math.sin(a)*rad,30,WORLD-30);
  if(this.isBlocked(x,y,boss?50:12)){for(let i=0;i<50;i++){x=30+this.random()*(WORLD-60);y=30+this.random()*(WORLD-60);if(!this.isBlocked(x,y,boss?50:12)&&Math.hypot(x-p.x,y-p.y)>260)break;}}
  const type=boss?'boss':this.random()<(this.time>15?.28:0)?'hound':this.random()<(this.time>45?.17:0)?'anbu':'ninja';
  const stats=BALANCE.enemies[type];
  const hp=(boss?2000+this.bossIndex*1700:stats.hp)*(1+(boss?0:this.time/250))*this.rules.hp;
  const enemy={id:++this.enemyId,x,y,r:boss?50:type==='hound'?11:13,type,hp,maxHp:hp,speed:boss?76:stats.speed,damage:(boss?33:stats.damage)*this.rules.damage,slow:0,flash:0,attackTimer:2,bossNumber:this.bossIndex,throwTimer:3+this.random()*2,windup:0,aim:0};
  this.enemies.push(enemy);if(boss){this.bossIndex++;this.onEvent('boss',BOSS_NAMES[this.bossIndex-1]);}return enemy;
 }
 hit(e,damage,color){if(e.hp<=0)return;e.hp-=damage;e.flash=.12;if(this.character.slow||['palm','tsukuyomi'].some(id=>this.skills.some(s=>s.id===id)))e.slow=1.1;
  this.effects.push({type:'number',x:e.x,y:e.y-15,text:Math.round(damage),color:color||'#f3e9b9',life:.55,maxLife:.55});
  if(e.hp<=0){this.kills++;if(e.type==='boss'){this.bossesDefeated++;this.player.hp=Math.min(this.player.maxHp,this.player.hp+BALANCE.bossHeal);this.onEvent('boss-defeated',BOSS_NAMES[e.bossNumber]);for(let i=0;i<10;i++)this.gems.push({x:e.x+(this.random()-.5)*80,y:e.y+(this.random()-.5)*80,value:BALANCE.bossXp/10});}else {this.gems.push({x:e.x,y:e.y,value:BALANCE.enemies[e.type].xp});if(this.random()<BALANCE.healChance)this.gems.push({x:e.x+6,y:e.y,value:0,heal:BALANCE.healAmount});}this.effects.push({type:'death',x:e.x,y:e.y,r:e.r,color:e.type==='boss'?'#eda25b':'#b6b894',life:.35,maxLife:.35});this.onEvent('kill');}
 }
 cast(s){
  const def=SKILLS[s.id],p=this.player,damage=def.damage*(1+(s.level-1)*.3)*p.power,color=def.color;
  const near=this.enemies.filter(e=>e.hp>0).sort((a,b)=>distance(a,p)-distance(b,p));
  if(def.type==='heal'){p.hp=Math.min(p.maxHp,p.hp+def.damage*s.level);this.effects.push({type:'ring',x:p.x,y:p.y,r:75,color,life:.5,maxLife:.5});return;}
  if(def.type==='shot'||def.type==='burst'){
   if(!near.length)return;
   const a=Math.atan2(near[0].y-p.y,near[0].x-p.x),count=def.type==='burst'?6+s.level*2:1+Math.floor((s.level-1)/3);
   for(let i=0;i<count;i++){const angle=def.type==='burst'?a+i/count*TAU:a+(i-(count-1)/2)*.2;this.shots.push({x:p.x,y:p.y,vx:Math.cos(angle)*360,vy:Math.sin(angle)*360,r:s.id==='katon'?16:10+s.level*.5,damage,color,life:2.2,hits:new Set(),maxHits:(def.type==='burst'?1:2)+Math.floor((s.level-1)/3),id:s.id});}
  }else if(def.type==='chain'){
   const targets=near.filter(e=>distance(e,p)<440).slice(0,3+Math.floor(s.level/2));let prev=p;
   for(const e of targets){this.hit(e,damage,color);this.effects.push({type:'line',x:prev.x,y:prev.y,x2:e.x,y2:e.y,color,life:.24,maxLife:.24});prev=e;}
  }else if(def.type==='aura'){
   const r=105+s.level*12;for(const e of near)if(distance(e,p)<r+e.r)this.hit(e,damage,color);
   this.effects.push({type:'ring',x:p.x,y:p.y,r,color,life:.5,maxLife:.5});
  }
 }
 update(dt,input={x:0,y:0}){
  if(this.status!=='playing')return;dt=Math.min(dt,.05);const p=this.player;this.time+=dt;
  if(this.xp>=this.nextXp){this.xp-=this.nextXp;this.level++;this.nextXp=BALANCE.levelXp(this.level);this.status='levelup';this.onEvent('levelup');return;}
  p.invulnerable=Math.max(0,p.invulnerable-dt);p.dashCooldown=Math.max(0,p.dashCooldown-dt);p.dash=Math.max(0,p.dash-dt);p.speedBoost=Math.max(0,p.speedBoost-dt);p.hp=Math.min(p.maxHp,p.hp+(this.character.regen||BALANCE.baseRegen)*dt);
  const len=Math.hypot(input.x,input.y)||1;const mx=input.x/Math.max(1,len),my=input.y/Math.max(1,len);p.moving=!!(mx||my);if(mx)p.facing=Math.sign(mx);
  this.move(p,mx*p.speed*(p.dash>0?3.5:p.speedBoost>0?1.35:1)*dt,my*p.speed*(p.dash>0?3.5:p.speedBoost>0?1.35:1)*dt);
  this.spawnTimer-=dt;if(this.spawnTimer<=0&&this.enemies.length<BALANCE.enemyCap){const n=Math.min(BALANCE.waveSize(this.time),BALANCE.enemyCap-this.enemies.length);for(let i=0;i<n;i++)this.spawnEnemy();this.spawnTimer=BALANCE.spawnInterval(this.time)/this.rules.spawn;}
  if(this.bossIndex<3&&this.time>=[150,330,480][this.bossIndex]&&!this.enemies.some(e=>e.type==='boss'&&e.hp>0))this.spawnEnemy(true);
  this.scrollTimer-=dt;if(this.scrollTimer<=0&&this.scrolls.length<5){const a=this.random()*TAU;let pos={x:clamp(p.x+Math.cos(a)*300,40,WORLD-40),y:clamp(p.y+Math.sin(a)*300,40,WORLD-40),r:15};if(!this.isBlocked(pos.x,pos.y,20))this.scrolls.push(pos);this.scrollTimer=BALANCE.scrollInterval;}
  this.pickupTimer-=dt;if(this.pickupTimer<=0){if(this.pickups.length<4){for(let i=0;i<12;i++){const a=this.random()*TAU,d=220+this.random()*280,pos={x:clamp(p.x+Math.cos(a)*d,40,WORLD-40),y:clamp(p.y+Math.sin(a)*d,40,WORLD-40),r:16,type:this.random()<.56?'heart':'wings',life:150};if(!this.isBlocked(pos.x,pos.y,20)){this.pickups.push(pos);break;}}}this.pickupTimer=43+this.random()*20;}
  for(const s of this.skills){s.timer-=dt;if(s.timer<=0){this.cast(s);s.timer=SKILLS[s.id].cooldown*(this.character.cooldown||1)/(1+(s.level-1)*.06);}}
  for(const e of this.enemies){if(e.hp<=0)continue;e.flash=Math.max(0,e.flash-dt);e.slow=Math.max(0,e.slow-dt);const a=Math.atan2(p.y-e.y,p.x-e.x),speed=e.speed*(1+this.time/900)*(e.slow>0?.4:1);
   this.move(e,Math.cos(a)*speed*dt,Math.sin(a)*speed*dt);
   // Tangential steering lets enemies find their way around ponds and boulders.
   if(this.isBlocked(e.x+Math.cos(a)*18,e.y+Math.sin(a)*18,e.r))this.move(e,-Math.sin(a)*speed*dt,Math.cos(a)*speed*dt);
   if(distance(e,p)<e.r+p.r&&p.invulnerable<=0){p.hp-=e.damage;p.invulnerable=BALANCE.contactGrace;this.onEvent('hurt');}
   if(e.type==='anbu'&&this.time>=45){e.throwTimer-=dt;if(e.windup>0){e.windup-=dt;if(e.windup<=0&&this.enemyShots.length<90){this.enemyShots.push({x:e.x,y:e.y,vx:Math.cos(e.aim)*245,vy:Math.sin(e.aim)*245,angle:e.aim,life:2.5,damage:14*this.rules.damage,r:5});}}else if(e.throwTimer<=0&&distance(e,p)<480){e.aim=Math.atan2(p.y-e.y,p.x-e.x);e.windup=.65;e.throwTimer=4.6;}}
   if(e.type==='boss'){e.attackTimer-=dt;if(e.attackTimer<=0){const count=[1,3,5][e.bossNumber];for(let i=0;i<count;i++){const angle=i/count*TAU;this.effects.push({type:'warning',x:clamp(p.x+(i?Math.cos(angle)*125:0),0,WORLD),y:clamp(p.y+(i?Math.sin(angle)*125:0),0,WORLD),r:e.bossNumber===0?110:70,life:1.35,maxLife:1.35,triggered:false,damage:e.damage});}e.attackTimer=4.5-e.bossNumber*.4;}}
  }
  for(const s of this.skills.filter(s=>SKILLS[s.id].type==='orbit')){const count=s.id==='clones'?2+Math.floor(s.level/3):2;for(let i=0;i<count;i++){const a=this.time*2+i/count*TAU,orb={x:p.x+Math.cos(a)*75,y:p.y+Math.sin(a)*75};for(const e of this.enemies){const key=s.id+':'+e.id;if(e.hp>0&&distance(e,orb)<e.r+19&&(this.orbitHits.get(key)||0)<this.time){this.hit(e,SKILLS[s.id].damage*(1+.3*(s.level-1))*p.power,SKILLS[s.id].color);this.orbitHits.set(key,this.time+.6);}}}}
  for(const shot of this.shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;for(const e of this.enemies){if(shot.hits.size>=shot.maxHits){shot.life=0;break;}if(e.hp>0&&!shot.hits.has(e.id)&&distance(e,shot)<e.r+shot.r){shot.hits.add(e.id);this.hit(e,shot.damage,shot.color);}}}
  for(const shot of this.enemyShots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;if(this.isBlocked(shot.x,shot.y,3))shot.life=0;if(shot.life>0&&distance(shot,p)<p.r+shot.r){shot.life=0;if(p.invulnerable<=0){p.hp-=shot.damage;p.invulnerable=BALANCE.projectileGrace;this.onEvent('hurt');}}}
  this.enemyShots=this.enemyShots.filter(s=>s.life>0);
  const magnet=80*(this.character.pickup||1);for(const g of this.gems){const d=distance(g,p);if(d<magnet){const a=Math.atan2(p.y-g.y,p.x-g.x);g.x+=Math.cos(a)*340*dt;g.y+=Math.sin(a)*340*dt;}if(d<20){if(g.heal)p.hp=Math.min(p.maxHp,p.hp+g.heal);else this.collectXp(g.value);g.collected=true;}}
  for(const scroll of this.scrolls){if(distance(scroll,p)<30){scroll.collected=true;this.status='scroll';this.onEvent('scroll');break;}}
  for(const item of this.pickups){item.life-=dt;if(distance(item,p)<30){item.collected=true;if(item.type==='heart'){const healed=Math.min(35,p.maxHp-p.hp);p.hp+=healed;this.onEvent('pickup',{type:'heart',amount:healed});}else{p.speedBoost=8;this.onEvent('pickup',{type:'wings',seconds:8});}}}
  for(const fx of this.effects){fx.life-=dt;if(fx.type==='warning'&&fx.life<=.2&&!fx.triggered){fx.triggered=true;if(distance(fx,p)<fx.r&&p.invulnerable<=0){p.hp-=fx.damage;p.invulnerable=.7;this.onEvent('hurt');}}}
  this.effects=this.effects.filter(f=>f.life>0).slice(-260);this.shots=this.shots.filter(s=>s.life>0);this.gems=this.gems.filter(g=>!g.collected);this.scrolls=this.scrolls.filter(s=>!s.collected);this.pickups=this.pickups.filter(s=>!s.collected&&s.life>0);
  const dead=new Set(this.enemies.filter(e=>e.hp<=0).map(e=>e.id));this.enemies=this.enemies.filter(e=>e.hp>0);for(const key of this.orbitHits.keys())if(dead.has(Number(key.split(':')[1])))this.orbitHits.delete(key);
  // Compact old gems into bundles without losing experience.
  if(this.gems.length>650){const old=this.gems.splice(0,300);const value=old.reduce((sum,g)=>sum+g.value,0);this.gems.push({x:old[0].x,y:old[0].y,value});}
  if(p.hp<=0){p.hp=0;this.status='defeat';this.onEvent('end',false);}else if(this.time>=DURATION&&this.bossesDefeated===3){this.status='victory';this.onEvent('end',true);}
 }
}

// All game art is drawn locally; the combat never depends on remote images.
export class Renderer {
 constructor(canvas,minimap){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.pixelCanvas=document.createElement('canvas');this.pixelCtx=this.pixelCanvas.getContext('2d');this.renderCtx=this.pixelCtx;this.pixelScale=1;this.minimap=minimap;this.mctx=minimap.getContext('2d');this.width=0;this.height=0;this.camera={x:0,y:0};this.shake=0;this.reducedMotion=false;}
 resize(){const dpr=Math.min(window.devicePixelRatio||1,2);this.width=innerWidth;this.height=innerHeight;this.canvas.width=this.width*dpr;this.canvas.height=this.height*dpr;this.ctx.setTransform(dpr,0,0,dpr,0,0);this.pixelScale=dpr/2;this.pixelCanvas.width=Math.ceil(this.width*this.pixelScale);this.pixelCanvas.height=Math.ceil(this.height*this.pixelScale);this.pixelCtx.imageSmoothingEnabled=false;this.pixelCtx.setTransform(this.pixelScale,0,0,this.pixelScale,0,0);}
 circle(x,y,r,fill,stroke){const c=this.renderCtx||this.ctx;c.beginPath();c.arc(x,y,r,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
 ninja(x,y,character,scale=1,time=0,moving=false,facing=1,enemy=false,flash=false){
  drawShinobi(this.renderCtx||this.ctx,x,y,character,scale,time,moving,facing,enemy,flash);
 }
 boss(e,time){drawBijuu(this.renderCtx||this.ctx,e,time);}
 draw(game){
  const c=this.pixelCtx;this.renderCtx=c;const p=game.player,w=this.width,h=this.height;const zoom=w<600?.9:1.1,vw=w/zoom,vh=h/zoom;
  this.camera={x:clamp(p.x-vw/2,-30,WORLD-vw+30),y:clamp(p.y-vh/2,-30,WORLD-vh+30)};const cam=this.camera;
  c.save();c.scale(zoom,zoom);if(this.shake>0&&!this.reducedMotion){c.translate((Math.random()-.5)*6,(Math.random()-.5)*6);this.shake-=.03;}c.translate(-cam.x,-cam.y);
  if(this.groundGame!==game){this.ground=makeGround(game,WORLD);this.groundGame=game;}
  c.fillStyle='#243e2d';c.fillRect(cam.x,cam.y,vw,vh);c.drawImage(this.ground,0,0);
  const visible=(o,r=130)=>o.x>cam.x-r&&o.x<cam.x+vw+r&&o.y>cam.y-r&&o.y<cam.y+vh+r;
  const trees=[];for(const o of game.obstacles){if(!visible(o))continue;if(o.type==='tree'){trees.push(o);c.save();c.fillStyle='#18342644';c.beginPath();c.ellipse(o.x+16,o.y+4,o.r*2.2,o.r*.85,-.35,0,TAU);c.fill();c.restore();}
   else if(o.type==='water')drawPond(c,o,game.time);else drawRock(c,o);
  }
  for(const o of game.landmarks)if(visible(o,150))drawLandmark(c,o,game.time);
  for(const gem of game.gems){if(!visible(gem,15))continue;c.save();c.translate(gem.x,gem.y);c.rotate(Math.PI/4);c.fillStyle=gem.heal?'#f1ae95':gem.value>4?'#c8b9f0':'#8ad8c6';c.fillRect(-3.5,-3.5,7,7);c.restore();}
  for(const s of game.scrolls){if(!visible(s,30))continue;this.circle(s.x,s.y,24,'#e9b65d14');c.save();c.translate(s.x,s.y+Math.sin(game.time*3)*3);c.fillStyle='#d9cba0';c.fillRect(-10,-9,20,18);c.fillStyle='#a85b42';c.fillRect(-13,-12,5,24);c.fillRect(8,-12,5,24);c.fillStyle='#655641';c.font='13px serif';c.textAlign='center';c.fillText('忍',0,5);c.restore();}
  for(const item of game.pickups){if(!visible(item,32))continue;const bob=Math.sin(game.time*4+item.x)*3;this.circle(item.x,item.y,25,item.type==='heart'?'#f17e6b28':'#91d4b326',item.type==='heart'?'#f19b80aa':'#9ee1bd99');c.save();c.translate(item.x,item.y+bob);c.textAlign='center';c.textBaseline='middle';c.font='bold 25px sans-serif';c.shadowColor=item.type==='heart'?'#f06e55':'#87e3b0';c.shadowBlur=15;c.fillStyle=item.type==='heart'?'#f28c78':'#a3e6b3';c.fillText(item.type==='heart'?'♥':'翼',0,1);c.restore();}
  for(const fx of game.effects.filter(f=>f.type==='warning')){this.circle(fx.x,fx.y,fx.r,`rgba(211,92,51,${.08+(1-fx.life/fx.maxLife)*.22})`,'#e59965');this.circle(fx.x,fx.y,fx.r*(1-fx.life/fx.maxLife),null,'#e9af7c');}
  const entities=[...game.enemies.filter(e=>visible(e,140)),{...p,type:'player'}].sort((a,b)=>a.y-b.y);
  for(const e of entities){if(e.type==='player'){
   c.save();if(p.invulnerable>0&&Math.floor(game.time*15)%2===0)c.globalAlpha=.55;
   this.ninja(p.x,p.y,game.character,1.13,game.time,p.moving,p.facing);c.restore();if(p.dash>0)this.circle(p.x,p.y,27,null,'#daf1b955');
  }else if(e.type==='boss')this.boss(e,game.time);
   else if(e.type==='hound')drawHound(c,{...e,facing:p.x>e.x?1:-1},game.time);
   else {this.ninja(e.x,e.y,{id:e.type==='anbu'?'anbu':'rogue',hair:'#303c42',outfit:e.type==='anbu'?'#525d66':'#3d5466',eyes:'#bd8567'},1.03,game.time,true,p.x>e.x?1:-1,true,e.flash>0);
    if(e.windup>0){c.save();c.setLineDash([4,4]);c.strokeStyle='#ef9d74aa';c.lineWidth=1.5;c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.x+Math.cos(e.aim)*200,e.y+Math.sin(e.aim)*200);c.stroke();c.restore();this.circle(e.x,e.y-48,4,'#efaa72');}
   }
   if(e.type!=='player'&&e.type!=='boss'&&e.hp<e.maxHp){c.fillStyle='#263229';c.fillRect(e.x-13,e.y-52,26,3);c.fillStyle='#cf8f65';c.fillRect(e.x-13,e.y-52,26*e.hp/e.maxHp,3);}
  }
  for(const s of game.skills.filter(s=>SKILLS[s.id].type==='orbit')){const def=SKILLS[s.id],count=s.id==='clones'?2+Math.floor(s.level/3):2;for(let i=0;i<count;i++){const a=game.time*2+i/count*TAU,x=p.x+Math.cos(a)*75,y=p.y+Math.sin(a)*75;if(s.id==='clones'){c.globalAlpha=.6;this.ninja(x,y,game.character,1.1,game.time,true);c.globalAlpha=1;}else{this.circle(x,y,14,def.color+'44',def.color);c.fillStyle=def.color;c.font='18px serif';c.textAlign='center';c.fillText(def.glyph,x,y+6);}}}
  for(const shot of game.shots){this.circle(shot.x,shot.y,shot.r+5,shot.color+'22');this.circle(shot.x,shot.y,shot.r,shot.color+'88');this.circle(shot.x,shot.y,shot.r*.55,'#ebf6d8');c.strokeStyle=shot.color;c.beginPath();c.moveTo(shot.x,shot.y);c.lineTo(shot.x-shot.vx*.055,shot.y-shot.vy*.055);c.stroke();}
  for(const shot of game.enemyShots){c.save();c.translate(shot.x,shot.y);c.rotate(shot.angle);c.strokeStyle='#f1bd8e';c.lineWidth=2;c.beginPath();c.moveTo(-20,0);c.lineTo(-7,0);c.stroke();c.fillStyle='#d8ded0';c.strokeStyle='#3a4650';c.lineWidth=1;c.beginPath();c.moveTo(10,0);c.lineTo(-3,-4);c.lineTo(-3,4);c.closePath();c.fill();c.stroke();c.restore();}
  for(const fx of game.effects){const t=fx.life/fx.maxLife;c.globalAlpha=t;
   if(fx.type==='ring'){c.lineWidth=3;this.circle(fx.x,fx.y,fx.r*(1-t*.7),fx.color+'15',fx.color);c.lineWidth=1;}
   if(fx.type==='line'){c.strokeStyle=fx.color;c.lineWidth=3;c.beginPath();c.moveTo(fx.x,fx.y);c.lineTo((fx.x+fx.x2)/2+15,(fx.y+fx.y2)/2-12);c.lineTo(fx.x2,fx.y2);c.stroke();c.lineWidth=1;}
   if(fx.type==='number'){c.font='bold 12px sans-serif';c.fillStyle=fx.color;c.textAlign='center';c.fillText(fx.text,fx.x,fx.y-(1-t)*20);}
   if(fx.type==='death'){this.circle(fx.x,fx.y,fx.r*(2-t),null,fx.color);}c.globalAlpha=1;
  }
  for(const tree of trees.sort((a,b)=>a.y-b.y)){drawTree(c,tree,distance(tree,p)<tree.r+62?.28:1);}
  // Drifting leaves and softly lit forest haze.
  if(!this.reducedMotion){for(let i=0;i<12;i++){const x=cam.x+((i*137+game.time*13)%vw),y=cam.y+((i*97+game.time*19)%vh);c.save();c.translate(x,y);c.rotate(game.time+i);c.fillStyle='#c6b36d88';c.fillRect(-2,-1,5,2);c.restore();}}
  c.restore();const vignette=c.createRadialGradient(w/2,h/2,h*.2,w/2,h/2,Math.max(w,h)*.65);vignette.addColorStop(0,'#09180e00');vignette.addColorStop(1,'#09180e88');c.fillStyle=vignette;c.fillRect(0,0,w,h);this.ctx.setTransform(Math.min(window.devicePixelRatio||1,2),0,0,Math.min(window.devicePixelRatio||1,2),0,0);this.ctx.imageSmoothingEnabled=false;this.ctx.clearRect(0,0,w,h);this.ctx.drawImage(this.pixelCanvas,0,0,w,h);this.renderCtx=c;this.drawMap(game);
 }
 drawMap(game){const c=this.mctx,s=150/WORLD;c.clearRect(0,0,150,150);c.fillStyle='#263d2a';c.fillRect(0,0,150,150);for(const o of game.obstacles){c.fillStyle=o.type==='water'?'#59988d':o.type==='rock'?'#889078':'#3b5c38';c.beginPath();c.arc(o.x*s,o.y*s,o.r*s+1,0,TAU);c.fill();}for(const scroll of game.scrolls){c.fillStyle='#e9ba68';c.fillRect(scroll.x*s-2,scroll.y*s-2,4,4);}for(const item of game.pickups){c.fillStyle=item.type==='heart'?'#ff917e':'#a5e6b3';c.beginPath();c.arc(item.x*s,item.y*s,3,0,TAU);c.fill();}for(const e of game.enemies.filter(e=>e.type==='boss')){c.fillStyle='#ef9467';c.beginPath();c.arc(e.x*s,e.y*s,4,0,TAU);c.fill();}c.fillStyle='#f2e8bd';c.beginPath();c.arc(game.player.x*s,game.player.y*s,3,0,TAU);c.fill();c.strokeStyle='#d3e3c13f';c.strokeRect(this.camera.x*s,this.camera.y*s,this.width/(this.width<600?.9:1.1)*s,this.height/(this.width<600?.9:1.1)*s);}
}
