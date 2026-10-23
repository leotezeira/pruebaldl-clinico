function init(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();ctx.resume&&ctx.resume()}
function NB(){if(!nb){nb=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=(Math.random()*2-1)*.7}return nb}
function tone(kind,f,p,db,dur=1.5){
 init();const t=ctx.currentTime,gn=ctx.createGain(),a=Math.pow(10,db/20);let src,out;
 if(kind==="tono"){src=ctx.createOscillator();src.frequency.value=f;out=src}
 else{src=ctx.createBufferSource();src.buffer=NB();src.loop=true;
  if(kind==="banda"){const bp=ctx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=f;bp.Q.value=4;src.connect(bp);const m=ctx.createGain();m.gain.value=2.5;bp.connect(m);out=m}
  else{const hp=ctx.createBiquadFilter();hp.type="highpass";hp.frequency.value=150;const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3500;
   const am=ctx.createGain();am.gain.value=.6;const l=ctx.createOscillator();l.frequency.value=4;const lg=ctx.createGain();lg.gain.value=.4;l.connect(lg);lg.connect(am.gain);l.start(t);l.stop(t+dur+.05);
   src.connect(hp);hp.connect(lp);lp.connect(am);const m=ctx.createGain();m.gain.value=1.5;am.connect(m);out=m}}
 gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(a,t+.08);gn.gain.setValueAtTime(a,t+dur-.08);gn.gain.linearRampToValueAtTime(0,t+dur);
 out.connect(gn);
 if(ctx.createStereoPanner){const pn=ctx.createStereoPanner();pn.pan.value=p;gn.connect(pn);pn.connect(ctx.destination)}else gn.connect(ctx.destination);
 src.start(t);src.stop(t+dur+.05);
}
$("ref").onclick=()=>tone("tono",1000,0,-40,2);
