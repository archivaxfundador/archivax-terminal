// ARCHIVAX DB 4000 FRASES - CONTAINER OCULTO
const ARCHIVAX_DB = (() => {
 const N=["Elena","Marta","Lucia","Rosa","Ana","Isabel","Teresa","Nelida","Sofia","Carmen","Juana","Olga","Mirta","Susana","Silvia","Laura","Claudia","Patricia","Alejandra","Veronica","Gabriela"];
 const nena=["Sofi","Luna","Mia","Emma","Martu","Cata","Luli","Alma","Pili","Vicky","Agus","Mili","Uma","Zoe","Nina","Lola"];
 const nene=["Benja","Tomi","Mateo","Thiago","Bauti","Santi","Nico","Lauti","Facu","Joaco","Juan","Lucas","Valen","Toto","Nacho"];
 const A=["Gomez","Perez","Rodriguez","Lopez","Garcia","Martinez","Diaz","Sosa","Acosta","Fernandez","Gonzalez"];
 const M=["me ahogue en el rio","me queme viva","me atropellaron en la ruta","me dispararon","me cai del techo","me ahorcaron en el sotano","me apunalaron","me envenenaron","me enterraron viva"];
 const L=["en el rio","en esta casa","en el patio del fondo","en el sotano","en la ruta 2","en el bano de arriba","debajo de la cama","detras de la pared","en el espejo del pasillo","en el altillo","en el pozo","aca mismo donde estas parado"];
 const V=["ayudame","buscame","escuchame","mirame","encontrame","perdoname","sacame de aca"];
 const E=["MUERTE","MORIRAS","TE MATARE","DETRAS DE TI","TE TENGO","TE VEO","NO SALDRAS VIVO","SANGRE","TE ENCONTRE","ERES MIO","CORRE AHORA","TE SIGO A TODOS LADOS","TE QUEDAS CONMIGO"];
 const H=[{he:"אהרוג אותך",es:"TE MATARE"},{he:"תמות",es:"MORIRAS"},{he:"מצאתי אותך",es:"TE ENCONTRE"},{he:"יש לי אותך",es:"TE TENGO"},{he:"לא תברח ממני",es:"NO ESCAPARAS"},{he:"הנשמה שלך שלי",es:"TU ALMA ES MIA"},{he:"אתה כבר מת",es:"YA ESTAS MUERTO"}];
 const G=["HIJO DE PUTA","TE VOY A MATAR","DESGRACIADO","TE VOY A AHOGAR","PEDAZO DE MIERDA","LA CONCHA DE TU MADRE","TE VOY A DEGOLLAR","TE ARRANCO LA CABEZA","TE HUNDO EN EL POZO","MORITE DESGRACIADO","TE ESTRANGULO","TE QUEMO VIVO","PUTA","FORRO","SORETE","TE ABRO AL MEDIO","TE ROMPO TODO","GIL DE MIERDA","TE HAGO MIERDA","TE VOY A HACER SUFRIR","LLORAME HIJO DE PUTA","VENI QUE TE MATO","TE ESPERO EN EL SOTANO PARA MATARTE"];
 const R=(a)=>a[Math.floor(Math.random()*a.length)];
 let db=[];
 for(let i=0;i<800;i++) db.push({tipo:"mujer", texto:`${R(["me llamo","soy","mi nombre era"])} ${R(N)} ${R(A)} y ${R(M)} ${R(L)}`});
 for(let i=0;i<500;i++) db.push({tipo:"nena", texto:`mami? soy ${R(nena)} tengo ${Math.floor(Math.random()*6)+4} anos, ${R(M)} ${R(L)}`});
 for(let i=0;i<500;i++) db.push({tipo:"nene", texto:`papa? soy ${R(nene)} ${R(M)} ${R(L)} ${R(V)}`});
 for(let i=0;i<300;i++) db.push({tipo:"llorando", texto:`*llorando* ${R(V)}... ${R(M)} ${R(L)}`});
 for(let i=0;i<400;i++) db.push({tipo:"extrema", texto:`${R(E)} ${R(L).toUpperCase()}`});
 for(let i=0;i<300;i++){ let h=R(H); db.push({tipo:"hebrea", texto:h.he, traduccion:h.es}); }
 for(let i=0;i<1200;i++){
   let insulto = R(G);
   let extra = Math.random()<0.6? ` ${R(L).toUpperCase()}` : "";
   let nombre = Math.random()<0.2? ` ${R(N).toUpperCase()}` : "";
   db.push({tipo:"grosero", texto:`${insulto}${extra}${nombre}`});
 }
 return db;
})();
