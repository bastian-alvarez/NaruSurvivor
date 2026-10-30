// Original, locally drawn art. Static terrain and animation frames are cached.
const TAU=Math.PI*2, sprites=new Map();
const poly=(c,points,fill,stroke='#17221f',width=1.5)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}};
const ellipse=(c,x,y,rx,ry,fill,stroke)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}};
const line=(c,points,color,width=1.5)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();};
function random(seed){return()=>{seed|=0;seed=seed+0x6d2b79f5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function cloud(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-6,3);c.bezierCurveTo(-14,1,-10,-8,-4,-5);c.bezierCurveTo(0,-14,10,-10,9,-3);c.bezierCurveTo(17,-4,16,5,8,5);c.lineTo(-6,5);c.fillStyle='#bd4c43';c.fill();c.strokeStyle='#e6d4b6';c.lineWidth=1;c.stroke();c.restore();}
function leafMark(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);line(c,[[-4,2],[-8,5],[-6,0]],'#3e4d50',1);c.beginPath();c.arc(0,0,4,.7,TAU+.7);c.arc(1,0,1.6,0,Math.PI*1.6);c.strokeStyle='#3e4d50';c.lineWidth=1;c.stroke();c.restore();}
function shinobiFrame(character,phase,moving,enemy){
 const canvas=document.createElement('canvas');canvas.width=88;canvas.height=104;const c=canvas.getContext('2d');c.translate(44,76);
 const id=character.id||'rogue',anbu=id==='anbu',rogue=enemy&&!anbu,swing=moving?Math.sin(phase/8*TAU):0;
 const skin=enemy?'#cbb69d':'#efc7a0',outfit=character.outfit||'#354f64',hair=character.hair||'#26343a';c.lineJoin='round';
 // Bandana ribbons trail behind the shoulders.
 if(id==='naruto'||rogue){poly(c,[[-9,-29],[-21,-24],[-33,-29],[-19,-30]],'#27353e');poly(c,[[-8,-27],[-22,-18],[-29,-19],[-16,-28]],'#334953');}
 if(id==='itachi')poly(c,[[-14,-12],[-19,10],[18,10],[13,-12]],'#252832');
 // Alternating bent legs, shin wraps and open-toed sandals.
 for(const side of [-1,1]){c.save();c.translate(side*6,3);c.rotate(swing*side*.28);poly(c,[[-4,-3],[4,-3],[4,10],[0,16],[-5,12]],'#273849');poly(c,[[-4,8],[4,8],[3,14],[-5,14]],'#b5bfae');line(c,[[-4,10],[3,11]],'#677c75',1);poly(c,[[-5,14],[3,14],[6,18],[-7,18]],'#243c45');line(c,[[-4,17],[2,17]],skin,2);c.restore();}
 // Outline, torso shading, chest seam and hip pouch.
 poly(c,[[-9,-17],[9,-17],[14,-4],[12,6],[-12,6],[-14,-4]],outfit);
 poly(c,[[2,-16],[9,-17],[14,-4],[12,6],[4,6]],'#10232933',null);
 if(id==='naruto'){poly(c,[[-9,-17],[9,-17],[11,-7],[-11,-7]],'#252f36');line(c,[[0,-16],[0,6]],'#d9cfb7',1.8);poly(c,[[-9,-7],[-4,-7],[-4,5],[-11,5]],'#f3983f',null);}
 else if(id==='sasuke'){poly(c,[[-11,-18],[-2,-12],[0,-2],[3,-12],[11,-18],[9,-5],[0,2],[-9,-5]],'#c2c0ca');line(c,[[-14,3],[14,3]],'#9785b8',4);line(c,[[7,4],[12,11],[7,13],[3,7]],'#a08dc0',3);}
 else if(id==='sakura'){poly(c,[[-9,-17],[0,-13],[9,-17],[9,7],[-9,7]],'#b54462');line(c,[[0,-12],[0,7]],'#e7d5c0',1.5);poly(c,[[-9,4],[-3,4],[-5,12],[-13,12]],'#b54462');poly(c,[[9,4],[3,4],[5,12],[13,12]],'#943954');}
 else if(id==='hinata'){poly(c,[[-10,-18],[-3,-11],[0,-3],[3,-11],[10,-18],[12,-12],[4,-4],[-4,-4],[-12,-12]],'#e8dfcf');line(c,[[0,-3],[0,5]],'#7c7391',1.4);line(c,[[-7,-5],[-5,2]],'#a69cb8',2);}
 else if(id==='shikamaru'||anbu){poly(c,[[-10,-18],[-3,-15],[-3,6],[-12,6]],anbu?'#a8b1aa':'#6d855b');poly(c,[[10,-18],[3,-15],[3,6],[12,6]],anbu?'#89978f':'#8b9d6a');for(const x of [-7,7]){c.fillStyle='#344b3c';c.fillRect(x-2,-9,5,5);line(c,[[x-2,-6],[x+2,-6]],'#acb897',.8);}}
 else if(id==='itachi'){poly(c,[[-12,-18],[-1,-11],[1,8],[-15,8]],'#292a35');poly(c,[[12,-18],[1,-11],[1,8],[15,8]],'#36313b');line(c,[[-11,-17],[0,-10],[11,-17]],'#b0524b',3);cloud(c,-7,0,.5);cloud(c,8,5,.45);}
 else{line(c,[[-8,-16],[-8,4],[8,4],[8,-16]],'#526677',2);line(c,[[-11,3],[11,3]],'#292e3a',3);}
 c.fillStyle='#786f54';c.fillRect(10,0,6,7);line(c,[[11,1],[15,1]],'#a59670',1);
 // Arms swing independently; gloves and forearm wraps keep the pose readable.
 for(const side of [-1,1]){c.save();c.translate(side*12,-12);c.rotate(side*(.2+swing*.28));poly(c,[[-3,-2],[3,-2],[4,10],[-3,11]],outfit);poly(c,[[-3,6],[4,6],[4,11],[-3,12]],id==='sakura'?'#3b3442':'#c9c7ae');line(c,[[-2,8],[3,8]],'#829187',.8);ellipse(c,0,13,3.6,4,skin,'#35403a');if(side===1&&(enemy||id==='shikamaru')){line(c,[[2,13],[7,7]],'#2a333b',3);poly(c,[[7,7],[9,-2],[12,3]],'#a9babe');}c.restore();}
 // Hair behind the jaw: each playable silhouette is different.
 if(['itachi','hinata'].includes(id)){poly(c,[[-12,-35],[-16,-18],[-11,-11],[-8,-21],[8,-21],[11,-11],[16,-18],[12,-35]],hair);}
 if(id==='shikamaru'){poly(c,[[-5,-35],[-9,-45],[-5,-44],[-3,-53],[3,-49],[8,-53],[7,-43],[12,-44],[7,-34]],hair);line(c,[[-4,-37],[5,-37]],'#a1aa88',2);}
 poly(c,[[-11,-32],[-9,-20],[-4,-15],[4,-15],[10,-20],[12,-32],[7,-39],[-6,-39]],skin,'#27332f');
 poly(c,[[5,-36],[11,-31],[9,-21],[4,-16],[2,-22]],'#b67f6033',null);
 if(id==='naruto'){poly(c,[[-12,-29],[-17,-37],[-9,-37],[-11,-44],[-3,-42],[1,-49],[6,-42],[13,-45],[12,-36],[18,-36],[11,-29],[9,-36],[-8,-36]],'#eecb4d');line(c,[[-8,-41],[-3,-40]],'#fff2a0',1.2);}
 else if(id==='sakura'){poly(c,[[-12,-24],[-15,-34],[-10,-43],[0,-46],[12,-42],[15,-32],[11,-23],[7,-36],[2,-29],[-2,-38],[-9,-29]],'#eaa0af');line(c,[[-9,-41],[-1,-43],[8,-41]],'#ffc9cc',1.4);}
 else if(id==='sasuke'){poly(c,[[-11,-24],[-15,-31],[-12,-39],[-16,-42],[-5,-42],[1,-48],[6,-43],[15,-45],[12,-37],[16,-35],[9,-22],[8,-35],[2,-23],[0,-37],[-7,-25],[-7,-36]],'#252d41');line(c,[[-7,-40],[1,-42],[9,-39]],'#4b5268',1.3);}
 else if(id==='hinata'){poly(c,[[-13,-23],[-14,-35],[-8,-43],[7,-43],[14,-35],[13,-22],[9,-20],[8,-34],[4,-32],[-7,-32],[-9,-21]],'#343750');line(c,[[-9,-39],[7,-40]],'#606180',1.3);}
 else if(id==='itachi'){poly(c,[[-13,-17],[-15,-34],[-8,-43],[4,-44],[12,-37],[15,-18],[9,-23],[7,-36],[1,-26],[-2,-37],[-8,-23],[-9,-16]],'#252a36');line(c,[[-9,-39],[-2,-41],[9,-37]],'#4c4b60',1.2);}
 else{poly(c,[[-12,-29],[-14,-38],[-8,-43],[2,-45],[13,-39],[12,-30],[7,-36],[-7,-36]],hair);}
 // Forehead protector and recognisable eyes.
 if(id!=='sasuke'&&id!=='hinata'){poly(c,[[-11,-34],[11,-34],[10,-28],[-10,-28]],'#303b50');poly(c,[[-6,-34],[7,-34],[7,-28],[-6,-28]],'#aab8bb');leafMark(c,1,-31,.46);if(enemy)line(c,[[-7,-33],[7,-29]],'#4e5556',1);}
 if(anbu){poly(c,[[-11,-33],[-8,-21],[0,-15],[8,-21],[11,-33],[4,-38],[0,-34],[-5,-38]],'#e4e0cb');poly(c,[[-8,-30],[-2,-28],[-6,-25]],'#323947',null);poly(c,[[8,-30],[2,-28],[6,-25]],'#323947',null);line(c,[[-9,-32],[-6,-28],[-9,-23]],'#bd5e4a',1.5);line(c,[[8,-33],[5,-29],[9,-23]],'#bd5e4a',1.5);line(c,[[0,-22],[0,-18]],'#c36b56',1);}
 else{line(c,[[-8,-25],[-3,-24]],'#283232',1.5);line(c,[[3,-24],[8,-25]],'#283232',1.5);const eye=character.eyes||'#bb7360';c.fillStyle=eye;c.fillRect(-7,-24,4,2);c.fillRect(4,-24,4,2);if(id!=='hinata'){c.fillStyle='#233332';c.fillRect(-5,-24,1,2);c.fillRect(5,-24,1,2);}line(c,[[-2,-18],[3,-18]],'#9e6d55',.8);if(id==='naruto'){for(const y of [-21,-18]){line(c,[[-10,y],[-6,y+1]],'#9c7359',.7);line(c,[[6,y+1],[10,y]],'#9c7359',.7);}}if(rogue){poly(c,[[-10,-23],[10,-23],[8,-16],[0,-14],[-8,-16]],'#39464c');line(c,[[-8,-20],[8,-20]],'#5a6b6b',1);}}
 return canvas;
}
export function drawShinobi(c,x,y,character,scale,time,moving,facing=1,enemy=false,flash=false){
 const phase=moving?Math.floor(time*12)%8:0,key=`${character.id||'rogue'}:${phase}:${moving?1:0}:${flash?1:0}`;
 let sprite=sprites.get(key);if(!sprite){sprite=shinobiFrame(character,phase,moving,enemy);if(flash){const g=sprite.getContext('2d');g.globalCompositeOperation='source-atop';g.fillStyle='#fff4d9aa';g.fillRect(0,0,88,104);}sprites.set(key,sprite);}
 ellipse(c,x,y+14,17*scale,6*scale,'#10292277');c.save();c.translate(x,y);c.scale(scale*facing,scale);if(moving)c.translate(0,Math.sin(phase/8*TAU*2)*1.3);c.drawImage(sprite,-44,-76);c.restore();
}
export function drawHound(c,e,time){
 c.save();c.translate(e.x,e.y);c.scale(e.facing||1,1);const run=Math.sin(time*17),fur=e.flash?'#f3ddac':'#87908a';ellipse(c,0,9,22,6,'#12281f66');
 for(const [x,sign] of [[-12,-1],[-5,1],[8,1],[14,-1]]){line(c,[[x,1],[x+run*sign*4,10],[x+run*sign*4+4,12]],'#344a4b',4);}
 c.beginPath();c.moveTo(-17,-4);c.quadraticCurveTo(-33,-19,-26,-24);c.strokeStyle='#526b6a';c.lineWidth=6;c.stroke();
 poly(c,[[-19,-8],[-8,-16],[10,-12],[19,-3],[12,4],[-16,4]],fur);poly(c,[[-14,-11],[-7,-16],[9,-12],[10,-7],[-12,-5]],'#c7cdb9',null);
 poly(c,[[9,-13],[12,-28],[19,-19],[24,-23],[25,-10],[31,-6],[23,1],[12,-2]],fur);poly(c,[[13,-23],[15,-17],[18,-20]],'#c7ae9d',null);poly(c,[[21,-20],[21,-15],[24,-17]],'#c7ae9d',null);
 poly(c,[[12,-8],[23,-7],[26,-2],[17,1],[11,-2]],'#ac4940');line(c,[[15,0],[10,8],[17,6]],'#ab4a40',3);
 c.fillStyle='#c6cbbc';c.fillRect(15,-14,11,4);c.fillStyle='#34464a';c.fillRect(19,-12,2,2);line(c,[[25,-6],[29,-6]],'#1e3032',2);line(c,[[-12,-3],[-5,-1]],'#455d57',1.4);c.restore();
}
export function drawBijuu(c,e,time){
 c.save();c.translate(e.x,e.y);const n=e.bossNumber,color=e.flash?'#ffdfb0':['#bea574','#8f768b','#cd7c3f'][n],shade=['#82704b','#594f6b','#8b4931'][n];
 ellipse(c,0,35,70,24,'#13251c77');c.lineCap='round';
 for(let i=0;i<[1,8,9][n];i++){const a=n===0?-2.8:-Math.PI+.25+i/([1,8,9][n]-1)*(Math.PI-.5),tx=Math.cos(a)*(n===0?105:112),ty=Math.sin(a)*118;const sway=Math.sin(time*2+i)*9;
 c.beginPath();c.moveTo(i%2?20:-20,14);c.bezierCurveTo(tx*.65,ty*.3,tx+sway,ty-30,tx+sway,ty);c.strokeStyle='#2b302b';c.lineWidth=n===0?28:18;c.stroke();c.strokeStyle=color;c.lineWidth=n===0?23:14;c.stroke();c.strokeStyle=shade;c.lineWidth=3;c.stroke();
 if(n===1){for(let j=1;j<5;j++)ellipse(c,tx*.75+sway,ty*j/5,3,4,'#c7a5ac');}}
 for(const s of [-1,1]){poly(c,[[s*17,15],[s*40,20],[s*47,42],[s*26,43],[s*19,31]],color);for(let j=0;j<3;j++)line(c,[[s*(29+j*5),38],[s*(29+j*5),44]],'#e7d7b8',2);}
 ellipse(c,0,1,43,47,color,'#303129');ellipse(c,-12,-2,22,29,shade);ellipse(c,8,0,30,36,color);
 if(n===1){poly(c,[[-30,-34],[-46,-66],[-46,-82],[-38,-65],[-17,-39]],'#d7c5ad');poly(c,[[30,-34],[46,-66],[46,-82],[38,-65],[17,-39]],'#d7c5ad');}
 else{poly(c,[[-28,-36],[-32,-78],[-7,-52]],color);poly(c,[[28,-36],[32,-78],[7,-52]],color);poly(c,[[-25,-44],[-28,-67],[-14,-49]],shade,null);poly(c,[[25,-44],[28,-67],[14,-49]],shade,null);}
 poly(c,[[-31,-46],[-19,-60],[10,-60],[31,-46],[29,-22],[17,-8],[-16,-8],[-29,-24]],color,'#2c312b',2.5);
 poly(c,[[-25,-37],[-6,-31],[-19,-25]],'#f1dfac');poly(c,[[25,-37],[6,-31],[19,-25]],'#f1dfac');line(c,[[-16,-31],[-15,-27]],'#b45138',2);line(c,[[16,-31],[15,-27]],'#b45138',2);
 poly(c,[[-9,-23],[0,-27],[9,-23],[0,-16]],'#3b3330');line(c,[[-16,-15],[0,-10],[16,-15]],'#422e2c',2);for(const s of [-1,1])poly(c,[[s*8,-15],[s*13,-16],[s*10,-9]],'#eee0bd',null);
 if(n===0){const ink='#655170';for(let i=0;i<6;i++){c.beginPath();c.arc(i%2?17:-17,-44+i*10,5,0,Math.PI*1.6);c.strokeStyle=ink;c.lineWidth=2;c.stroke();}line(c,[[-8,-53],[0,-43],[8,-53]],ink,3);}
 if(n===1){line(c,[[-8,-52],[2,-47],[12,-51]],'#bca3af',3);ellipse(c,0,-12,11,9,'#b7a093');line(c,[[-7,-13],[7,-13]],'#655267',2);}
 if(n===2){for(const s of [-1,1])for(let j=0;j<3;j++)line(c,[[s*18,-23+j*5],[s*33,-27+j*7]],'#613529',2);line(c,[[-18,-48],[0,-40],[18,-48]],'#75422d',3);}c.restore();
}
export function makeGround(game,size){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const c=canvas.getContext('2d'),r=random(4179+Math.floor(game.obstacles[0]?.seed*9999||0));
 c.fillStyle='#405b38';c.fillRect(0,0,size,size);
 for(let i=0;i<500;i++){const x=r()*size,y=r()*size,rad=25+r()*95;const g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,i%3?'#173b2735':'#b8b36b20');g.addColorStop(1,'#405b3800');c.fillStyle=g;c.fillRect(x-rad,y-rad,rad*2,rad*2);}
 for(let i=0;i<38000;i++){c.fillStyle=['#8ba35b35','#263f2d44','#bfbb7123','#537c4733'][i%4];c.fillRect(r()*size,r()*size,1+r()*3,1+r()*4);}
 // A weathered dirt trail with uneven, feathered edges.
 for(const [width,color] of [[112,'#293b2b35'],[96,'#8c8b5e25'],[79,'#a195674a'],[60,'#a6996b3a']]){c.beginPath();c.moveTo(0,1200);c.bezierCurveTo(800,1050,1600,1650,2600,1100);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 for(let i=0;i<550;i++){const x=r()*size,y=r()*size;ellipse(c,x,y,10+r()*24,4+r()*9,'#233f2d16');}
 for(const d of game.decor){const{x,y}=d;if(d.type<.62){for(let j=0;j<3;j++)line(c,[[x+j*3,y+4],[x+j*3-2,y-3-j%2*4]],d.type<.3?'#71945299':'#294b3299',1.2);}else if(d.type<.76){ellipse(c,x,y,3+d.size*3,1.8,'#a0a88b55');line(c,[[x-2,y-1],[x+1,y-2]],'#d0c9a133',1);}else if(d.type>.96){line(c,[[x,y+3],[x,y-3]],'#739c59',1);for(let i=0;i<4;i++){const a=i*TAU/4;ellipse(c,x+Math.cos(a)*2,y-3+Math.sin(a)*2,1.8,1.4,d.type>.98?'#d8b4c2':'#e7ce8e');}ellipse(c,x,y-3,1,1,'#d9b25f');}else{c.save();c.translate(x,y);c.rotate(d.size*TAU);ellipse(c,0,0,3.8,1.5,d.type<.9?'#8e9a5777':'#c2a16588');c.restore();}}
 return canvas;
}
export function drawRock(c,o){const{x,y,r,seed}=o;c.save();c.translate(x,y);ellipse(c,4,7,r+7,r*.72,'#192f2455');const pts=Array.from({length:8},(_,i)=>{const a=i/8*TAU;return[Math.cos(a)*r*(.87+Math.sin(i*4+seed*8)*.1),Math.sin(a)*r*(.78+Math.cos(i*3)*.09)];});poly(c,pts,'#6c7d70','#35483c',2);poly(c,[pts[4],pts[5],pts[6],[r*.12,-r*.13],[-r*.35,r*.1]],'#9eaa93','#70816e',1);poly(c,[pts[6],pts[7],pts[0],[r*.12,-r*.13]],'#899b88',null);line(c,[[r*.12,-r*.1],[r*.22,r*.3],[r*.05,r*.5]],'#4b6052',1.4);
 for(let i=0;i<9;i++){const a=1.3+i*.17;ellipse(c,Math.cos(a)*r*.82,Math.sin(a)*r*.62,5+i%3,3,'#6e8853');}line(c,[[-r*.65,-r*.37],[-r*.25,-r*.48]],'#c7ceb144',1.5);c.restore();}
export function drawPond(c,o,time=0){const{x,y,r,seed}=o;c.save();c.translate(x,y);const outline=(s,fill)=>{const pts=Array.from({length:40},(_,i)=>{const a=i/40*TAU,radius=r*s*(.92+.045*Math.sin(a*5+seed*7)+.035*Math.cos(a*3));return[Math.cos(a)*radius,Math.sin(a)*radius];});poly(c,pts,fill,null);};outline(1.13,'#273f2d');outline(1.09,'#98906b');outline(1.04,'#617c58');outline(1,'#2c6264');outline(.87,'#397b78');outline(.62,'#468780');
 for(let i=0;i<7;i++){const yy=-r*.6+i*r*.18;line(c,[[-r*.48,yy],[r*.25+(i%3)*7,yy]],'#b8d3b22b',1.3);}for(let i=0;i<5;i++){const a=.5+i*.2;ellipse(c,Math.cos(a)*r*.64,Math.sin(a)*r*.62,5+i%2*3,4,'#80a268','#406c53');line(c,[[Math.cos(a)*r*.64,Math.sin(a)*r*.62],[Math.cos(a)*r*.64+4,Math.sin(a)*r*.62-2]],'#bdd29b',.7);}
 for(let i=0;i<10;i++){const a=2.1+i*.09,xx=Math.cos(a)*r*1.05,yy=Math.sin(a)*r*1.03;line(c,[[xx,yy],[xx+3,yy-11-i%3*3]],'#9ca76b',1.3);line(c,[[xx,yy],[xx-3,yy-8]],'#607d4e',1.3);}c.restore();}
export function drawTree(c,o,alpha=1){const{x,y,r,seed}=o;c.save();c.globalAlpha=alpha;c.translate(x,y);const s=seed*31;
 line(c,[[-9,5],[0,-8],[10,7]],'#4d4933',5);poly(c,[[-7,5],[-9,-29],[-3,-42],[8,-28],[7,5]],'#65533a','#38432c',2);line(c,[[-2,-31],[-1,1]],'#94764b',2);line(c,[[5,-24],[3,-8]],'#403c2b',1);
 const evergreen=seed>.62;
 if(evergreen){for(let i=0;i<4;i++){const yy=-14-i*15,w=r*(1.8-i*.3);poly(c,[[-w,yy+7],[-w*.65,yy-8],[-w*.45,yy-6],[0,yy-34],[w*.5,yy-6],[w*.66,yy-8],[w,yy+7],[w*.3,yy+4],[0,yy+10]],['#24462f','#2f5838','#416b40','#5a7f48'][i],'#203d2d',1);line(c,[[-w*.4,yy-2],[0,yy-20],[w*.2,yy-10]],'#9bb36b33',2);}}
 else{const lobes=[[-r*.8,-r*.9,r*.95], [r*.8,-r*1.15,r],[-r*.1,-r*1.8,r*1.3],[0,-r*.65,r*1.2]];for(let j=0;j<lobes.length;j++){const[lx,ly,lr]=lobes[j];const pts=Array.from({length:25},(_,i)=>{const a=i/25*TAU,rr=lr*(.9+.12*Math.sin(a*7+s+j));return[lx+Math.cos(a)*rr,ly+Math.sin(a)*rr*.8];});poly(c,pts,['#274b32','#315b38','#3b6840','#3d633b'][j],'#23402c',1.5);for(let i=0;i<10;i++){const a=i*2.4+s;ellipse(c,lx+Math.cos(a)*lr*.6,ly+Math.sin(a)*lr*.45,3+i%3,1.7,j===2?'#9ab96c55':'#7eaa5f44');}line(c,[[lx-lr*.5,ly-lr*.22],[lx-lr*.15,ly-lr*.5],[lx+lr*.25,ly-lr*.47]],'#9ebc6a33',2);}}
 c.restore();}
export function drawLandmark(c,o,time=0){c.save();c.translate(o.x,o.y);if(o.type==='gate'){ellipse(c,7,13,72,15,'#13281e55');for(const x of [-48,48]){poly(c,[[x-5,9],[x-5,-94],[x+5,-94],[x+5,9]],'#9b513b','#3b3c2d',2);c.fillStyle='#c18350';c.fillRect(x-3,-70,3,72);c.fillStyle='#3b4841';c.fillRect(x-9,4,18,8);}poly(c,[[-72,-101],[-38,-96],[38,-96],[72,-101],[68,-90],[34,-85],[-34,-85],[-68,-90]],'#444d42','#293a31',2);poly(c,[[-64,-88],[64,-88],[62,-79],[-62,-79]],'#ad5d42','#4c4030',2);c.fillStyle='#a45d40';c.fillRect(-58,-61,116,7);c.fillRect(-3,-78,6,26);line(c,[[-42,-65],[-22,-61],[0,-66],[22,-61],[42,-65]],'#ccbb8a',2);for(const x of [-23,20])poly(c,[[x,-63],[x+5,-60],[x+1,-50],[x+8,-48]],'#ded2ac',null);}
 else if(o.type==='sign'){line(c,[[0,8],[0,-42]],'#6c573b',7);poly(c,[[-25,-39],[17,-39],[28,-30],[18,-23],[-25,-23]],'#b79c6c','#5f533a',2);c.fillStyle='#4b5038';c.font='bold 9px serif';c.textAlign='center';c.fillText('木ノ葉',0,-28);}
 else if(o.type==='lantern'){ellipse(c,0,8,17,7,'#203f2b55');poly(c,[[-13,5],[13,5],[9,-1],[-9,-1]],'#7f8b76');c.fillStyle='#86927c';c.fillRect(-4,-22,8,23);poly(c,[[-12,-40],[12,-40],[10,-24],[-10,-24]],'#c3c19a','#4c624c');c.fillStyle='#e6c885';c.fillRect(-6,-36,12,9);poly(c,[[-18,-39],[0,-54],[18,-39]],'#687d66','#3d5341');ellipse(c,0,-29,25,20,'#efd88a0a');}
 else{poly(c,[[-31,7],[31,7],[31,-3],[-31,-3]],'#7d8b74');poly(c,[[-24,-3],[24,-3],[24,-40],[-24,-40]],'#956147');c.fillStyle='#473d32';c.fillRect(-12,-34,24,31);poly(c,[[-34,-37],[0,-63],[34,-37]],'#536c5c','#304b3a',2);line(c,[[-25,-40],[0,-56],[25,-40]],'#8f9b7a',2);c.fillStyle='#d8c593';c.fillRect(-5,-29,10,17);c.fillStyle='#5f664a';c.font='10px serif';c.textAlign='center';c.fillText('火',0,-17);}c.restore();}
