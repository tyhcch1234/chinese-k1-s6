/* 題目池：由詞彙自動生成五類題＋各年級手寫題＋階段綜合題 */
window.CNQ = (function(){
  var cache = {};

  function stagePool(g){
    var out = [];
    CN.stageGrades(g.stage).forEach(function(x){
      var d = CN.byId(x.id);
      if(d && d.words) out = out.concat(d.words);
    });
    return out;
  }
  function uniq(a){
    var s = {}, o = [];
    a.forEach(function(x){ if(!s[x]){ s[x]=1; o.push(x); } });
    return o;
  }
  function padOptions(correct, pool, n){
    var opts = [correct].concat(CN.pick(uniq(pool.filter(function(x){return x!==correct;})), n-1));
    return opts.length === n ? opts : null;
  }

  function build(gid){
    if(cache[gid]) return cache[gid];
    var g = CN.byId(gid);
    if(!g) return [];
    var words = (g.words||[]).slice();
    var big = words.concat(stagePool(g));
    var qs = [];

    words.forEach(function(w){
      // 1. 詞義（選釋義）
      var mOpts = padOptions(w.mean, big.map(function(x){return x.mean;}), 4);
      if(mOpts) qs.push({tag:'詞義', band:1, type:'meaning', q:'「'+w.w+'」的意思是？', sub:'', opts:mOpts, a:0,
        why:'「'+w.w+'」（'+w.py+'，'+w.pos+'詞）：'+w.mean+'。例：'+w.ex});

      // 2. 釋義選詞（逆向）
      var wOpts = padOptions(w.w, words.map(function(x){return x.w;}), 4);
      if(wOpts) qs.push({tag:'釋義選詞', band:2, type:'reverse', q:'以下哪一個詞語解作「'+w.mean+'」？', sub:'', opts:wOpts, a:0,
        why:'「'+w.w+'」解作'+w.mean+'，讀音 '+w.py+'。'});

      // 3. 粵拼
      var pOpts = padOptions(w.py, big.map(function(x){return x.py;}), 4);
      if(pOpts) qs.push({tag:'粵拼', band:1, type:'jyutping', q:'「'+w.w+'」的粵拼是？', sub:'香港語言學學會粵拼方案', opts:pOpts, a:0,
        why:'「'+w.w+'」讀 '+w.py+'，意思是'+w.mean+'。'});

      // 4. 聆聽（語音選詞）
      var lOpts = padOptions(w.w, words.map(function(x){return x.w;}), 4);
      if(lOpts) qs.push({tag:'聆聽', band:1, type:'listen', q:'你聽到哪一個詞語？', sub:'按「播放語音」收聽（如無聲，可看下方文字）',
        opts:lOpts, a:0, listen:w.w, why:'你聽到的是「'+w.w+'」（'+w.py+'）：'+w.mean+'。'});

      // 5. 例句填空
      if(w.ex && w.ex.indexOf(w.w) >= 0){
        var cOpts = padOptions(w.w, words.map(function(x){return x.w;}), 4);
        if(cOpts && cOpts.length===4) qs.push({tag:'詞語運用', band:2, type:'cloze', q:'選出最適合填在橫線的詞語：',
          sub:w.ex.replace(w.w, '＿＿＿＿'), opts:cOpts, a:0, why:'原句用「'+w.w+'」：'+w.ex});
      }
    });

    // 手寫題（原有三級）
    ['basic','advanced','challenge'].forEach(function(k, i){
      (g.quiz && g.quiz[k] || []).forEach(function(item){
        qs.push({tag:item.tag, band:i+1, type:'authored', q:item.q, sub:item.sub||'', opts:item.opts, a:item.a,
          why:item.why, listen:item.listen});
      });
    });
    // 年級補充題（新增）
    (CN.extra && CN.extra[gid] || []).forEach(function(item){
      qs.push({tag:item.tag, band:item.band||2, type:'authored', q:item.q, sub:item.sub||'', opts:item.opts, a:item.a,
        why:item.why, listen:item.listen});
    });
    // 階段綜合
    (CN.bank[g.stage] || []).forEach(function(item){
      qs.push({tag:'階段綜合 · '+item.tag, band:3, type:'bank', q:item.q, sub:item.sub||'', opts:item.opts, a:item.a, why:item.why});
    });

    // 去重（同題幹＋同副題）
    var seen = {}, out = [];
    qs.forEach(function(q){
      var key = q.q + '|' + (q.sub||'');
      if(!seen[key] && q.opts && q.opts.length===4){ seen[key]=1; out.push(q); }
    });
    cache[gid] = out;
    return out;
  }

  function shuffleOpts(q){
    var correct = q.opts[q.a];
    var opts = CN.shuffle(q.opts);
    return {tag:q.tag, q:q.q, sub:q.sub, opts:opts, a:opts.indexOf(correct), why:q.why, listen:q.listen, type:q.type, band:q.band};
  }

  // 抽 10 題：按難度分層、避免同一類型超過 2 題
  function session(gid, level, n){
    n = n || 10;
    var pool = build(gid);
    var limit = level===1?1:(level===2?2:3);
    var primary = pool.filter(function(q){ return limit===3 ? q.band===3 : q.band<=limit; });
    var rest = pool.filter(function(q){ return primary.indexOf(q)<0; });
    var picked = [], tagCount = {};
    function take(list){
      CN.shuffle(list).forEach(function(q){
        if(picked.length>=n) return;
        var c = tagCount[q.tag] || 0;
        if(c >= 2) return;
        if(picked.some(function(p){ return p.q===q.q; })) return;
        picked.push(q); tagCount[q.tag] = c+1;
      });
    }
    take(primary); take(rest);
    return CN.shuffle(picked).slice(0, n).map(shuffleOpts);
  }

  function count(gid){ return build(gid).length; }
  function byType(gid){
    var pool = build(gid), map = {}, order = [];
    pool.forEach(function(q){
      if(!map[q.tag]){ map[q.tag]=[]; order.push(q.tag); }
      map[q.tag].push(q);
    });
    return order.map(function(t){ return {tag:t, items:map[t]}; });
  }

  return {build:build, session:session, count:count, byType:byType};
})();
