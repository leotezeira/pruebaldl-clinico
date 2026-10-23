
$("start").onclick=()=>{
 stim=$("stim").value;mode=$("mode").value;off=+$("off").value||0;STEP=+$("stp").value;START=Math.min(+$("st0").value,max-20);i=0;res={};L=START;$("up").textContent="+ "+STEP+" dB";$("dn").textContent="− "+STEP+" dB";conds=[];
 EARS.forEach(e=>(stim==="habla"?[0]:FQ).forEach(f=>conds.push({ear:e[0],pan:e[1],f})));buildProgress();
 $("dir").classList.toggle("hide",mode==="contour");$("con").classList.toggle("hide",mode!=="contour");
 who=$("who").value;calOn=!!cal;$("clin").classList.toggle("hide",who!=="clin");$("jmp").innerHTML=conds.map((c,k)=>`<option value="${k}">${c.ear} ${c.f?c.f+" Hz":"Habla"}</option>`).join("");
 go("pg-prueba");show()};
const key=c=>c.ear+c.f;
function show(){const c=conds[i];paintProgress();$("jmp").value=i;$("prog").textContent=`Prueba ${i+1} de ${conds.length}`;
 $("cond").textContent=`${c.ear} · ${c.f?c.f+" Hz":"Habla"}`;$("lvl").textContent=L+" dB rel.";$("lvl-hl").textContent="≈ "+Math.round(L+offK({off,cal:calOn?cal.map:null},key(c)))+" dB HL · máximo "+max+" dB rel.";
 $("bf").style.width=Math.max(0,(L-START)/(max-START)*100)+"%"}
function play(){const c=conds[i];tone(stim,c.f,c.pan,L)}
$("play").onclick=play;
$("up").onclick=()=>{if(L+STEP>max){alert("Nivel máximo de seguridad alcanzado.");return}L+=STEP;show();play()};
$("dn").onclick=()=>{L=Math.max(START,L-STEP);show();play()};
function next(v){if(v!==undefined)res[key(conds[i])]=v;i++;L=START;if(i>=conds.length)return done();show()}
$("mol").onclick=()=>next(L);$("nomol").onclick=()=>next(null);
document.querySelectorAll("#con button").forEach(b=>b.onclick=()=>{const k=+b.dataset.k;if(k===7)return next(L);if(L+STEP>max){alert("Nivel máximo alcanzado: se registra sin molestia.");return next(null)}L+=STEP;show();play()});
const offK=(s,k)=>{const m=s.cal;if(!m)return s.off;const e=k[0]==="D"?"Derecho":"Izquierdo",f=+k.replace(/\D/g,"")||1000,v=m[e+f]??m["Derecho"+f]??m["Izquierdo"+f];return v===undefined?s.off:v};
const hl=(s,v,k)=>v==null?null:v+offK(s,k);
const thv=(e,f)=>{const v=parseFloat($("th"+e+f).value);return isNaN(v)?null:v};
const iconSvg=name=>`<svg class="icon icon-inline" aria-hidden="true"><use href="#i-${name}"></use></svg>`;const COL=[COLOR_OD,COLOR_OI],SN={tono:"Tono",banda:"Banda",habla:"Habla"};
const esc=x=>String(x).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const HK="ldl_hist_v1";
function loadH(){try{return JSON.parse(localStorage.getItem(HK)||"[]")}catch(e){return[]}}
function saveS(s){try{const h=loadH();h.unshift(s);localStorage.setItem(HK,JSON.stringify(h.slice(0,100)))}catch(e){}}
function delS(id){try{localStorage.setItem(HK,JSON.stringify(loadH().filter(x=>x.id!==id)))}catch(e){}}
const PAGES=["pg-paciente","pg-config","pg-prueba","pg-resultado","pg-historial","pg-calibracion"];const LEGACY={s0:"pg-paciente",s1:"pg-prueba",s2:"pg-resultado",s3:"pg-historial",s4:"pg-calibracion"};
function go(id){const pageId=LEGACY[id]||id;const target={"pg-paciente":"s0","pg-config":"pg-config","pg-prueba":"s1","pg-resultado":"s2","pg-historial":"s3","pg-calibracion":"s4"}[pageId]||pageId;["s0","pg-config","s1","s2","s3","s4"].forEach(x=>{const el=$(x);el.classList.toggle("hide",x!==target);el.classList.toggle("active",x===target)});document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===pageId||(pageId==="pg-calibracion"&&b.dataset.page==="pg-config")));window.scrollTo(0,0)}
function grid(l,t,pw,ph,Y){let o=`<rect x="${l}" y="${Y(90)}" width="${pw}" height="${Y(120)-Y(90)}" fill="var(--ok)" opacity=".10"/>`;for(let v=0;v<=120;v+=10){const m=v%20===0;o+=`<line x1="${l}" x2="${l+pw}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--bd)" stroke-width="${m?1:.5}"/>`;if(m)o+=`<text x="${l-6}" y="${Y(v)+4}" font-size="10" text-anchor="end" fill="var(--mu)">${v}</text>`}
 o+=`<line x1="${l}" x2="${l+pw}" y1="${Y(90)}" y2="${Y(90)}" stroke="var(--ok)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${l+pw-2}" y="${Y(90)-4}" font-size="10" text-anchor="end" fill="var(--ok)">LDL normal ≥ 90</text>`;
 return o+`<text transform="translate(10 ${t+ph/2}) rotate(-90)" font-size="10" text-anchor="middle" fill="var(--mu)">dB HL</text>`}
function chart(s,e,right){
 const W=360,H=262,l=42,r=16,t=16,b=62,pw=W-l-r,ph=H-t-b,X=k=>l+pw*(k+.5)/4,Y=v=>t+Math.min(Math.max(v,0),120)/120*ph;
 let o=`<svg viewBox="0 0 ${W} ${H}" width="100%" font-family="system-ui">`+grid(l,t,pw,ph,Y);
 FQ.forEach((f,k)=>o+=`<line x1="${X(k)}" x2="${X(k)}" y1="${t}" y2="${t+ph}" stroke="var(--bd)" stroke-width=".5"/><text x="${X(k)}" y="${t+ph+14}" font-size="10" text-anchor="middle" fill="var(--mu)">${f}</text>`);
 o+=`<text x="${l+pw/2}" y="${t+ph+27}" font-size="10" text-anchor="middle" fill="var(--mu)">Frecuencia (Hz)</text>`;
 const T=FQ.map(f=>s.th[e+f]??null),cs=FQ.map(f=>s.res[e+f]===null),D=FQ.map(f=>{const v=s.res[e+f];return v===undefined?null:v===null?s.max+offK(s,e+f):v+offK(s,e+f)});
 if(T.every(v=>v!==null)&&D.every(v=>v!==null)){o+=`<polygon points="${T.map((v,k)=>X(k)+","+Y(v)).concat(D.map((v,k)=>X(k)+","+Y(v)).reverse()).join(" ")}" fill="var(--dr)" opacity=".18"/>`;
  T.forEach((v,k)=>{const m=(Y(v)+Y(D[k]))/2;o+=`<line x1="${X(k)}" x2="${X(k)}" y1="${Y(v)}" y2="${Y(D[k])}" stroke="var(--dr)" stroke-width="3" opacity=".5"/><rect x="${X(k)-15}" y="${m-8}" width="30" height="16" rx="8" fill="var(--card)" stroke="var(--dr)"/><text x="${X(k)}" y="${m+4}" font-size="10" font-weight="700" text-anchor="middle" fill="var(--dr)">${Math.round(D[k]-v)}</text>`})}
 const ln=(A,c,d)=>{const p=A.map((v,k)=>v===null?null:X(k)+","+Y(v)).filter(Boolean);if(p.length>1)o+=`<polyline points="${p.join(" ")}" fill="none" stroke="${c}" stroke-width="2" ${d?'stroke-dasharray="5 3"':""}/>`};
 ln(T,right?COL[0]:COL[1]);ln(D,"var(--wa)",1);
 T.forEach((v,k)=>{if(v!==null)o+=right?`<circle cx="${X(k)}" cy="${Y(v)}" r="5" fill="none" stroke="var(--rd)" stroke-width="2"/>`:`<path d="M${X(k)-5} ${Y(v)-5}l10 10m0-10l-10 10" stroke="var(--ac)" stroke-width="2"/>`});
 D.forEach((v,k)=>{if(v!==null)o+=`<rect x="${X(k)-4}" y="${Y(v)-4}" width="8" height="8" fill="${cs[k]?"var(--card)":"var(--wa)"}" stroke="var(--wa)" stroke-width="2"/><text x="${X(k)}" y="${Y(v)+16}" font-size="9" text-anchor="middle" fill="var(--wa)">${cs[k]?">":""}${Math.round(v)}</text>`});
 return o+`<text x="${l}" y="${H-24}" font-size="10" fill="var(--mu)"><tspan fill="${right?COL[0]:COL[1]}">${right?"○":"✕"}</tspan> Umbral   <tspan fill="var(--wa)">■</tspan> LDL (□ = sin molestia al máximo)</text><text x="${l}" y="${H-10}" font-size="10" fill="var(--mu)"><tspan fill="var(--dr)">▮</tspan> Rango dinámico (dB)   <tspan fill="var(--ok)">▮</tspan> LDL normal ≥ 90</text></svg>`}
function bars(s){
 const W=360,H=210,l=42,t=14,ph=150,Y=v=>t+ph-Math.min(Math.max(v,0),120)/120*ph,Y2=v=>t+ph-Math.min(Math.max(v,0),120)/120*ph;
 let o=`<svg viewBox="0 0 ${W} ${H}" width="100%" font-family="system-ui">`+grid(l,t,W-l-16,ph,v=>t+ph-Math.min(Math.max(v,0),120)/120*ph).replace(/y1="([\d.]+)" y2="([\d.]+)"/g,'y1="$1" y2="$2"');
 EARS.forEach((e,k)=>{const r=s.res[e[0]+0],v=r==null?s.max+offK(s,e[0]+0):r+offK(s,e[0]+0),x=l+55+k*120;if(r===undefined)return;
  o+=`<rect x="${x}" y="${Y(v)}" width="70" height="${t+ph-Y(v)}" rx="4" fill="${COL[k]}" opacity="${r==null?.45:.9}"/><text x="${x+35}" y="${Y(v)-4}" font-size="11" text-anchor="middle" fill="var(--tx)">${r==null?"> ":""}${Math.round(v)}</text><text x="${x+35}" y="${t+ph+16}" font-size="11" text-anchor="middle" fill="var(--mu)">${e[0]}</text>`});
 return o+"</svg>"}
function render(s){
 $("hdr").textContent=`${s.name} · Edad: ${s.age||"—"} · ${s.date||""} · ${SN[s.stim]} · ${s.mode==="contour"?"Contour":"Directo"} · paso ${s.step} dB${s.cal?" · calibrado":""}`+(s.notes?" · "+s.notes:"");
 let h="<tr><th>Oído</th><th>Frec.</th><th>LDL rel.</th><th>LDL dB HL*</th><th>Umbral</th><th>Rango</th></tr>",low=0,nar=0,rows=[];
 s.conds.forEach(c=>{const k=c.ear+c.f,v=s.res[k],H=hl(s,v,k),T=s.th[k]??null,R=H!==null&&T!==null?H-T:null;
  if(H!==null&&H<90)low++;if(R!==null&&R<40)nar++;
  rows.push(`${c.ear} ${c.f||"Habla"}: ${v===undefined?"sin dato":v===null?">"+s.max:v+" (≈"+H+" HL)"}`+(R!==null?` RD ${R}`:""));
  h+=`<tr><td>${c.ear[0]}</td><td>${c.f||"Habla"}</td><td>${v===undefined?"–":v===null?"> "+s.max:v}</td><td>${v===undefined?"–":H===null?"> "+(s.max+offK(s,k)):H}</td><td>${T===null?"–":T}</td><td>${R===null?"–":R+" dB"}</td></tr>`});
 $("tb").innerHTML=h;
 $("charts").innerHTML=s.stim==="habla"?`<div class="card"><b>LDL (habla)</b> <span class="mu">dB HL</span>${bars(s)}</div>`:EARS.map((e,k)=>`<div class="card k-res"><b>Oído ${e[0].toLowerCase()}</b>${chips(s,e[0])}${chart(s,e[0],k===0)}</div>`).join("");
 let t=s.cal?"dB HL con calibración guiada por frecuencia (verifica con equipo certificado). ":`*dB HL = nivel + ${s.off} (estimado, sin calibración certificada). `;
 t+=low?`LDL < 90 dB HL en ${low} punto(s): puede sugerir hiperacusia o reclutamiento. `:"Ningún LDL < 90 dB HL con este estimado. ";
 if(nar)t+=`Rango dinámico < 40 dB en ${nar} punto(s): estrecho; requiere compresión y MPO ajustado. `;
 t+="Confirma con audiometría y equipo calibrados.";$("note").textContent=t;
 window.ldlText=`LDL — ${s.name}, ${s.age||"—"} años, ${s.date}\n`+rows.join("\n")+"\n"+t;go("s2")}
function done(){if(!conds.length)return;const th={};conds.forEach(c=>{if(c.f){const v=thv(c.ear,c.f);if(v!==null)th[c.ear+c.f]=v}});
 const s={id:Date.now(),who,cal:calOn&&cal?cal.map:null,name:$("pn").value||"Sin nombre",age:$("pa").value,date:$("pd").value,notes:$("pt").value,stim,mode,off,step:STEP,max,res:{...res},th,conds:conds.map(c=>({ear:c.ear,f:c.f}))};
 saveS(s);render(s)}
function mean(s,e){const a=s.conds.filter(c=>c.ear===e&&s.res[c.ear+c.f]!=null).map(c=>s.res[c.ear+c.f]+offK(s,c.ear+c.f));return a.length?a.reduce((x,y)=>x+y)/a.length:null}
function evo(list){
 const S=list.slice().sort((a,b)=>a.id-b.id),n=S.length,W=360,H=240,l=42,r=20,t=16,b=62,pw=W-l-r-10,ph=H-t-b,X=k=>l+10+(n>1?pw*k/(n-1):pw/2),Y=v=>t+Math.min(Math.max(v,0),120)/120*ph;
 let o=`<svg viewBox="0 0 ${W} ${H}" width="100%" font-family="system-ui">`+grid(l,t,W-l-r,ph,Y);
 S.forEach((s,k)=>o+=`<text x="${X(k)}" y="${t+ph+13}" font-size="9" text-anchor="middle" fill="var(--mu)">${esc((s.date||"").slice(5))}</text><text x="${X(k)}" y="${t+ph+24}" font-size="9" text-anchor="middle" fill="var(--mu)">${SN[s.stim]}</text>`);
 EARS.forEach((e,j)=>{const P=S.map((s,k)=>[X(k),mean(s,e[0])]).filter(p=>p[1]!==null);
  if(P.length>1)o+=`<polyline points="${P.map(p=>p[0]+","+Y(p[1])).join(" ")}" fill="none" stroke="${COL[j]}" stroke-width="2"/>`;
  P.forEach(p=>o+=`<circle cx="${p[0]}" cy="${Y(p[1])}" r="4.5" fill="${COL[j]}"/><text x="${p[0]}" y="${Y(p[1])+(j?15:-8)}" font-size="9" text-anchor="middle" fill="${COL[j]}">${Math.round(p[1])}</text>`)});
 return o+`<text x="${l}" y="${H-8}" font-size="10" fill="var(--mu)"><tspan fill="${COL[0]}">●</tspan> Derecho  <tspan fill="${COL[1]}">●</tspan> Izquierdo · LDL promedio (dB HL)</text></svg>`}
function hist(){go("pg-historial");const h=loadH(),ns=[...new Set(h.map(x=>x.name))],cur=$("hp").value;
 $("hp").innerHTML=ns.map(n=>`<option${n===cur?" selected":""}>${esc(n)}</option>`).join("");$("hp").classList.toggle("hide",!ns.length);hdraw()}
function hdraw(){const L=loadH().filter(x=>x.name===$("hp").value);
 $("hl").innerHTML=L.length?L.map(s=>{const a=mean(s,"Derecho"),b=mean(s,"Izquierdo"),f=v=>v===null?"–":Math.round(v);return `<div class="row" style="align-items:center;border-bottom:1px solid var(--bd);padding:6px 0"><input type="checkbox" class="cmp" data-id="${s.id}" style="width:auto;flex:0 0 auto;margin:0"><div style="flex:2" class="mu">${esc(s.date||"")} · ${SN[s.stim]}<br>D ${f(a)} · I ${f(b)} dB HL</div><button class="sec" data-a="v" data-id="${s.id}">Ver</button><button class="sec" data-a="d" data-id="${s.id}">Borrar</button></div>`}).join(""):'<p class="mu">Aún no hay pruebas guardadas en este dispositivo.</p>';
 $("evo").innerHTML=L.length?evo(L)+(L.length<2?'<p class="mu">Con 2 o más pruebas verás la tendencia.</p>':""):""}
$("hp").onchange=hdraw;
$("hl").onclick=e=>{const b=e.target.closest("button");if(!b)return;const id=+b.dataset.id;
 if(b.dataset.a==="v")return render(loadH().find(x=>x.id===id));
 if(b.dataset.a==="d"){if(b.dataset.arm){delS(id);return hist()}b.dataset.arm=1;b.textContent="¿Seguro?"}};
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{if(b.dataset.page==="pg-historial")hist();else go(b.dataset.page)});$("hbtn").onclick=hist;$("h2").onclick=hist;$("hb").onclick=()=>go("s0");
$("pdf").onclick=()=>window.print();
$("copy").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(window.ldlText).then(()=>alert("Copiado"))};
$("again").onclick=()=>go("s0");

$("prv").onclick=()=>{i=Math.max(0,i-1);L=START;show()};
$("skp").onclick=()=>next(undefined);
$("jmp").onchange=e=>{i=+e.target.value;L=START;show()};
$("man").onclick=()=>{const v=parseFloat($("mv").value);if(isNaN(v))return;$("mv").value="";next(v)};
$("fin").onclick=()=>done();
function csv(L){let o="fecha,paciente,edad,estimulo,metodo,oido,frecuencia,ldl_relativo,ldl_dBHL,umbral_dBHL,rango_dB\n";
 L.forEach(s=>s.conds.forEach(c=>{const k=c.ear+c.f,v=s.res[k];if(v===undefined)return;const H=v===null?">"+(s.max+offK(s,k)):v+offK(s,k),T=s.th[k]??"";
  o+=[s.date,'"'+String(s.name).replace(/"/g,'""')+'"',s.age,s.stim,s.mode,c.ear,c.f||"habla",v===null?">"+s.max:v,H,T,(v!==null&&T!=="")?H-T:""].join(",")+"\n"}));return o}
function copyCsv(L){const t=csv(L),b=$("csvbox");b.value=t;b.classList.remove("hide");b.select();try{navigator.clipboard&&navigator.clipboard.writeText(t).catch(()=>{})}catch(e){}}
$("csvp").onclick=()=>copyCsv(loadH().filter(x=>x.name===$("hp").value));
$("csva").onclick=()=>copyCsv(loadH());
function cmp(A,B){
 const F=[...new Set(A.conds.concat(B.conds).map(c=>c.f))].sort((a,b)=>a-b),W=360,H=262,l=42,r=16,t=16,b=62,pw=W-l-r,ph=H-t-b,X=k=>l+pw*(k+.5)/F.length,Y=v=>t+Math.min(Math.max(v,0),120)/120*ph;
 const val=(s,e,f)=>{const v=s.res[e+f];return v==null?null:v+offK(s,e+f)},lab=s=>esc((s.date||"")+" "+SN[s.stim]);
 let h="";
 EARS.forEach(e=>{
  let o=`<svg viewBox="0 0 ${W} ${H}" width="100%" font-family="system-ui">`+grid(l,t,pw,ph,Y);
  F.forEach((f,k)=>o+=`<text x="${X(k)}" y="${t+ph+14}" font-size="10" text-anchor="middle" fill="var(--mu)">${f||"Habla"}</text>`);
  [[A,"var(--wa)",0],[B,"var(--ac)",1]].forEach(([s,c,q])=>{const D=F.map(f=>val(s,e[0],f)),p=D.map((v,k)=>v===null?null:X(k)+","+Y(v)).filter(Boolean);
   if(p.length>1)o+=`<polyline points="${p.join(" ")}" fill="none" stroke="${c}" stroke-width="2" ${q?'stroke-dasharray="5 3"':""}/>`;
   D.forEach((v,k)=>{if(v===null)return;o+=(q?`<circle cx="${X(k)}" cy="${Y(v)}" r="5" fill="${c}"/>`:`<rect x="${X(k)-5}" y="${Y(v)-5}" width="10" height="10" fill="${c}"/>`)+`<text x="${X(k)}" y="${Y(v)+(q?17:-9)}" font-size="9" text-anchor="middle" fill="${c}">${Math.round(v)}</text>`})});
  o+=`<text x="${l}" y="${H-24}" font-size="10" fill="var(--mu)"><tspan fill="var(--wa)">■</tspan> A: ${lab(A)}</text><text x="${l}" y="${H-10}" font-size="10" fill="var(--mu)"><tspan fill="var(--ac)">●</tspan> B: ${lab(B)}</text></svg>`;
  let t2="<table><tr><th>Frec.</th><th>A</th><th>B</th><th>Î” (B−A)</th></tr>";
  F.forEach(f=>{const a=val(A,e[0],f),b2=val(B,e[0],f);t2+=`<tr><td>${f||"Habla"}</td><td>${a===null?"–":Math.round(a)}</td><td>${b2===null?"–":Math.round(b2)}</td><td>${a!==null&&b2!==null?(b2-a>0?"+":"")+Math.round(b2-a):"–"}</td></tr>`});
  h+=`<div class="card"><b>Oído ${e[0].toLowerCase()}</b> <span class="mu">LDL en dB HL</span>${o}${t2}</table></div>`});
 return h+'<p class="mu">Î” positivo: el LDL subió (mayor tolerancia al sonido). Solo se muestran puntos con LDL registrado.</p>'}
$("cmpb").onclick=()=>{const ids=[...document.querySelectorAll(".cmp:checked")].map(x=>+x.dataset.id),H=loadH();
 if(ids.length!==2){$("cmp").innerHTML='<p class="mu">Marca exactamente 2 pruebas para comparar.</p>';return}
 const [a,b]=ids.map(id=>H.find(x=>x.id===id)).sort((x,y)=>x.id-y.id);$("cmp").innerHTML=cmp(a,b);$("cmp").scrollIntoView()};

function chips(s,e){const a=s.conds.filter(c=>c.ear===e&&s.res[c.ear+c.f]!=null),H=c=>s.res[c.ear+c.f]+offK(s,c.ear+c.f),m=a.length?a.reduce((x,c)=>x+H(c),0)/a.length:null,r=a.filter(c=>s.th[c.ear+c.f]!=null),rd=r.length?r.reduce((x,c)=>x+H(c)-s.th[c.ear+c.f],0)/r.length:null;
 return `<div class="chips"><span class="chip" style="--cc:var(--wa)">LDL medio ${m===null?"–":Math.round(m)} dB HL</span><span class="chip" style="--cc:var(--dr)">Rango medio ${rd===null?"–":Math.round(rd)} dB</span>`+(m===null?"":m<90?'<span class="chip" style="--cc:var(--rd)">${iconSvg("warning")}LDL &lt; 90</span>':'<span class="chip" style="--cc:var(--ok)">${iconSvg("check")}LDL ≥ 90</span>')+"</div>"}
const REF=-20,RET={tdh:{500:13.5,1000:7.5,2000:11,4000:10.5},er3:{500:5.5,1000:0,2000:3,4000:5.5}};
let cal=null,calOn=false;try{cal=JSON.parse(localStorage.getItem("ldl_cal")||"null")}catch(e){}
function calst(){$("calst").innerHTML=cal?`${iconSvg("check")}Calibración guiada activa (${cal.date}): dB HL por frecuencia.`:"Sin calibración guiada: se usa la corrección manual."}
function fillRet(){const t=RET[$("trn").value];if(!t)return;EARS.forEach(e=>FQ.forEach(f=>$("ret"+e[0]+f).value=t[f]))}
function calc(){const m={};EARS.forEach(e=>FQ.forEach(f=>{const a=parseFloat($("spl"+e[0]+f).value),b=parseFloat($("ret"+e[0]+f).value),o=$("of"+e[0]+f);if(isNaN(a)||isNaN(b)){o.textContent="–";return}const v=Math.round((a-REF-b)*10)/10;m[e[0]+f]=v;o.textContent="+"+v}));return m}
function buildCal(){$("calg").innerHTML='<div class="mu">Frecuencia · Reproducir · SPL medido · RETSPL · corrección</div>'+EARS.map(e=>`<div><b>${e[0]}</b></div>`+FQ.map(f=>`<div class="crow"><span style="width:60px">${f} Hz</span><button class="c-play" data-e="${e[0]}" data-f="${f}" aria-label="Reproducir tono de calibración" title="Reproducir tono">${iconSvg("play")}</button><input id="spl${e[0]}${f}" type="number" inputmode="decimal" placeholder="SPL"><input id="ret${e[0]}${f}" type="number" step="0.5" placeholder="RETSPL"><span class="mu" id="of${e[0]}${f}">–</span></div>`).join("")).join("");fillRet();calc()}
$("trn").onchange=()=>{fillRet();calc()};$("calg").oninput=calc;
$("calg").onclick=e=>{const b=e.target.closest("button");if(!b)return;const en=EARS.find(x=>x[0]===b.dataset.e);tone("tono",+b.dataset.f,en[1],REF,10)};
$("calsave").onclick=()=>{const m=calc();if(!Object.keys(m).length){$("calres").textContent="Ingresa al menos un SPL medido.";return}cal={map:m,trn:$("trn").value,date:new Date().toISOString().slice(0,10)};try{localStorage.setItem("ldl_cal",JSON.stringify(cal))}catch(e){}calst();$("calres").textContent="Calibración guardada correctamente."};
$("calclr").onclick=()=>{cal=null;try{localStorage.removeItem("ldl_cal")}catch(e){}calst();$("calres").textContent="Calibración borrada."};
$("calbtn").onclick=()=>{buildCal();go("s4")};$("calb").onclick=()=>go("pg-config");calst();
function st(t){$("bst").textContent=t}
async function saveFile(name,data){try{const d=window.claude&&await window.claude.use("downloads");if(!d)throw{code:"unavailable"};await d.save({filename:name,data});st("Archivo enviado correctamente.")}catch(e){if(e&&e.code==="declined")return st("Guardado cancelado.");const b=$("csvbox");b.value=data;b.classList.remove("hide");st("No se pudo guardar directo: copia el texto del cuadro de arriba.")}}
const today=()=>new Date().toISOString().slice(0,10);
$("bkp").onclick=()=>saveFile("ldl-respaldo-"+today()+".json",JSON.stringify({app:"ldl",version:1,sesiones:loadH(),calibracion:cal},null,1));
$("csvs").onclick=()=>saveFile("ldl-"+today()+".csv",csv(loadH()));
$("rstb").onclick=()=>$("rst").click();
$("rst").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text()),arr=Array.isArray(j)?j:j.sesiones,h=loadH(),ids=new Set(h.map(x=>x.id));let n=0;arr.forEach(x=>{if(x&&x.id&&x.conds&&x.res&&!ids.has(x.id)){h.push(x);n++}});h.sort((a,b)=>b.id-a.id);localStorage.setItem(HK,JSON.stringify(h.slice(0,200)));if(j.calibracion&&!cal){cal=j.calibracion;localStorage.setItem("ldl_cal",JSON.stringify(cal));calst()}st(`Restauradas ${n} prueba(s).`);hist()}catch(err){st("Archivo no válido.")}e.target.value=""};
const BC={start:"c-go",calbtn:"c-cal",ref:"c-play",play:"c-play",up:"c-up",dn:"c-dn",mol:"c-rec",nomol:"c-nav",prv:"c-nav",skp:"c-nav",man:"c-rec",fin:"c-fin",hbtn:"c-hist",h2:"c-hist",cmpb:"c-hist",csvp:"c-exp",csva:"c-exp",csvs:"c-exp",bkp:"c-exp",rstb:"c-go",pdf:"c-exp",copy:"c-exp",again:"c-go",hb:"c-nav",calsave:"c-cal",calclr:"c-nav",calb:"c-nav"};
Object.entries(BC).forEach(([i,c])=>{const e=$(i);e&&e.classList.add(c)});






function buildProgress(){const box=$("ldl-freqs");if(!box)return;box.innerHTML="";conds.forEach((c,k)=>{const b=document.createElement("span");b.className="freq-btn";b.textContent=(c.f?(c.f>=1000?c.f/1000+"k":c.f):"Habla")+(c.ear==="Derecho"?" D":" I");b.dataset.k=k;box.appendChild(b)})}
function paintProgress(){document.querySelectorAll("#ldl-freqs .freq-btn").forEach((b,k)=>{const c=conds[k],v=res[key(c)];b.classList.toggle("current",k===i);b.classList.toggle("done",v!==undefined&&v!==null);b.classList.toggle("skipped",v===null)});const c=conds[i];if(!c)return;$("ldl-ear-od").classList.toggle("active",c.ear==="Derecho");$("ldl-ear-oi").classList.toggle("active",c.ear==="Izquierdo")}






