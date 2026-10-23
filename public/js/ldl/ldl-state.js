const EARS=[["Derecho",1],["Izquierdo",-1]],FQ=[500,1000,2000,4000];let START=-60,STEP=5,who="pac";
let ctx,max=-6,i=0,L=START,res={},conds=[],stim="tono",mode="directo",off=90,nb;
const $=id=>document.getElementById(id);
$("pd").valueAsDate=new Date();
$("thg").innerHTML=EARS.map(e=>`<div class="mu">${e[0]}</div><div class="row">${FQ.map(f=>`<input id="th${e[0]}${f}" type="number" placeholder="${f}" inputmode="numeric">`).join("")}</div>`).join("");
$("mx").oninput=e=>{max=+e.target.value;$("mxv").textContent=max};
