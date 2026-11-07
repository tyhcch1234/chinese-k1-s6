/* 核心資料：階段、年級、範疇定義 */
window.CN = window.CN || {};
CN.stages = {
  k:   {id:'k',  name:'幼稚園',      range:'K1–K3', color:'#e8942f', age:'3–6 歲',   desc:'以聽說與閱讀興趣為主，不要求大量寫字。'},
  ks1: {id:'ks1',name:'第一學習階段', range:'P1–P3', color:'#2f9e68', age:'6–9 歲',   desc:'建立識字、筆順與句子能力，由聽到讀寫。'},
  ks2: {id:'ks2',name:'第二學習階段', range:'P4–P6', color:'#2a86cf', age:'9–12 歲',  desc:'讀篇章、寫成篇，開始接觸古詩文。'},
  ks3: {id:'ks3',name:'第三學習階段', range:'S1–S3', color:'#7361ef', age:'12–15 歲', desc:'文言入門、議論與實用文，讀寫並重。'},
  ks4: {id:'ks4',name:'第四學習階段', range:'S4–S6', color:'#d9495f', age:'15–18 歲', desc:'DSE 應試：卷一閱讀、卷二寫作與校本評核。'}
};
CN.gradeList = [
  {id:'k1',name:'K1', stage:'k',  age:'3–4 歲', band:'幼兒班'},
  {id:'k2',name:'K2', stage:'k',  age:'4–5 歲', band:'低班'},
  {id:'k3',name:'K3', stage:'k',  age:'5–6 歲', band:'高班'},
  {id:'p1',name:'小一', stage:'ks1', age:'6–7 歲',  band:'P1'},
  {id:'p2',name:'小二', stage:'ks1', age:'7–8 歲',  band:'P2'},
  {id:'p3',name:'小三', stage:'ks1', age:'8–9 歲',  band:'P3'},
  {id:'p4',name:'小四', stage:'ks2', age:'9–10 歲', band:'P4'},
  {id:'p5',name:'小五', stage:'ks2', age:'10–11 歲',band:'P5'},
  {id:'p6',name:'小六', stage:'ks2', age:'11–12 歲',band:'P6'},
  {id:'s1',name:'中一', stage:'ks3', age:'12–13 歲',band:'S1'},
  {id:'s2',name:'中二', stage:'ks3', age:'13–14 歲',band:'S2'},
  {id:'s3',name:'中三', stage:'ks3', age:'14–15 歲',band:'S3'},
  {id:'s4',name:'中四', stage:'ks4', age:'15–16 歲',band:'S4'},
  {id:'s5',name:'中五', stage:'ks4', age:'16–17 歲',band:'S5'},
  {id:'s6',name:'中六', stage:'ks4', age:'17–18 歲',band:'S6'}
];
CN.strands = [
  {id:'listening',name:'聆聽',en:'Listening', hint:'聽辨字音、理解話語與篇章'},
  {id:'speaking', name:'說話',en:'Speaking',  hint:'朗讀、複述、討論與演講'},
  {id:'reading',  name:'閱讀',en:'Reading',   hint:'識字、篇章理解與閱讀策略'},
  {id:'writing',  name:'寫作',en:'Writing',   hint:'寫字、造句、文體與構思'},
  {id:'culture',  name:'文化',en:'Culture',   hint:'古詩文、節日、品德與中華文化'},
  {id:'vocab',    name:'詞彙',en:'Vocabulary',hint:'詞語積累、辨析與運用'}
];
CN.bank = {};      /* 階段綜合挑戰題 */
CN.grades = {};    /* 年級資料 */

CN.byId = function(id){ return CN.grades[id]; };
CN.stageOf = function(g){ return CN.stages[g.stage]; };
CN.stageGrades = function(stage){ return CN.gradeList.filter(function(g){return g.stage===stage;}); };
CN.nextGrade = function(id){
  var i = CN.gradeList.findIndex(function(g){return g.id===id;});
  return i>=0 && i<CN.gradeList.length-1 ? CN.gradeList[i+1] : null;
};
CN.prevGrade = function(id){
  var i = CN.gradeList.findIndex(function(g){return g.id===id;});
  return i>0 ? CN.gradeList[i-1] : null;
};
CN.shuffle = function(a){
  var r = a.slice();
  for(var i=r.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=r[i]; r[i]=r[j]; r[j]=t; }
  return r;
};
CN.pick = function(a,n){ return CN.shuffle(a).slice(0,n); };
