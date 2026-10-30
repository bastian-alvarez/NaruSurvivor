export const SKILLS = {
 rasengan:{name:'Rasengan',glyph:'◉',color:'#7cdeed',type:'shot',damage:25,cooldown:1.05,description:'Una esfera de chakra que atraviesa a los enemigos.'},
 clones:{name:'Clones de sombra',glyph:'影',color:'#efad57',type:'orbit',damage:17,cooldown:1.2,description:'Clones giran a tu alrededor y golpean a los enemigos.'},
 rasenshuriken:{name:'Rasenshuriken',glyph:'✣',color:'#b8f0db',type:'burst',damage:35,cooldown:2.9,description:'Libera hojas de viento en todas las direcciones.'},
 chidori:{name:'Chidori',glyph:'ϟ',color:'#a9c8ff',type:'chain',damage:32,cooldown:1.3,description:'Un relámpago salta entre varios enemigos cercanos.'},
 katon:{name:'Bola de fuego',glyph:'火',color:'#ff9d57',type:'shot',damage:35,cooldown:1.4,description:'Una bola de fuego de gran tamaño atraviesa la horda.'},
 susanoo:{name:'Susanoo',glyph:'甲',color:'#bd91ef',type:'aura',damage:23,cooldown:2,description:'Un guardián de chakra golpea en un amplio radio.'},
 punch:{name:'Impacto de cerezo',glyph:'✿',color:'#f4a0bc',type:'aura',damage:40,cooldown:1.25,description:'Golpes de fuerza extraordinaria que sacuden el suelo.'},
 heal:{name:'Ninjutsu médico',glyph:'✚',color:'#94e6a3',type:'heal',damage:9,cooldown:5,description:'Recupera vida periódicamente para resistir más tiempo.'},
 byakugo:{name:'Sello Byakugō',glyph:'◆',color:'#e5a4f0',type:'orbit',damage:26,cooldown:1.1,description:'Un manto de fuerza concentrada protege tu perímetro.'},
 palm:{name:'Palma suave',glyph:'掌',color:'#c9c5ff',type:'chain',damage:24,cooldown:1.05,description:'Golpes precisos encadenados que bloquean al enemigo.'},
 rotation:{name:'Rotación celestial',glyph:'◎',color:'#bfecff',type:'aura',damage:30,cooldown:1.6,description:'Una cúpula de chakra golpea a todos los enemigos cercanos.'},
 lions:{name:'Leones gemelos',glyph:'双',color:'#91b3ff',type:'orbit',damage:29,cooldown:1.2,description:'Dos puños de chakra giran alrededor de Hinata.'},
 shadow:{name:'Posesión de sombra',glyph:'影',color:'#b0bb90',type:'chain',damage:23,cooldown:1.2,description:'La sombra atrapa y ralentiza a varios enemigos.'},
 needles:{name:'Costura de sombras',glyph:'✦',color:'#d1d8a8',type:'burst',damage:26,cooldown:2,description:'Agujas de sombra se disparan en todas las direcciones.'},
 trap:{name:'Trampa explosiva',glyph:'爆',color:'#e1ad6e',type:'aura',damage:43,cooldown:2.4,description:'Sellos explosivos detonan alrededor del shinobi.'},
 amaterasu:{name:'Amaterasu',glyph:'炎',color:'#d798b4',type:'shot',damage:35,cooldown:1.25,description:'Llamas oscuras que atraviesan a los enemigos.'},
 crows:{name:'Cuervos de ilusión',glyph:'羽',color:'#b9a3d1',type:'orbit',damage:20,cooldown:1.2,description:'Cuervos de genjutsu patrullan tu perímetro.'},
 tsukuyomi:{name:'Tsukuyomi',glyph:'月',color:'#ef9294',type:'aura',damage:40,cooldown:2.5,description:'Una ilusión lunar daña e inmoviliza a la horda.'},
 barrage:{name:'Ráfaga Uzumaki',glyph:'連',color:'#f4bd71',type:'aura',damage:36,cooldown:1.5,description:'Una combinación de taijutsu golpea a los enemigos cercanos.'},
 kirin:{name:'Kirin',glyph:'雷',color:'#b9ddff',type:'burst',damage:40,cooldown:3.2,description:'Una tormenta de rayos se extiende por el campo de batalla.'},
 fracture:{name:'Ruptura del suelo',glyph:'砕',color:'#d5ae97',type:'burst',damage:32,cooldown:2.7,description:'El terreno se fractura y lanza escombros alrededor de Sakura.'},
 airpalm:{name:'Palma de vacío',glyph:'空',color:'#bde2ff',type:'shot',damage:33,cooldown:1.25,description:'Una corriente de chakra alcanza a enemigos a distancia.'},
 strangling:{name:'Estrangulación',glyph:'縛',color:'#bbc6a3',type:'shot',damage:34,cooldown:1.4,description:'Una sombra concentrada atraviesa a los enemigos.'},
 shuriken:{name:'Shuriken Uchiha',glyph:'✥',color:'#d1c5c1',type:'burst',damage:25,cooldown:1.9,description:'Un abanico de shuriken corta el avance de la horda.'}
};
export const CHARACTERS = [
 {id:'naruto',name:'Naruto',surname:'UZUMAKI',kanji:'うずまき',role:'Ofensivo',color:'#e6a451',hair:'#efc852',outfit:'#e17b35',eyes:'#6baed0',skills:['rasengan','clones','rasenshuriken'],hp:110,speed:185,passive:'Voluntad de fuego',description:'Su enorme reserva de chakra aumenta un 12% el daño de sus jutsus.',power:1.12},
 {id:'sasuke',name:'Sasuke',surname:'UCHIHA',kanji:'うちは',role:'Daño explosivo',color:'#a994d1',hair:'#252834',outfit:'#65647d',eyes:'#d8636b',skills:['chidori','katon','susanoo'],hp:95,speed:192,passive:'Prodigio Uchiha',description:'Ejecuta sus técnicas un 15% más rápido.',cooldown:.85},
 {id:'sakura',name:'Sakura',surname:'HARUNO',kanji:'はるの',role:'Fuerza y curación',color:'#d992a6',hair:'#e1a0ac',outfit:'#ac4f64',eyes:'#95bf99',skills:['punch','heal','byakugo'],hp:145,speed:174,passive:'Control de chakra',description:'Mayor vitalidad y recuperación natural de 0,6 puntos de vida por segundo.',regen:.6},
 {id:'hinata',name:'Hinata',surname:'HYŪGA',kanji:'ひゅうが',role:'Defensa y precisión',color:'#afb6d7',hair:'#34364f',outfit:'#b9adc5',eyes:'#ede8f6',skills:['palm','rotation','lions'],hp:115,speed:181,passive:'Ojos que todo lo ven',description:'Su Byakugan amplía un 40% el radio de recogida de experiencia.',pickup:1.4},
 {id:'shikamaru',name:'Shikamaru',surname:'NARA',kanji:'なら',role:'Control de masas',color:'#a2b486',hair:'#292f2a',outfit:'#6c8058',eyes:'#727563',skills:['shadow','needles','trap'],hp:105,speed:182,passive:'Estratega de la Hoja',description:'Las técnicas de sombra ralentizan a los enemigos alcanzados.',slow:true},
 {id:'itachi',name:'Itachi',surname:'UCHIHA',kanji:'うちは',role:'Genjutsu y control',color:'#c58279',hair:'#303036',outfit:'#38333a',eyes:'#d46a67',skills:['amaterasu','crows','tsukuyomi'],hp:90,speed:188,passive:'El peso del Sharingan',description:'Sus jutsus infligen un 20% más de daño.',power:1.2}
];
const extra=['barrage','kirin','fracture','airpalm','strangling','shuriken'];
CHARACTERS.forEach((c,i)=>c.skills.push(extra[i]));
export const DIFFICULTIES={genin:{name:'Genin',hp:.72,damage:.6,spawn:.8,description:'Una primera prueba. Mantente en movimiento.'},chunin:{name:'Chūnin',hp:1,damage:1,spawn:1,description:'Hordas letales. Cada mejora cuenta.'},jonin:{name:'Jōnin',hp:1.35,damage:1.35,spawn:1.35,description:'Sin margen de error. Sobrevive a la élite.'}};
export const BOSS_NAMES=['Shukaku','Gyūki','Kurama'];
export { portrait } from './portraits.js';
