'use strict';
const $=id=>document.getElementById(id);
const photos=[null,null];
const questions=[
 ['¿La familia dice que parecen fotocopias?',['¡Hasta los confunden!','Un poquito','Ni de chiste']],
 ['¿Qué tan parecida es su sonrisa?',['La misma jeta','Algo similar','Nada que ver']],
 ['¿Ponen la misma cara cuando se enojan?',['Idéntica','A veces','Para nada']],
 ['¿Se parecen en fotos de pequeños?',['Muchísimo','Más o menos','No']],
 ['¿Comparten gestos o expresiones?',['Todo el tiempo','Algunos','Ninguno']]
];
const lines={low:[
 '¡No mames, compadre! ¡He visto más parecido entre un aguacate y un control remoto!',
 '¡Código rojo! ¡El escáner pidió una segunda opinión y tres días de vacaciones!',
 '¡Alerta de chivo en los tamales! ¡Es broma, cabrones, no armen el divorcio por una aplicación!',
 '¡El parecido salió más perdido que papá en la junta de la escuela!'
],mid:[
 '¡Hay algo de parecido, pero la máquina dice que no le metan presión!',
 '¡A la madre! ¡Aquí hay más misterio que en el último capítulo de la novela!',
 '¡Doctor ADN reportando: las jetas están negociando una coincidencia!'
],high:[
 '¡A la madre! ¡Aquí parece que alguien se mandó sacar una fotocopia!',
 '¡Compadre, ni la impresora de la papelería saca copias tan cabronas!',
 '¡Hasta la cara de no traer dinero les salió parecida!',
 '¡Tenemos un clon de comedia, y viene con los mismos defectos de fábrica!'
]};
function speech(t){$('speech').textContent=t;if($('voice').checked && window.DoctorAndroid)window.DoctorAndroid.speak(t)}
$('voice').addEventListener('change',e=>{if(!e.target.checked&&window.DoctorAndroid)window.DoctorAndroid.stop();if(e.target.checked)speech('¡Se activó la voz del Doctor ADN! A ver esas jetas, compadre.')});
function show(id){for(const x of ['start','quiz','loading','result'])$(x).classList.toggle('hidden',x!==id)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function loadImage(file){return new Promise((resolve,reject)=>{const img=new Image();const u=URL.createObjectURL(file);img.onload=()=>{URL.revokeObjectURL(u);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(u);reject(Error('Imagen inválida'))};img.src=u})}
function thumbnail(img){const c=document.createElement('canvas');c.width=c.height=48;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#fff';ctx.fillRect(0,0,48,48);const s=Math.min(img.naturalWidth,img.naturalHeight),x=(img.naturalWidth-s)/2,y=(img.naturalHeight-s)/2;ctx.drawImage(img,x,y,s,s,0,0,48,48);return ctx.getImageData(0,0,48,48).data}
// This is a whole-image color comparison, NOT face recognition or DNA analysis.
function visualSimilarity(a,b){const x=thumbnail(a),y=thumbnail(b);let sum=0;for(let i=0;i<x.length;i+=4){sum+=Math.abs(x[i]-y[i])+Math.abs(x[i+1]-y[i+1])+Math.abs(x[i+2]-y[i+2])}const diff=sum/(48*48*3*255);return Math.max(0,Math.min(100,Math.round((1-diff)*100)))}
for(const [idx,id,preview] of [[0,'father','p1'],[1,'child','p2']]){$(id).addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const img=await loadImage(file);photos[idx]=img;const v=document.createElement('img');v.src=img.src;$(preview).replaceChildren(v);speech('¡Eso, compadre! Ya tenemos una jeta en el expediente.')}catch{alert('No pude abrir esa fotografía. Prueba con otra.')}})}
$('go').onclick=()=>{if(!photos[0]||!photos[1])return alert('Sube las dos fotografías primero.');if(!$('consent').checked)return alert('Confirma que tienes autorización para usar las fotos.');$('questions').replaceChildren();questions.forEach(([q,opts],i)=>{const wrap=document.createElement('div');wrap.className='question';const h=document.createElement('b');h.textContent=`${i+1}. ${q}`;wrap.append(h);opts.forEach((opt,j)=>{const l=document.createElement('label');const r=document.createElement('input');r.type='radio';r.name='q'+i;r.value=String(j);l.append(r,document.createTextNode(opt));wrap.append(l)});$('questions').append(wrap)});speech('¡Empieza el interrogatorio! ¡Aquí nadie sale sin contestar!');show('quiz')};
$('analyze').onclick=()=>{const ans=questions.map((_,i)=>document.querySelector('input[name=q'+i+']:checked')?.value);if(ans.some(v=>v===undefined))return alert('Contesta todas las preguntas, compadre.');show('loading');speech('¡Silencio en el laboratorio! ¡La máquina está trabajando!');const score=visualSimilarity(...photos);const bucket=score<58?'low':score<78?'mid':'high';const name1=$('n1').value.trim(),name2=$('n2').value.trim();const same=name1&&name2&&name1.localeCompare(name2,'es',{sensitivity:'base'})===0;setTimeout(()=>{$('score').textContent=score+'%';$('alert').textContent=bucket==='low'?'🚨 ALERTA DE PARECIDO BAJO 🚨':bucket==='high'?'⚡ ALERTA DE FOTOCOPIA ⚡':'🧪 MISTERIO EN EL LABORATORIO';$('headline').textContent=pick(lines[bucket]);$('verdict').textContent='El interrogatorio obtuvo '+ans.filter(x=>x==='0').length+' de 5 respuestas de gran parecido. ¡El Doctor ADN ya quiere vacaciones!';$('tocayo').textContent=same?'🚨 ¡MISMO NOMBRE, DISTINTA INVESTIGACIÓN! ¡Por lo menos salieron tocayos los condenados!':'';speech($('headline').textContent);show('result')},2700)};
$('again').onclick=()=>{for(const id of ['father','child'])$(id).value='';for(const id of ['p1','p2'])$(id).textContent='📷';for(const id of ['n1','n2'])$(id).value='';$('consent').checked=false;photos.fill(null);speech('¡Siguiente expediente, compadre!');show('start')};
$('share').onclick=async()=>{const msg='🧬 PRUEBA DE PATERNIDAD EXPRESS\n'+$('score').textContent+' de parecido visual recreativo\n'+$('headline').textContent+'\n⚠️ Juego: no determina parentesco.';if(window.DoctorAndroid){window.DoctorAndroid.share(msg);return}if(navigator.share){try{await navigator.share({text:msg});return}catch(e){}}try{await navigator.clipboard.writeText(msg);alert('Resultado copiado.')}catch(e){prompt('Copia tu resultado:',msg)}};
