import { Game as Current } from '../public/engine.js';
import { CHARACTERS } from '../public/data.js';
const baseline=process.argv.includes('--baseline')?await import('../tmp/baseline/engine.js'):null;
const rows=[];
function evasive(g){
 const p=g.player,target=(g.skills.length<3?g.scrolls:[]).concat(g.gems).filter(o=>!o.heal).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]||{x:1300,y:1300};
 const nearby=g.enemies.filter(e=>Math.hypot(e.x-p.x,e.y-p.y)<240);let best={score:-Infinity,x:0,y:0};
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2,x=Math.cos(a),y=Math.sin(a),px=p.x+x*p.speed*.6,py=p.y+y*p.speed*.6;if(g.isBlocked(px,py,25)||g.isBlocked(p.x+x*25,p.y+y*25,15))continue;
  let score=-Math.hypot(px-target.x,py-target.y)*.32;
  for(const e of nearby){const d=Math.hypot(px-e.x,py-e.y);score-=Math.max(0,150-d)**2*.025;}
  if(score>best.score)best={score,x,y};
 }
 if(nearby.some(e=>Math.hypot(e.x-p.x,e.y-p.y)<50))g.dash();return best;
}
for(const [version,Engine] of [['1.0',baseline?.Game],['1.1',Current]]){
 if(!Engine)continue;
 const characters=version==='1.0'?(await import('../tmp/baseline/data.js')).CHARACTERS:CHARACTERS;
 for(const control of ['quieto','en movimiento','evasivo'])for(const seed of [42,123,456]){
  const g=new Engine(characters[0],'chunin',seed);let input={x:0,y:0},tick=0;
  while(g.time<240&&g.status!=='defeat'){
   if(g.status==='levelup'){g.upgrade(g.skills[0].level<8?g.skills[0].id:'power');}
   if(g.status==='scroll'){const next=g.character.skills.find(id=>!g.skills.some(s=>s.id===id));if(next&&g.skills.length<3)g.addSkill(next);g.status='playing';}
   if(control==='evasivo'&&tick++%4===0)input=evasive(g);
   g.update(.05,control==='quieto'?{x:0,y:0}:control==='evasivo'?input:{x:Math.cos(g.time*.35),y:Math.sin(g.time*.35)});
  }
  rows.push({version,control,seed,seconds:Math.round(g.time),level:g.level,kills:g.kills,result:g.status});
 }
}
console.table(rows);
