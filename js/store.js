/* Shared data + cart/transaction helpers. State lives in the browser tab (no database). */
const PRODUCTS = [
  {id:1, name:'Classic Burger',        price:55, img:'images/classic-burger.svg', desc:'Beef patty with lettuce and tomato'},
  {id:2, name:'Cheeseburger',          price:65, img:'images/cheeseburger.svg',   desc:'Our classic burger with melted cheese'},
  {id:3, name:'Ham Sandwich',          price:40, img:'images/ham-sandwich.svg',   desc:'Sliced ham, cheese and fresh greens'},
  {id:4, name:'French Fries (Regular)',price:45, img:'images/french-fries.svg',   desc:'Crispy, golden and lightly salted'},
  {id:5, name:'Nachos',                price:50, img:'images/nachos.svg',         desc:'Tortilla chips with warm cheese sauce'},
  {id:6, name:'Soda (Can)',            price:25, img:'images/soda-can.svg',       desc:'Ice-cold canned soda'}
];
const MAX_QTY = 99;
const peso = n => '₱' + Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const find = id => PRODUCTS.find(p => p.id === id);
const read = (k,d) => { try { const v = JSON.parse(sessionStorage.getItem(k)); return v === null ? d : v; } catch(e){ return d; } };
const write = (k,v) => sessionStorage.setItem(k, JSON.stringify(v));

const Store = {
  cart: () => read('sb_cart', []),
  save: c => write('sb_cart', c),
  add(id){ const c = this.cart(), i = c.find(x => x.id === id);
    if(i){ if(i.qty >= MAX_QTY) return false; i.qty++; } else c.push({id, qty:1});
    this.save(c); return true; },
  change(id, d){ const c = this.cart(), i = c.find(x => x.id === id);
    if(i){ i.qty = Math.min(MAX_QTY, Math.max(1, i.qty + d)); this.save(c); } },
  remove(id){ this.save(this.cart().filter(x => x.id !== id)); },
  clear(){ this.save([]); },
  total(){ return this.cart().reduce((s,i) => s + find(i.id).price * i.qty, 0); },
  count(){ return this.cart().reduce((s,i) => s + i.qty, 0); },
  tx: () => read('sb_tx', null),
  saveTx: t => write('sb_tx', t),
  nextRef(){
    let n = 1;
    try { n = (+localStorage.getItem('sb_n') || 0) + 1; localStorage.setItem('sb_n', n); }
    catch(e){ n = (+sessionStorage.getItem('sb_n') || 0) + 1; sessionStorage.setItem('sb_n', n); }
    const d = new Date();
    return 'SB-' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '-' + String(n).padStart(4,'0');
  },
  reset(){ sessionStorage.removeItem('sb_cart'); sessionStorage.removeItem('sb_tx'); },
  /* 'shop' pages are blocked once a payment exists; 'result' pages need a payment */
  guard(mode){
    if(mode === 'shop' && this.tx()) location.replace('receipt.html');
    if(mode === 'result' && !this.tx()) location.replace('index.html');
  }
};
function refreshNav(){
  const e = document.getElementById('navCount'); if(!e) return;
  const n = Store.count(); e.textContent = n; e.classList.toggle('show', n > 0);
}
let toastTimer;
function toast(text){
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = text; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1700);
}
