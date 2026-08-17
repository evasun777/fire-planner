(function(){
  const M = window.FirePlannerModel;
  const state = M.cloneDefaultState();
  let idx = 0;

  const el = id => document.getElementById(id);
  const money = M.formatMoney;
  const moneyYr = M.formatMoneyYear;
  const pct = M.formatPct;
  const cityLabel = c => `${c.nameZh} / ${c.nameEn}`;

  const steps = [
    {key:'scope', title:'你的家庭口径', hint:'家庭口径', desc:'先选你是个人口径还是双成人家庭。', build:scopeStep},
    {key:'currentAge', title:'当前年龄', hint:'第一题', desc:'用现在的年龄开始估算。', build:rangeStep('currentAge',18,70,1,'岁')},
    {key:'fiAge', title:'计划退休年龄', hint:'第二题', desc:'这里相当于你想达到 FIRE 的年龄。', build:rangeStep('fiAge',35,80,1,'岁')},
    {key:'currentCity', title:'现在在哪个城市', hint:'第三题', desc:'当前城市会影响你现在的生活成本。', build:cityStep('currentCity')},
    {key:'path', title:'退休地点和路径', hint:'第四题', desc:'如果你退休后会搬去别的地方，就在这里选。', build:pathStep},
    {key:'housing', title:'住房方式', hint:'第五题', desc:'租房或买房会影响目标财富和年度支出。', build:housingStep},
    {key:'assets', title:'当前可投资资产', hint:'第六题', desc:'这是你现在可以拿来投资的资产规模。', build:rangeMoneyStep('assets',0,10000000,50000,'$')},
    {key:'income', title:'你的当前税前年收入', hint:'第七题', desc:'先用你自己的税前收入做估算。', build:rangeMoneyStep('income',0,1500000,10000,'$/年')},
    {key:'partnerOrLifestyle', title:'第二位成人收入 / 生活方式', hint:'第八题', desc:'如果你是双成人家庭，填第二位成人收入；如果是个人口径，就选生活方式。', build:partnerOrLifestyleStep},
    {key:'kidsOrRetireWork', title:'孩子和退休后工作', hint:'第九题', desc:'最后一题，把孩子数量和退休后是否还想保留一点收入一起定下来。', build:kidsAndPostRetireStep}
  ];

  function syncSummary(){
    el('stepLabel').textContent = `第 ${idx + 1} 题 / ${steps.length}`;
    el('stepHint').textContent = steps[idx].hint;
    el('stepKicker').textContent = `Step ${idx + 1}`;
    el('stepCount').textContent = `${idx + 1} / ${steps.length}`;
    el('qTitle').textContent = steps[idx].title;
    el('qDesc').textContent = steps[idx].desc;
    el('progressBar').style.width = `${((idx + 1) / steps.length) * 100}%`;
    el('prevBtn').disabled = idx === 0;
    el('nextBtn').textContent = idx === steps.length - 1 ? '完成并估算' : '下一题';
  }

  function renderStep(){
    syncSummary();
    el('body').innerHTML = steps[idx].build();
    syncWidgets();
  }

  function syncWidgets(){
    setActiveButtons('[data-group="scope"] .choice', state.scope);
    setActiveButtons('[data-group="path"] .choice', state.path);
    setActiveButtons('[data-group="housing"] .choice', state.housing);
    setActiveButtons('[data-group="lifestyle"] .choice', state.lifestyle);
    setActiveButtons('[data-group="kids"] .choice', String(state.kids));
    setSelect('select-currentCity', state.currentCity);
    setSelect('select-retireCity', state.retireCity);
    ['currentAge','fiAge','assets','income','partnerIncome','postRetireIncome','downPay','carryRate'].forEach(key => {
      const input = el(`range-${key}`);
      if(input) input.value = state[key];
      const pill = el(`pill-${key}`);
      if(pill){
        if(key === 'assets') pill.textContent = money(state[key]);
        else if(key === 'income' || key === 'partnerIncome') pill.textContent = moneyYr(state[key]);
        else if(key === 'postRetireIncome' || key === 'downPay' || key === 'carryRate') pill.textContent = pct(state[key]);
        else pill.textContent = `${state[key]}岁`;
      }
    });
    const buyHint = el('buyHint');
    if(buyHint) buyHint.classList.toggle('hidden', state.housing !== 'buy');
    const partnerWrap = el('partnerWrap');
    if(partnerWrap) partnerWrap.classList.toggle('hidden', state.scope !== 'family');
  }

  function setActiveButtons(selector, value){
    document.querySelectorAll(selector).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === String(value));
    });
  }
  function setSelect(id, value){
    const sel = el(id);
    if(sel) sel.value = value;
  }

  function scopeStep(){
    return `
      <div class="choices" data-group="scope">
        <button class="choice" data-value="individual"><strong>个人口径</strong><small>一个人有收入</small></button>
        <button class="choice" data-value="family"><strong>双成人家庭</strong><small>两个人一起算</small></button>
      </div>`;
  }
  function rangeStep(key, min, max, step, suffix){
    return () => `
      <div class="field">
        <label>${key === 'currentAge' ? '当前年龄' : '计划退休年龄'}</label>
        <input id="range-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}">
        <div class="value-row"><span>${min}${suffix} - ${max}${suffix}</span><span class="value-pill" id="pill-${key}">${state[key]}${suffix}</span></div>
      </div>`;
  }
  function rangeMoneyStep(key, min, max, step, suffix){
    return () => `
      <div class="field">
        <label>${key === 'assets' ? '当前可投资资产' : '当前税前年收入'}</label>
        <input id="range-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}">
        <div class="value-row"><span>${money(min)} - ${money(max)}${suffix}</span><span class="value-pill" id="pill-${key}">${key === 'assets' ? money(state[key]) : moneyYr(state[key])}</span></div>
      </div>`;
  }
  function cityOptions(selected){
    return Object.entries(M.CITY).map(([k,c]) => `<option value="${k}" ${k===selected?'selected':''}>${cityLabel(c)}</option>`).join('');
  }
  function cityStep(key){
    return () => `
      <div class="field">
        <label>${key === 'currentCity' ? '当前城市' : '退休 / 迁居城市'}</label>
        <select id="select-${key}">${cityOptions(state[key])}</select>
      </div>`;
  }
  function pathStep(){
    return `
      <div class="choices" data-group="path">
        <button class="choice" data-value="returnChina"><strong>退休后换到目标城市</strong><small>比如回国或换到别的地方</small></button>
        <button class="choice" data-value="stayUS"><strong>留在美国</strong><small>一直按美国城市算</small></button>
      </div>`;
  }
  function housingStep(){
    return `
      <div class="choices" data-group="housing">
        <button class="choice" data-value="rent"><strong>租房</strong><small>更轻资产</small></button>
        <button class="choice" data-value="buy"><strong>买房</strong><small>更高住房预算</small></button>
      </div>
      <div class="field" id="buyHint">
        <label>买房默认参数</label>
        <div class="value-row"><span>首付比例 ${pct(state.downPay)}</span><span>房产持有成本 ${pct(state.carryRate)}</span></div>
        <input id="range-downPay" type="range" min=".05" max=".60" step=".05" value="${state.downPay}">
        <input id="range-carryRate" type="range" min="0" max=".035" step=".001" value="${state.carryRate}" style="margin-top:6px">
      </div>`;
  }
  function partnerOrLifestyleStep(){
    if(state.scope === 'family'){
      return `
        <div class="field" id="partnerWrap">
          <label>第二位成人税前年收入</label>
          <input id="range-partnerIncome" type="range" min="0" max="1500000" step="10000" value="${state.partnerIncome}">
          <div class="value-row"><span>$0 - $1.5M</span><span class="value-pill" id="pill-partnerIncome">${moneyYr(state.partnerIncome)}</span></div>
        </div>
        <div class="field">
          <label>生活方式</label>
          <div class="choices" data-group="lifestyle">
            <button class="choice" data-value="lean"><strong>节制</strong><small>更省一点</small></button>
            <button class="choice" data-value="base"><strong>舒适</strong><small>默认</small></button>
            <button class="choice" data-value="comfort"><strong>宽裕</strong><small>更宽松</small></button>
          </div>
        </div>`;
    }
    return `
      <div class="field" id="lifestyleWrap">
        <label>生活方式</label>
        <div class="choices" data-group="lifestyle">
          <button class="choice" data-value="lean"><strong>节制</strong><small>更省一点</small></button>
          <button class="choice" data-value="base"><strong>舒适</strong><small>默认</small></button>
          <button class="choice" data-value="comfort"><strong>宽裕</strong><small>更宽松</small></button>
        </div>
      </div>`;
  }
  function kidsAndPostRetireStep(){
    return `
      <div class="field">
        <label>孩子数量</label>
        <div class="choices" data-group="kids">
          <button class="choice" data-value="0"><strong>0 个</strong><small>不计教育成本</small></button>
          <button class="choice" data-value="1"><strong>1 个</strong><small>单个孩子</small></button>
          <button class="choice" data-value="2"><strong>2 个</strong><small>默认</small></button>
        </div>
      </div>
      <div class="field">
        <label>退休后劳动收入保留比例</label>
        <input id="range-postRetireIncome" type="range" min="0" max="1" step=".05" value="${state.postRetireIncome}">
        <div class="value-row"><span>0% - 100%</span><span class="value-pill" id="pill-postRetireIncome">${pct(state.postRetireIncome)}</span></div>
      </div>`;
  }

  function renderResult(){
    const fireAge = M.fireAgeEstimate(state);
    const need = M.targetNeed(state);
    const assetsAtFi = M.projectedAssetsAt(state, state.fiAge);
    el('questionCard').classList.add('hidden');
    el('resultCard').classList.remove('hidden');
    el('resultAge').textContent = fireAge === null ? '80 岁前还没到' : `${fireAge} 岁左右`;
    el('resultLine').textContent = fireAge === null
      ? '按当前答案，模型在 80 岁之前还没有跑到你的目标财富。'
      : `按当前答案，粗略的 FIRE 年龄大约是 ${fireAge} 岁。`;
    el('resNowSpend').textContent = moneyYr(M.currentSpend(state));
    el('resRetireSpend').textContent = moneyYr(M.retireSpend(state));
    el('resTarget').textContent = money(need);
    el('resAtFi').textContent = money(assetsAtFi);
    const gap = Math.max(0, need - assetsAtFi);
    el('resultNote').textContent = `说明：这是一个手机问答版的快速估算。你当前的输入摘要是「${M.summaryLine(state)}」。按目前答案，退休年龄 ${state.fiAge} 岁时的目标财富大约是 ${money(need)}，而当前路径在 ${state.fiAge} 岁时大约有 ${money(assetsAtFi)}，差额约 ${money(gap)}。如果你要更细的税务、房贷和现金流拆分，还是用完整 dashboard。`;
  }

  function updateStateFromInput(e){
    const id = e.target.id || '';
    const n = v => Number(v);
    if(id === 'range-currentAge') state.currentAge = n(e.target.value);
    if(id === 'range-fiAge') state.fiAge = n(e.target.value);
    if(id === 'select-currentCity') state.currentCity = e.target.value;
    if(id === 'select-retireCity') state.retireCity = e.target.value;
    if(id === 'range-assets') state.assets = n(e.target.value);
    if(id === 'range-income') state.income = n(e.target.value);
    if(id === 'range-partnerIncome') state.partnerIncome = n(e.target.value);
    if(id === 'range-postRetireIncome') state.postRetireIncome = n(e.target.value);
    if(id === 'range-downPay') state.downPay = n(e.target.value);
    if(id === 'range-carryRate') state.carryRate = n(e.target.value);
    renderStep();
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-group] .choice');
    if(!btn) return;
    const group = btn.closest('[data-group]').dataset.group;
    const value = btn.dataset.value;
    if(group === 'kids') state.kids = Number(value);
    else state[group] = value;
    renderStep();
  });
  document.addEventListener('input', e => {
    if(e.target.matches('input[type="range"], select')) updateStateFromInput(e);
  });
  el('prevBtn').addEventListener('click', () => {
    if(idx > 0){ idx--; renderStep(); window.scrollTo({top:0, behavior:'smooth'}); }
  });
  el('nextBtn').addEventListener('click', () => {
    if(idx < steps.length - 1){
      idx++;
      renderStep();
      window.scrollTo({top:0, behavior:'smooth'});
      return;
    }
    renderResult();
    window.scrollTo({top:0, behavior:'smooth'});
  });
  el('restartBtn').addEventListener('click', () => {
    Object.assign(state, M.cloneDefaultState());
    idx = 0;
    el('resultCard').classList.add('hidden');
    el('questionCard').classList.remove('hidden');
    renderStep();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  renderStep();
})();
