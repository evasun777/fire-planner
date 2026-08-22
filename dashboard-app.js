(function(){
const S={scope:'family',kids:2,childBirthAge:32,childBirthAgeManual:true,childcare:'mixed',usSchool:'public',cnSchool:'intl',currentCity:'bay',city:'bay',housing:'buy',homePurchaseAge:45,homePurchaseAgeManual:false,homePriceManual:false,lifestyle:'base',chartMode:'detail',projectionMode:'current',relocationPath:'stayUS',taxState:'CA',taxMode:'auto',lang:'bilingual',tab:'cost',incomeGrowth:0.05,autoFood:{pre:true,post:true},livingPartsAuto:{pre:true,post:true},livingParts:{pre:{food:0,goods:0,insurance:0,medical:0,misc:0},post:{food:0,goods:0,insurance:0,medical:0,misc:0}}};
 let currentPathFireAge=null;
 let currentPathFireIndex=-1;
 const CITY={
  bay:{nameZh:'湾区',nameEn:'Bay Area',country:'US',livingFactor:1.00,rent3:6500*12,rent4:8000*12,buy3:1900000,buy4:2300000,secondAdult:22000,health1:12000,health2:8500,travel:18000,srcZh:'舒适型家庭住房：单成人+孩子按3BR，双成人+孩子按4BR。',srcEn:'Comfortable family baseline: 3BR for one adult plus kids, 4BR for two adults plus kids.'},
  nyc:{nameZh:'纽约',nameEn:'New York',country:'US',livingFactor:1.14,rent3:7500*12,rent4:9000*12,buy3:1700000,buy4:2100000,secondAdult:24000,health1:13500,health2:9000,travel:18000,srcZh:'纽约按 Manhattan/近核心区家庭型住房的高成本假设。',srcEn:'New York assumes a high-cost Manhattan / near-core family baseline.'},
  seattle:{nameZh:'西雅图',nameEn:'Seattle',country:'US',livingFactor:0.95,rent3:4600*12,rent4:5600*12,buy3:1250000,buy4:1550000,secondAdult:20000,health1:11000,health2:8000,travel:17000,srcZh:'西雅图按高薪科技城市但住房仍偏贵的规划假设。',srcEn:'Seattle assumes a high-income tech city with still-elevated housing costs.'},
  losangeles:{nameZh:'洛杉矶',nameEn:'Los Angeles',country:'US',livingFactor:1.02,rent3:4200*12,rent4:5200*12,buy3:1150000,buy4:1450000,secondAdult:20500,health1:11200,health2:8000,travel:17000,srcZh:'洛杉矶按大都会区改善型家庭成本估算。',srcEn:'Los Angeles assumes a metro-area family planning baseline.'},
  dallas:{nameZh:'达拉斯',nameEn:'Dallas',country:'US',livingFactor:0.82,rent3:3200*12,rent4:4000*12,buy3:850000,buy4:1050000,secondAdult:18000,health1:10000,health2:7500,travel:16000,srcZh:'达拉斯按较低住房成本、较强车依赖的家庭假设。',srcEn:'Dallas assumes lower housing costs and more car-dependent family spending.'},
  shanghai:{nameZh:'上海',nameEn:'Shanghai',country:'CN',livingFactor:0.68,rent3:2100*12,rent4:2800*12,buy3:1500000,buy4:2000000,secondAdult:16000,health1:9000,health2:6500,travel:18000,srcZh:'上海改善型家庭长租：3居与4居分开，不再把双成人总支出翻倍。',srcEn:'Shanghai uses a family-friendly rental baseline and does not double total spending for two adults.'},
  hangzhou:{nameZh:'杭州',nameEn:'Hangzhou',country:'CN',livingFactor:0.56,rent3:1400*12,rent4:1800*12,buy3:950000,buy4:1250000,secondAdult:14000,health1:8000,health2:5500,travel:17000,srcZh:'杭州舒适型改善住房：3居约$1.4k/月，4居约$1.8k/月；成人2增加的是边际成本。',srcEn:'Hangzhou uses comfortable-upgrade housing assumptions with incremental second-adult costs.'},
  suzhou:{nameZh:'苏州',nameEn:'Suzhou',country:'CN',livingFactor:0.52,rent3:1050*12,rent4:1350*12,buy3:700000,buy4:900000,secondAdult:13000,health1:8000,health2:5500,travel:16000,srcZh:'苏州相对杭州住房和日常生活成本略低。',srcEn:'Suzhou is modeled slightly below Hangzhou for housing and everyday expenses.'},
  chengdu:{nameZh:'成都',nameEn:'Chengdu',country:'CN',livingFactor:0.50,rent3:950*12,rent4:1250*12,buy3:620000,buy4:800000,secondAdult:13000,health1:8000,health2:5500,travel:17000,srcZh:'成都改善型3–4居室假设；金融城/高新区会更高。',srcEn:'Chengdu uses a 3-4BR improvement baseline; Finance City / Hi-tech zones can be higher.'},
  kunming:{nameZh:'昆明',nameEn:'Kunming',country:'CN',livingFactor:0.44,rent3:750*12,rent4:1000*12,buy3:450000,buy4:580000,secondAdult:12000,health1:7500,health2:5000,travel:16000,srcZh:'昆明生活成本较低，住房按改善型3–4居室。',srcEn:'Kunming has lower living costs and a comfortable 3-4BR housing baseline.'},
  dali:{nameZh:'大理',nameEn:'Dali',country:'CN',livingFactor:0.47,rent3:850*12,rent4:1150*12,buy3:520000,buy4:680000,secondAdult:12000,health1:8000,health2:5500,travel:18000,srcZh:'大理旅游属性强，长期租金波动更大。',srcEn:'Dali has stronger tourism effects and more volatile long-term rent.'},
  haikou:{nameZh:'海口',nameEn:'Haikou',country:'CN',livingFactor:0.46,rent3:850*12,rent4:1150*12,buy3:520000,buy4:680000,secondAdult:12000,health1:8000,health2:5500,travel:17000,srcZh:'海口按改善型家庭长租；新片区差异较大。',srcEn:'Haikou uses an improved-family rental baseline with area-level variation.'},
  taiyuan:{nameZh:'太原',nameEn:'Taiyuan',country:'CN',livingFactor:0.40,rent3:700*12,rent4:950*12,buy3:380000,buy4:500000,secondAdult:11000,health1:7000,health2:5000,travel:15000,srcZh:'太原按改善型3–4居室，不使用豪宅挂牌作为默认。',srcEn:'Taiyuan uses a comfortable 3-4BR baseline and avoids luxury-listing defaults.'}
 };
 const LIFE={lean:.82,base:1,comfort:1.28};
 let CC={daycare:{y0:45000,y15:22000},mixed:{y0:60000,y15:30000},nanny:{y0:80000,y15:50000}};
 let SCHOOL={usPublic:12000,usPrivate:35000,cnIntl:32500,cnPublic:8000,stayUS:0,college:20000};
 const LANG={
  zh:{
   hero:'FIRE 财富自由规划器',section1:'1. 计算口径',section2:'2. 时间、地点与年度支出',section3:'3. 孩子与教育',section4:'4. 当前资产与收入（0-10M scale）',section5:'5. 财富自由时间线',section6:'6. 年度收入、支出、总资产（至80岁）',section7:'7. 年度明细（至80岁）',section8:'8. 达标路径：按财富自由所需税前年收入',faq:'8. FAQ',overview:'总览',detail:'细分',buyNow:'买房模式默认：<b>如果退休地点和当前地点相同，就现在买；如果不同，就搬到退休地点那一年再买</b>。首付从当前可投资资产中扣除，之后逐年支付房贷并累积房屋净值。',scopeIndividual:'当前：1个成人（只算1份收入）+ 你选择的孩子数量。',scopeFamily:'当前：2个成人（算2份收入）+ 同样的孩子数量；孩子成本不翻倍。',returnChina:'当前选择“回国”：模型在 {age} 岁开始切换到你选择的中国退休/半退休城市生活成本。',stayUS:'当前选择“留在美国”：模型不会使用回国年龄，也不会切换到中国城市成本；退休生活继续按美国住房和生活成本计算。',cityRule:'住房计算规则：卧室数 = 成人数 + 孩子数。1–2居价格目前按同城3居基准做规划型比例估算；3–4居使用城市设定值。',cityBuy:'当前选择买房。模型会根据“当前地点 vs 退休地点”决定购买时点：如果两者相同，就现在买；如果不同，就在搬到退休地点那一年开始买房。首付按 {down}% 计算，剩余部分按 {yrs} 年、{rate}% 房贷逐年偿还。退休目标只计当时房屋净值 + 剩余房贷现值，不会再次加入整套房价。',cityRent:'当前选择租房。房产预算为 $0；模型按 {beds} 居长期租金 {rent}/月计入退休后的长期年度支出。',taxMode:'自动估算',manualTax:'手动有效税率',overviewLegend:'劳动收入 / 被动收入 / 年度支出 / 总财富（右轴）',detailLegend1:'0线上方 = 收入：劳动收入（本人 / 伴侣） + 被动收入（资产提取 / 投资收益）',detailLegend2:'Below zero = spending: housing / living / travel / parents / family support / kids',cityLabel:'当前城市 assumption',allYear:'7. 年度明细（至80岁）',retPath:'长期居住路径',retAge:'回国 / 退休切换年龄',currentAge:'当前年龄',fiAge:'预期退休 / 工作可选年龄',postRetire:'退休后劳动收入保留比例',withdraw:'退休后资产提取率',kids:'孩子数量',childcare:'0–5岁育儿方式',usSchool:'美国阶段学校',cnSchool:'回国后学校',retHousing:'退休住房',lifestyle:'退休后生活方式',assets:'你当前可投资资产',income:'你当前税前年收入',partnerIncome:'第二位成人税前年收入（0-1.5M）',state:'报税所在州',taxCalc:'税率计算方式',taxHint:'如果你大概知道自己的 effective tax rate，可以直接覆盖自动估算。',taxRate:'估算有效税率',retReturn:'长期实际投资回报',lifestyleAssumption:'<b>退休后生活方式是一个乘数</b>：节制 = 0.82×，舒适 = 1.00×，宽裕 = 1.28×。它只会乘在<b>退休后的生活费</b>上（医疗已并入生活费），不会自动放大退休前的当前支出，也不会自动放大房贷、旅行、父母或孩子支出。',bayBaseSpend:'当前地点单人基础生活费（不含房贷）',bayBaseSpendDesc:'Bay Area baseline living cost is multiplied by the city factor for each location; this single-person baseline is then split into food / goods / insurance / medical / misc, and medical is no longer double-counted at the top level.',required:'如果想按时退休',requiredDesc:'If you choose buy, the target includes a housing budget; if you choose rent, housing budget is $0 but rent continues into retirement spending, which increases required investable assets.',wealthSectionTitle:'资产 vs 负债',wealthNote:'This chart focuses on asset structure, not cash flow: investable assets, home equity, mortgage balance, and total wealth.'},
  en:{
   hero:'FIRE Financial Freedom Planner',section1:'1. Household',section2:'2. Time, location, and yearly expense',section3:'3. Kids & Education',section4:'4. Current Assets & Income (0-3M scale)',section5:'5. FIRE timeline',section6:'6. Current path: annual income, spending, and total assets (to age 80)',section7:'7. Annual detail (to age 80)',section8:'8. Target path: required gross income for FIRE',faq:'8. FAQ',overview:'Overview',detail:'Detail',buyNow:'Buy mode defaults to <b>buying now</b>. The down payment is deducted from current investable assets, then mortgage principal and interest are paid over time while home equity accumulates.',scopeIndividual:'Current: 1 adult (1 income) + selected children count.',scopeFamily:'Current: 2 adults (2 incomes) + the same children count; children costs do not double.',returnChina:'Current setting "Return to China": the model switches to the selected China retirement / semi-retirement city cost at age {age}.',stayUS:'Current setting "Stay in the US": the model does not use the return age or switch to China city costs; retirement continues on US housing and living costs.',cityRule:'Housing rule: bedrooms = adults + children. 1-2BR prices are proportional estimates based on the local 3BR baseline; 3-4BR use city-specific assumptions.',cityBuy:'Buying mode assumes you purchase now with a {down}% down payment for a {beds}-bedroom home priced at {home}. The down payment is deducted immediately, and the mortgage is amortized over {yrs} years at {rate}% APR. The retirement target only counts home equity plus remaining mortgage PV, not the full house price again.',cityRent:'Rent mode sets home budget to $0; the model uses the long-term rent for a {beds}-bedroom home, {rent}/month, in retirement spending.',taxMode:'Auto estimate',manualTax:'Manual effective tax rate',overviewLegend:'Labor income / passive income / annual spending / total wealth (right axis)',detailLegend1:'Above zero = income: labor income (self / partner) + passive income (withdrawals / investment returns)',detailLegend2:'Below zero = spending: housing / living / travel / parents / family support / kids',cityLabel:'Current city assumption',allYear:'7. Annual detail (to age 80)',retPath:'Long-term location',retAge:'Return / retirement switch age',currentAge:'Current age',fiAge:'Expected retirement / work-optional age',postRetire:'Post-retirement labor income kept',withdraw:'Post-retirement withdrawal rate',kids:'Kids',childcare:'Ages 0-5 childcare',usSchool:'US school type',cnSchool:'School type in China',retHousing:'Retirement housing',lifestyle:'Retirement lifestyle',assets:'Current investable assets',income:'Current gross income',partnerIncome:'Second adult gross income (0-1.5M scale)',state:'Tax filing state',taxCalc:'Tax calculation mode',taxHint:'If you already know your effective tax rate, you can override the auto estimate.',taxRate:'Estimated effective tax rate',retReturn:'Long-term real return',lifestyleAssumption:'<b>Retirement lifestyle is a multiplier</b>: Lean = 0.82x, Base = 1.00x, Comfort = 1.28x. It only multiplies <b>post-retirement living spending</b> (medical is embedded inside living), and does not automatically scale pre-retirement current spending, housing, travel, parents, or kids costs.',bayBaseSpend:'Current city single-person baseline living cost (excluding housing)',bayBaseSpendDesc:'Bay Area baseline living cost is multiplied by the city factor for each location; this single-person baseline is then split into food / goods / insurance / medical / misc, and medical is no longer double-counted at the top level.',required:'If you choose buy, the target includes a housing budget; if you choose rent, housing budget is $0 but rent continues into retirement spending, which increases required investable assets.',wealthSectionTitle:'Asset vs liability',wealthNote:'This chart focuses on asset structure, not cash flow: investable assets, home equity, mortgage balance, and total wealth.'}
 };
 LANG.bilingual = Object.fromEntries(Object.keys({...LANG.zh, ...LANG.en}).map(k=>{
  const zh = LANG.zh[k] ?? '';
  const en = LANG.en[k] ?? '';
  if(!zh) return [k,en];
  if(!en || zh===en) return [k,zh];
  return [k,`${zh} / ${en}`];
 }));
 const $=id=>document.getElementById(id),$$=sel=>document.querySelectorAll(sel),n=id=>Number($(id).value)||0;
 const money=x=>(x<0?'−':'')+'$'+Math.round(Math.abs(x)).toLocaleString('en-US'),compact=x=>(x<0?'−':'')+'$'+(Math.abs(x)/1e6).toFixed(2)+'M';
 const CITY_ORDER=['bay','nyc','seattle','losangeles','dallas','shanghai','hangzhou','suzhou','chengdu','kunming','dali','haikou','taiyuan'];
const FOOD_SAMPLE_URL='assumptions/city_food_spend_model.csv';
const HOUSING_SAMPLE_URL='assumptions/city_housing_model.csv';
const KIDS_EDU_SAMPLE_URL='assumptions/kids_education_model.csv';
let FOOD_SAMPLE_ROWS=[];
let FOOD_SAMPLE_BY_KEY={};
let FOOD_SAMPLE_STATUS='Loading sample CSV…';
let HOUSING_SAMPLE_ROWS=[];
let HOUSING_SAMPLE_BY_KEY={};
let HOUSING_SAMPLE_STATUS='Loading housing CSV…';
let KIDS_EDU_SAMPLE_ROWS=[];
let KIDS_EDU_SAMPLE_BY_KEY={};
let KIDS_EDU_SAMPLE_STATUS='Loading kids & education CSV…';
 function parseCSV(text){
  const rows=[];
  let row=[];
  let cell='';
  let inQuotes=false;
  const pushCell=()=>{row.push(cell);cell='';};
  const pushRow=()=>{if(row.length) rows.push(row);row=[];};
  const normalized=String(text||'').replace(/^\uFEFF/,'');
  for(let i=0;i<normalized.length;i++){
    const ch=normalized[i];
    const next=normalized[i+1];
    if(inQuotes){
      if(ch==='"'&&next==='"'){cell+='"';i++;continue;}
      if(ch==='"'){inQuotes=false;continue;}
      cell+=ch;
      continue;
    }
    if(ch==='"'){inQuotes=true;continue;}
    if(ch===','){pushCell();continue;}
    if(ch==='\n'){pushCell();pushRow();continue;}
    if(ch==='\r') continue;
    cell+=ch;
  }
  if(cell.length||row.length){pushCell();pushRow();}
  return rows;
 }
function normalizeFoodCityKey(value){
  const text=String(value||'').toLowerCase();
  if(text.includes('bay area') || text.includes('san francisco bay')) return 'bay';
  if(text.includes('san francisco')) return 'bay';
  if(text.includes('new york')) return 'nyc';
  if(text.includes('shanghai')) return 'shanghai';
  if(text.includes('chengdu')) return 'chengdu';
  return '';
 }
 function numOrBlank(value){
  const n=Number(String(value).replace(/[$,]/g,''));
  return Number.isFinite(n) ? n : '';
 }
function moneyMaybe(value){
  return value==='' ? '—' : '$' + Math.round(Number(value)).toLocaleString('en-US');
}
function moneyOrDash(value){
  return value==='' || value==null ? '—' : money(value);
}
function sourceLink(url){
  if(!url) return '—';
  return `<a href="${url}" target="_blank" rel="noopener">source</a>`;
}
 async function loadFoodSampleCSV(){
  try{
    const res=await fetch(FOOD_SAMPLE_URL,{cache:'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text=await res.text();
    const rows=parseCSV(text);
    const header=rows.shift()||[];
    FOOD_SAMPLE_ROWS=rows.map(cols=>{
      const obj={};
      header.forEach((h,i)=>{obj[h]=cols[i]??'';});
    const row={
        ...obj,
        cityZh:String(obj.city_zh||obj.city||'').trim(),
        cityEn:String(obj.city_en||'').trim(),
        city:String(obj.city||obj.city_zh||'').trim(),
        key:String(obj.city_key||'').trim() || normalizeFoodCityKey(obj.city||obj.city_zh),
        food_per_person_usd:numOrBlank(obj.food_per_person_usd),
        food_per_person_monthly_usd:numOrBlank(obj.food_per_person_monthly_usd),
        food_factor_vs_bay:numOrBlank(obj.food_factor_vs_bay),
        source_notes:String(obj.source_notes||'').trim()
      };
      return row;
    }).filter(row=>row.cityZh || row.city || row.cityEn);
    FOOD_SAMPLE_BY_KEY=FOOD_SAMPLE_ROWS.reduce((acc,row)=>{
      if(row.key) acc[row.key]=row;
      return acc;
    },{});
    FOOD_SAMPLE_STATUS=`Loaded ${FOOD_SAMPLE_ROWS.length} sample rows from CSV`;
  }catch(err){
    FOOD_SAMPLE_ROWS=[];
    FOOD_SAMPLE_BY_KEY={};
    FOOD_SAMPLE_STATUS='CSV load failed';
  }
  const statusEl=$('foodSampleStatus');
  if(statusEl) statusEl.textContent=FOOD_SAMPLE_STATUS;
  const rowsEl=$('foodSampleRows');
  if(rowsEl){
    rowsEl.innerHTML=FOOD_SAMPLE_ROWS.length
      ? FOOD_SAMPLE_ROWS.map(row=>`<tr>
          <td>${row.cityZh || row.city || '—'}</td>
          <td>${row.cityEn || row.cityZh || row.city || '—'}</td>
          <td>${moneyMaybe(row.food_per_person_usd)}</td>
          <td>${moneyMaybe(row.food_per_person_monthly_usd)}</td>
          <td>${row.food_factor_vs_bay===''?'—':Number(row.food_factor_vs_bay).toFixed(2)}x</td>
          <td>${sourceLink(row.source_url)}</td>
        </tr>`).join('')
      : `<tr><td colspan="6">${FOOD_SAMPLE_STATUS}</td></tr>`;
  }
 }
 async function loadHousingSampleCSV(){
  try{
    const res=await fetch(HOUSING_SAMPLE_URL,{cache:'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text=await res.text();
    const rows=parseCSV(text);
    const header=rows.shift()||[];
    HOUSING_SAMPLE_ROWS=rows.map(cols=>{
      const obj={};
      header.forEach((h,i)=>{obj[h]=cols[i]??'';});
      return {
        ...obj,
        cityZh:String(obj.city_zh||obj.city||'').trim(),
        cityEn:String(obj.city_en||'').trim(),
        city:String(obj.city||obj.city_zh||'').trim(),
        city_key:String(obj.city_key||'').trim(),
        rent_3br_monthly_usd:numOrBlank(obj.rent_3br_monthly_usd),
        rent_3br_annual_usd:numOrBlank(obj.rent_3br_annual_usd),
        rent_4br_monthly_usd:numOrBlank(obj.rent_4br_monthly_usd),
        rent_4br_annual_usd:numOrBlank(obj.rent_4br_annual_usd),
        buy_3br_usd:numOrBlank(obj.buy_3br_usd),
        buy_4br_usd:numOrBlank(obj.buy_4br_usd),
        living_factor:numOrBlank(obj.living_factor),
        source_note:String(obj.source_note||'').trim()
      };
    }).filter(row=>row.city_key);
    HOUSING_SAMPLE_BY_KEY=HOUSING_SAMPLE_ROWS.reduce((acc,row)=>{
      acc[row.city_key]=row;
      return acc;
    },{});
    HOUSING_SAMPLE_STATUS=`Loaded ${HOUSING_SAMPLE_ROWS.length} housing rows from CSV`;
  }catch(err){
    HOUSING_SAMPLE_ROWS=[];
    HOUSING_SAMPLE_BY_KEY={};
    HOUSING_SAMPLE_STATUS='Housing CSV load failed';
  }
  const statusEl=$('housingSampleStatus');
  if(statusEl) statusEl.textContent=HOUSING_SAMPLE_STATUS;
  const rowsEl=$('housingSampleRows');
  if(rowsEl){
    rowsEl.innerHTML=HOUSING_SAMPLE_ROWS.length
      ? HOUSING_SAMPLE_ROWS.map(row=>`<tr>
          <td>${row.cityZh || row.city || '—'}</td>
          <td>${row.cityEn || row.cityZh || row.city || '—'}</td>
          <td>${moneyMaybe(row.rent_3br_monthly_usd)}</td>
          <td>${moneyMaybe(row.rent_3br_annual_usd)}</td>
          <td>${moneyMaybe(row.rent_4br_monthly_usd)}</td>
          <td>${moneyMaybe(row.rent_4br_annual_usd)}</td>
          <td>${moneyMaybe(row.buy_3br_usd)}</td>
          <td>${moneyMaybe(row.buy_4br_usd)}</td>
          <td>${row.living_factor===''?'—':Number(row.living_factor).toFixed(2)}x</td>
          <td>${row.source_note || '—'}</td>
        </tr>`).join('')
      : `<tr><td colspan="10">${HOUSING_SAMPLE_STATUS}</td></tr>`;
  }
 }
 async function loadKidsEduSampleCSV(){
  try{
    const res=await fetch(KIDS_EDU_SAMPLE_URL,{cache:'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text=await res.text();
    const rows=parseCSV(text);
    const header=rows.shift()||[];
    KIDS_EDU_SAMPLE_ROWS=rows.map(cols=>{
      const obj={};
      header.forEach((h,i)=>{obj[h]=cols[i]??'';});
      return {
        ...obj,
        key:String(obj.key||'').trim(),
        category:String(obj.category||'').trim(),
        labelZh:String(obj.label_zh||'').trim(),
        labelEn:String(obj.label_en||'').trim(),
        annualCost:numOrBlank(obj.annual_cost_usd),
        annualCostY0:numOrBlank(obj.annual_cost_y0_usd),
        annualCostY15:numOrBlank(obj.annual_cost_y15_usd),
        appliesTo:String(obj.applies_to||'').trim(),
        notes:String(obj.notes||'').trim()
      };
    }).filter(row=>row.key);
    KIDS_EDU_SAMPLE_BY_KEY=KIDS_EDU_SAMPLE_ROWS.reduce((acc,row)=>{
      acc[row.key]=row;
      return acc;
    },{});
    const cc = {
      daycare:{y0:KIDS_EDU_SAMPLE_BY_KEY.daycare?.annualCostY0 || CC.daycare.y0, y15:KIDS_EDU_SAMPLE_BY_KEY.daycare?.annualCostY15 || CC.daycare.y15},
      mixed:{y0:KIDS_EDU_SAMPLE_BY_KEY.mixed?.annualCostY0 || CC.mixed.y0, y15:KIDS_EDU_SAMPLE_BY_KEY.mixed?.annualCostY15 || CC.mixed.y15},
      nanny:{y0:KIDS_EDU_SAMPLE_BY_KEY.nanny?.annualCostY0 || CC.nanny.y0, y15:KIDS_EDU_SAMPLE_BY_KEY.nanny?.annualCostY15 || CC.nanny.y15}
    };
    const school = {
      usPublic:KIDS_EDU_SAMPLE_BY_KEY.usPublic?.annualCost || SCHOOL.usPublic,
      usPrivate:KIDS_EDU_SAMPLE_BY_KEY.usPrivate?.annualCost || SCHOOL.usPrivate,
      cnIntl:KIDS_EDU_SAMPLE_BY_KEY.cnIntl?.annualCost || SCHOOL.cnIntl,
      cnPublic:KIDS_EDU_SAMPLE_BY_KEY.cnPublic?.annualCost || SCHOOL.cnPublic,
      stayUS:KIDS_EDU_SAMPLE_BY_KEY.stayUS?.annualCost || SCHOOL.stayUS || 0,
      college:KIDS_EDU_SAMPLE_BY_KEY.college?.annualCost || SCHOOL.college
    };
    CC=cc;
    SCHOOL=school;
    KIDS_EDU_SAMPLE_STATUS=`Loaded ${KIDS_EDU_SAMPLE_ROWS.length} kids/education rows from CSV`;
  }catch(err){
    KIDS_EDU_SAMPLE_ROWS=[];
    KIDS_EDU_SAMPLE_BY_KEY={};
    KIDS_EDU_SAMPLE_STATUS='Kids & education CSV load failed';
  }
  const statusEl=$('kidsEduSampleStatus');
  if(statusEl) statusEl.textContent=KIDS_EDU_SAMPLE_STATUS;
  const rowsEl=$('kidsEduSampleRows');
  if(rowsEl){
    rowsEl.innerHTML=KIDS_EDU_SAMPLE_ROWS.length
      ? KIDS_EDU_SAMPLE_ROWS.map(row=>{
          const cost=row.category==='childcare'
            ? `${moneyMaybe(row.annualCostY0)} / ${moneyMaybe(row.annualCostY15)}`
            : moneyMaybe(row.annualCost);
          return `<tr>
            <td>${row.category || '—'}</td>
            <td>${row.labelZh || '—'}</td>
            <td>${row.labelEn || '—'}</td>
            <td>${cost}</td>
            <td>${row.appliesTo || '—'}</td>
            <td>${row.notes || '—'}</td>
          </tr>`;
        }).join('')
      : `<tr><td colspan="6">${KIDS_EDU_SAMPLE_STATUS}</td></tr>`;
  }
 }
 function L(key,vars={}){
   const mode=LANG[S.lang]||LANG.zh;
   let s=mode[key]||LANG.zh[key]||key;
   Object.keys(vars).forEach(k=>{s=s.replaceAll(`{${k}}`,vars[k])});
   return s;
 }
 function applyMainTabs(){
   const tabs=$$('#mainTabs button');
   tabs.forEach(btn=>btn.classList.toggle('active',btn.dataset.v===S.tab));
   document.querySelectorAll('.tab-panel').forEach(panel=>{
     panel.classList.toggle('is-hidden',panel.dataset.tab!==S.tab);
   });
 }
 function cityName(c){
  if(S.lang==='zh') return c.nameZh;
  if(S.lang==='en') return c.nameEn;
  return `${c.nameZh} / ${c.nameEn}`;
 }
function cityFoodSample(c){
  const key=Object.keys(CITY).find(k=>CITY[k]===c) || '';
  return FOOD_SAMPLE_BY_KEY[key] || null;
}
function cityHousingSample(c){
  const key=Object.keys(CITY).find(k=>CITY[k]===c) || '';
  return HOUSING_SAMPLE_BY_KEY[key] || null;
}
function sampleCityLabel(row){
  if(!row) return '—';
  const zh=row.cityZh || row.city || '';
  const en=row.cityEn || '';
  if(S.lang==='en') return en || zh || '—';
  if(S.lang==='zh') return zh || en || '—';
  return `${zh || en || '—'} / ${en || zh || '—'}`;
}
function citySource(c){
  if(S.lang==='zh') return c.srcZh;
  if(S.lang==='en') return c.srcEn;
  return `${c.srcZh}<br>${c.srcEn}`;
}
function summaryText(pathData=[], currentFireAge=null, displayMode='current'){
  const currentAge=n('currentAge');
  const currentCity=cityName(currentHomeCity());
  const retireCity=cityName(selectedHomeCity());
  const lifestyleText=S.lang==='en'
    ? (S.lifestyle==='lean'?'Lean':S.lifestyle==='comfort'?'Comfort':'Base')
    : (S.lifestyle==='lean'?'节制':S.lifestyle==='comfort'?'宽裕':'舒适');
  const modeText=S.lang==='en'
    ? (displayMode==='target'?'Target path':'Current path')
    : (displayMode==='target'?'达标路径':'当前路径');
  const avgIncome=pathData.length
    ? pathData.reduce((sum,x)=>sum+(x.incomeSelf+x.incomePartner+x.portfolioDraw+x.inv),0)/pathData.length
    : 0;
  const avgSpend=pathData.length
    ? pathData.reduce((sum,x)=>sum+x.spend,0)/pathData.length
    : 0;
  const avgNet=avgIncome-avgSpend;
  const growthPct=(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'');
  const fireAgeText=S.lang==='en'
    ? (currentFireAge===null
      ? 'Current-path FIRE age is not reached by age 80.'
      : `Current-path FIRE age is ${currentFireAge}.`)
    : (currentFireAge===null
      ? '按当前路径，到80岁前仍未达到财富自由年龄。'
      : `按当前路径，财富自由年龄是 ${currentFireAge} 岁。`);
  const fireDefText=S.lang==='en'
    ? 'FIRE means passive income is greater than total spending.'
    : '财富自由的定义是被动收入大于总支出。';
  const avgText=S.lang==='en'
    ? `Average annual income: ${money(avgIncome)}/yr; average annual spending: ${money(avgSpend)}/yr; average net cash flow: ${money(avgNet)}/yr.`
    : `平均年度收入：${money(avgIncome)}/年；平均年度支出：${money(avgSpend)}/年；平均净现金流：${money(avgNet)}/年。`;
  const kidsText=S.lang==='en'
    ? `${S.kids} kid${S.kids===1?'':'s'}`
    : `${S.kids}个孩子`;
  const childBirthText=S.kids===0
    ? (S.lang==='en'
      ? 'no kids planned'
      : (S.lang==='bilingual' ? '暂不计划孩子 / no kids planned' : '暂不计划孩子'))
    : (S.lang==='en'
      ? `first child at ${n('childBirthAge')} years old`
      : (S.lang==='bilingual'
        ? `第一个孩子在 ${n('childBirthAge')} 岁生 / first child at ${n('childBirthAge')} years old`
        : `第一个孩子在 ${n('childBirthAge')} 岁生`));
  const scopeText=S.scope==='family'
    ? (S.lang==='en'
      ? 'dual-adult household'
      : (S.lang==='bilingual' ? '双成人家庭 / dual-adult household' : '双成人家庭'))
    : (S.lang==='en'
      ? 'individual'
      : (S.lang==='bilingual' ? '个人口径 / individual' : '个人口径'));
  if(S.relocationPath==='returnChina'){
    return S.lang==='en'
      ? `${modeText} snapshot.<br>Household mode: ${scopeText}; post-retirement lifestyle: ${lifestyleText}; kids: ${kidsText}; ${childBirthText}; income growth: ${growthPct}%.<br>Current age: ${currentAge}; planned retirement age: ${n('fiAge')}.<br>From age ${currentAge} to age ${n('fiAge')}, we use ${currentCity}; from age ${n('fiAge')} to age 80, we use ${retireCity}.<br>${avgText}<br>${fireAgeText} ${fireDefText}`
      : `${modeText}快照。<br>家庭口径：${scopeText}；退休后生活方式：${lifestyleText}；孩子：${kidsText}；${childBirthText}；年收入增长率：${growthPct}%。<br>当前年龄：${currentAge} 岁；计划退休年龄：${n('fiAge')} 岁。<br>从 ${currentAge} 岁到 ${n('fiAge')} 岁按 ${currentCity} 计算；从 ${n('fiAge')} 岁到 80 岁按 ${retireCity} 计算。<br>${avgText}<br>${fireAgeText}${fireDefText}`;
  }
  return S.lang==='en'
    ? `${modeText} snapshot.<br>Household mode: ${scopeText}; post-retirement lifestyle: ${lifestyleText}; kids: ${kidsText}; ${childBirthText}; income growth: ${growthPct}%.<br>Current age: ${currentAge}; planned retirement age: ${n('fiAge')}.<br>From age ${currentAge} to age ${n('fiAge')}, we use ${currentCity}; from age ${n('fiAge')} to age 80, we use ${currentCity}.<br>${avgText}<br>${fireAgeText} ${fireDefText}`
    : `${modeText}快照。<br>家庭口径：${scopeText}；退休后生活方式：${lifestyleText}；孩子：${kidsText}；${childBirthText}；年收入增长率：${growthPct}%。<br>当前年龄：${currentAge} 岁；计划退休年龄：${n('fiAge')} 岁。<br>从 ${currentAge} 岁到 ${n('fiAge')} 岁按 ${currentCity} 计算；从 ${n('fiAge')} 岁到 80 岁也按 ${currentCity} 计算。<br>${avgText}<br>${fireAgeText}${fireDefText}`;
}
function stateText(v){
  const stateNames={CA:['California','California'],NY:['纽约','New York'],TX:['德州','Texas'],WA:['华盛顿州','Washington'],FL:['佛州','Florida'],MA:['马萨诸塞州','Massachusetts'],NJ:['新泽西州','New Jersey'],IL:['伊利诺伊州','Illinois'],PA:['宾夕法尼亚州','Pennsylvania'],VA:['弗吉尼亚州','Virginia'],NC:['北卡罗来纳州','North Carolina'],OTHER:['其他州','Other']};
  const [zh,en]=stateNames[v]||[v,v];
  if(S.lang==='zh') return zh;
   if(S.lang==='en') return en;
   return `${zh} / ${en}`;
 }
function bayBaseSpend(stageOrAge=livingStageForAge()){return livingBaseTargetTotal(stageOrAge)}
function livingSpendForCity(c,age=_spendAge||n('currentAge')){return Math.round(bayBaseSpend(age)*c.livingFactor)}
function cityResource(c){
  const base=money(bayBaseSpend());
  const factor=c.livingFactor.toFixed(2);
  const factorText=S.lang==='en' ? `factor ${factor}` : `系数 ${factor}`;
  const sourceText=S.lang==='en'
    ? 'Source: your Bay Area baseline input + the dashboard planning coefficients.'
    : '来源：你的湾区基准输入 + 本页面的城市规划系数。';
  return S.lang==='zh'
     ? `资料：<a href="./assumptions/ASSUMPTIONS.md" target="_blank" rel="noopener">ASSUMPTIONS.md</a> · 当前阶段基础生活费 ${base}/年 × 城市${factorText} = 该城市固定生活费。<br>${sourceText}<br>这套地点假设也会影响下面的退休住房默认值。`
     : S.lang==='en'
       ? `Resource: <a href="./assumptions/ASSUMPTIONS.md" target="_blank" rel="noopener">ASSUMPTIONS.md</a> · Current-stage baseline living cost ${base}/yr × city ${factorText} = this city's fixed living cost.<br>${sourceText}<br>This location assumption also feeds the retirement housing defaults below.`
       : `资料：<a href="./assumptions/ASSUMPTIONS.md" target="_blank" rel="noopener">ASSUMPTIONS.md</a> · 当前阶段基础生活费 ${base}/年 × 城市系数 ${factorText} = 该城市固定生活费。<br>${sourceText}<br>这套地点假设也会影响下面的退休住房默认值。`;
}
function cityFoodResource(c){
  const row=cityFoodSample(c);
  if(!row) return '';
  const month=moneyMaybe(row.food_per_person_monthly_usd);
  const year=moneyMaybe(row.food_per_person_usd);
  const factor=row.food_factor_vs_bay===''?'—':Number(row.food_factor_vs_bay).toFixed(2)+'x';
  const source=row.source_url ? `<a href="${row.source_url}" target="_blank" rel="noopener">来源</a>` : '来源';
  return `城市饮食参考：每人每月约 ${month}，每人每年约 ${year}，相对湾区系数 ${factor}。${source}。<br>这份数据目前只是参考校准，不直接进入主公式；主公式里的吃饭仍按每人每天约 30 美元的底线来推算。`;
}
function updateSpendingSummaryMeters(){
  const currentAge=n('currentAge');
  const fiAge=n('fiAge');
  const currentSpend=spend(currentAge);
  const currentLivingStage=livingStageForAge(currentAge);
  const currentHousingSpend=Math.max(0,currentSpend.breakdown?.housing||0);
  const currentLivingSpend=Math.max(0,currentSpend.breakdown?.living||0);
  let cumulativeHousing=0;
  let cumulativeLiving=0;
  for(let age=currentAge; age<fiAge; age++){
    const sp=spend(age);
    const housing=sp.breakdown?.housing||0;
    const living=sp.breakdown?.living||0;
    cumulativeHousing+=housing;
    cumulativeLiving+=living;
  }
  const setMeter=(prefix,label,value,share,sub)=>{
    const labelEl=$(prefix+'Label');
    if(labelEl) labelEl.textContent=label;
    const valueEl=$(prefix+'V');
    if(valueEl) valueEl.textContent=value;
    const barEl=$(prefix+'Bar');
    if(barEl) barEl.style.width=(Number.isFinite(share)?Math.max(0,Math.min(100,share)):0)+'%';
    const subEl=$(prefix+'S');
    if(subEl) subEl.innerHTML=sub;
  };
  const totalAnnual=Math.max(0,currentSpend.total||0);
  setMeter('housingSpend',
    S.lang==='en'?'Housing spending':(S.lang==='bilingual'?'住房支出 / Housing spending':'住房支出'),
    money(currentHousingSpend)+(S.lang==='en'?'/yr':'/年'),
    totalAnnual?currentHousingSpend/totalAnnual*100:0,
    S.lang==='en'
      ? `Annual housing spending now: ${money(currentHousingSpend)}/yr · cumulative until retirement: ${money(cumulativeHousing)}`
      : `当前年度住房支出：${money(currentHousingSpend)}/年 · 到退休前累计：${money(cumulativeHousing)}/年`
  );
  setMeter('livingSpend',
    S.lang==='en'
      ? `Current-stage living spending (${livingStageLabel(currentLivingStage)})`
      : (S.lang==='bilingual'
        ? `当前阶段家庭生活费（${livingStageLabel(currentLivingStage)}） / Current-stage living spending`
        : `当前阶段家庭生活费（${livingStageLabel(currentLivingStage)}）`),
    money(currentLivingSpend)+(S.lang==='en'?'/yr':'/年'),
    totalAnnual?currentLivingSpend/totalAnnual*100:0,
    S.lang==='en'
      ? `Annual living spending now: ${money(currentLivingSpend)}/yr · cumulative until retirement: ${money(cumulativeLiving)}`
      : `当前年度生活费：${money(currentLivingSpend)}/年 · 到退休前累计：${money(cumulativeLiving)}/年`
  );
}
function renderLanguage(){
  document.documentElement.lang=S.lang==='en'?'en':'zh-CN';
  document.title=L('hero');
  const heroTitle=document.querySelector('.hero h1');
  if(heroTitle) heroTitle.textContent=L('hero');
  const tabCostLabel=$('tabCostLabel');
  const tabCostSub=$('tabCostSub');
  const tabIncomeLabel=$('tabIncomeLabel');
  const tabIncomeSub=$('tabIncomeSub');
  const tabOutcomeLabel=$('tabOutcomeLabel');
  const tabOutcomeSub=$('tabOutcomeSub');
  if(tabCostLabel) tabCostLabel.textContent=S.lang==='en'
    ? 'Life planning & living costs'
    : (S.lang==='bilingual' ? '人生规划和生活成本 / Life planning & living costs' : '人生规划和生活成本');
  if(tabCostSub) tabCostSub.textContent=S.lang==='en'
    ? 'Inputs, assumptions, and spending'
    : (S.lang==='bilingual' ? '输入、假设和支出 / Inputs, assumptions, and spending' : '输入、假设和支出');
  if(tabIncomeLabel) tabIncomeLabel.textContent=S.lang==='en'?'Income':(S.lang==='bilingual'?'收入 / Income':'收入');
  if(tabIncomeSub) tabIncomeSub.textContent=S.lang==='en'
    ? 'Assets, taxes, and target income'
    : (S.lang==='bilingual' ? '资产、税率和达标收入 / Assets, taxes, and target income' : '资产、税率和达标收入');
   if(tabOutcomeLabel) tabOutcomeLabel.textContent=S.lang==='en'
    ? 'FIRE timeline'
    : (S.lang==='bilingual' ? '财富自由时间线 / FIRE timeline' : '财富自由时间线');
  if(tabOutcomeSub) tabOutcomeSub.textContent=S.lang==='en'
    ? 'Charts, paths, and detail'
    : (S.lang==='bilingual' ? '图表、路径和明细 / Charts, paths, and detail' : '图表、路径和明细');
  const summaryTitle=$('summaryTitle');
  if(summaryTitle) summaryTitle.textContent=S.lang==='en'
    ? 'Snapshot'
    : (S.lang==='bilingual' ? '总摘要 / Snapshot' : '总摘要');
  applyMainTabs();
  const sectionTitles=document.querySelectorAll('.card > h2:not(#summaryTitle)');
  const sectionMap=['section1','section2','section3','section4','section5','section6','faq'];
  sectionTitles.forEach((el,i)=>{if(sectionMap[i]) el.textContent=L(sectionMap[i]);});
  const annualSummary=$('annualSummary');
   if(annualSummary) annualSummary.textContent=S.lang==='en'
    ? '7. Annual detail (to age 80)'
    : (S.lang==='bilingual' ? '7. 年度明细（至80岁） / Annual detail (to age 80)' : '7. 年度明细（至80岁）');
  const downloadAnnualCsvBtn=$('downloadAnnualCsvBtn');
  if(downloadAnnualCsvBtn) downloadAnnualCsvBtn.textContent=S.lang==='en'
    ? 'Download CSV'
    : (S.lang==='bilingual' ? '下载CSV / Download CSV' : '下载CSV');
  const exportPdfBtn=$('exportPdfBtn');
  if(exportPdfBtn) exportPdfBtn.textContent=S.lang==='en'
    ? 'Export PDF'
    : (S.lang==='bilingual' ? '导出PDF / Export PDF' : '导出PDF');
  const kpiLabs=$$('.kpi .lab');
  if(kpiLabs[0]) kpiLabs[0].textContent=S.lang==='en'
    ? `Total wealth needed at age ${n('fiAge')}`
    : `${n('fiAge')}岁需要的总财富`;
  if(kpiLabs[1]) kpiLabs[1].textContent=S.lang==='en'?`Projected investable assets on current path`:'按当前路径预计可投资资产';
  if(kpiLabs[2]) kpiLabs[2].textContent=S.lang==='en'?'Required gross income':'需要的税前年收入';
  if(kpiLabs[3]) kpiLabs[3].textContent=S.lang==='en'?'Current-path total wealth at age 80':'按当前路径 80 岁总资产';
  const requiredIncomeTopLabel=$('requiredIncomeTopLabel');
  if(requiredIncomeTopLabel) requiredIncomeTopLabel.textContent=S.lang==='en'?'Required gross income':'需要的税前年收入';
  const relocationPathLabel=$('relocationPathLabel');
  if(relocationPathLabel) relocationPathLabel.textContent=L('retPath');
  const currentCityLabel=$('currentCityLabel');
  if(currentCityLabel) currentCityLabel.textContent=S.lang==='en'
    ? 'Current city'
    : (S.lang==='bilingual' ? '当前地点 / Current city' : '当前地点');
  const retirementCityLabel=$('retirementCityLabel');
  if(retirementCityLabel) retirementCityLabel.textContent=S.lang==='en'
    ? 'Retirement / semi-retirement location'
    : (S.lang==='bilingual' ? '退休 / 半退休地点 / Retirement / semi-retirement location' : '退休 / 半退休地点');
  const housingLabel=$('housingLabel');
  if(housingLabel) housingLabel.textContent=L('retHousing');
  const lifestyleLabel=$('lifestyleLabel');
  if(lifestyleLabel) lifestyleLabel.textContent=L('lifestyle');
  const kidsLabel=$('kidsLabel');
  if(kidsLabel) kidsLabel.textContent=L('kids');
  const kidsV=$('kidsV');
  if(kidsV) kidsV.textContent=S.lang==='en'?`${S.kids} kid${S.kids===1?'':'s'}`:`${S.kids}个`;
  const childBirthAgeLabel=$('childBirthAgeLabel');
  if(childBirthAgeLabel) childBirthAgeLabel.textContent=S.lang==='en'
    ? 'First child birth age'
    : (S.lang==='bilingual' ? '第一个孩子出生年龄 / First child birth age' : '第一个孩子出生年龄');
  const childBirthAgeDesc=$('childBirthAgeDesc');
  if(childBirthAgeDesc) childBirthAgeDesc.textContent=S.lang==='en'
    ? 'Costs start from the first child’s birth age. If you plan multiple children, the later ones are assumed to arrive 2 years apart unless you change the assumptions.'
    : (S.lang==='bilingual'
      ? '成本从第一个孩子出生年龄开始计算。若计划多个孩子，默认后面的孩子比第一个晚 2 年出生。 / Costs start from the first child’s birth age. If you plan multiple children, the later ones are assumed to arrive 2 years apart unless you change the assumptions.'
      : '成本从第一个孩子出生年龄开始计算。若计划多个孩子，默认后面的孩子比第一个晚 2 年出生。');
  const childBirthAgeV=$('childBirthAgeV');
  if(childBirthAgeV) childBirthAgeV.textContent=n('childBirthAge')+(S.lang==='en'?' yrs':'岁');
  const childcareLabel=$('childcareLabel');
  if(childcareLabel) childcareLabel.textContent=L('childcare');
  const kidsEduRuleLabel=$('kidsEduRuleLabel');
  if(kidsEduRuleLabel) kidsEduRuleLabel.textContent=S.lang==='en'
    ? 'Kids count is selected above'
    : (S.lang==='bilingual' ? '孩子数量现在在上面第 1 项选择 / Kids count is selected above' : '孩子数量现在在上面第 1 项选择');
  const kidsEduRuleDesc=$('kidsEduRuleDesc');
  if(kidsEduRuleDesc) kidsEduRuleDesc.textContent=S.lang==='en'
    ? 'Pick household mode and kids count first, then choose childcare and school options.'
    : (S.lang==='bilingual' ? '先选家庭口径和孩子数量，再决定托育与学校方案。 / Pick household mode and kids count first, then choose childcare and school options.' : '先选家庭口径和孩子数量，再决定托育与学校方案。');
  const kidsEduSummaryLabel=$('kidsEduSummaryLabel');
  if(kidsEduSummaryLabel) kidsEduSummaryLabel.textContent=S.lang==='en'
    ? 'Kids childcare & education total cost'
    : (S.lang==='bilingual' ? '孩子托育与教育总成本 / Kids childcare & education total cost' : '孩子托育与教育总成本');
  const usSchoolLabel=$('usSchoolLabel');
  if(usSchoolLabel) usSchoolLabel.textContent=L('usSchool');
  const cnSchoolLabel=$('cnSchoolLabel');
  if(cnSchoolLabel) cnSchoolLabel.textContent=L('cnSchool');
  const kidsEduSampleCard=$('kidsEduSampleCard');
  if(kidsEduSampleCard){
    const sum=kidsEduSampleCard.querySelector('summary .sample-title');
    if(sum) sum.textContent=S.lang==='en'
      ? 'ⓘ Kids childcare & education assumptions'
      : (S.lang==='bilingual' ? 'ⓘ 孩子托育与教育假设 / Kids childcare & education assumptions' : 'ⓘ 孩子托育与教育假设');
  }
  const kidsCostTooltipBody=$('kidsCostTooltipBody');
  if(kidsCostTooltipBody) kidsCostTooltipBody.innerHTML=S.lang==='en'
    ? 'Kids childcare and education costs are counted <b>per year</b>, not as a one-time total. Childcare ages 0-5 uses the annual value for that age band; school ages 6-17 are also annual; college ages 18-21 is annual. The model multiplies those yearly costs by the number of years the child stays in each age band, then includes the result in total spending and the wealth path. The total-cost card on the right updates when childcare or school type changes.'
    : '孩子托育与教育的支出是按“每年”计入的，不是一次性总额。0–5 岁托育会按年龄段逐年应用对应年度费用；6–17 岁学校费用也是按每年计算；18–21 岁大学按每年假设计算。模型会把这些年度费用乘上孩子实际停留在该年龄段的年数，再一起纳入总支出和财富路径。右侧的总成本卡片会随着托育或学校类型变化而更新。';
  const currentAgeLabel=$('currentAgeLabel');
  if(currentAgeLabel) currentAgeLabel.textContent=L('currentAge');
  const fiAgeLabel=$('fiAgeLabel');
  if(fiAgeLabel) fiAgeLabel.textContent=L('fiAge');
  const retAgeLabel=$('retAgeLabel');
  if(retAgeLabel) retAgeLabel.textContent=L('retAge');
  const postRetireLabel=$('postRetireLabel');
  if(postRetireLabel) postRetireLabel.textContent=L('postRetire');
  const postRetireDesc=$('postRetireDesc');
  if(postRetireDesc) postRetireDesc.textContent=S.lang==='en'
    ? 'It only affects labor income after retirement, so it changes current-path total wealth at age 80, but not the retirement-age wealth target.'
    : (S.lang==='bilingual'
      ? '只影响退休后的劳动收入，因此会改变当前路径 80 岁总资产，不会改退休前的财富门槛。 / It only affects labor income after retirement, so it changes current-path total wealth at age 80, but not the retirement-age wealth target.'
      : '只影响退休后的劳动收入，因此会改变当前路径 80 岁总资产，不会改退休前的财富门槛。');
  const homePurchaseAgeLabel=$('homePurchaseAgeLabel');
  if(homePurchaseAgeLabel) homePurchaseAgeLabel.textContent=S.lang==='en'?'Expected home purchase timing':'购房时点';
  const homePriceLabel=$('homePriceLabel');
  if(homePriceLabel) homePriceLabel.textContent=S.lang==='en'?'Home price':'购房价格 / Home price';
  const downPayLabel=$('downPayLabel');
  if(downPayLabel) downPayLabel.textContent=S.lang==='en'?'Down payment ratio':'首付比例';
  const mortgageRateLabel=$('mortgageRateLabel');
  if(mortgageRateLabel) mortgageRateLabel.textContent=S.lang==='en'?'Mortgage rate':'房贷利率';
  const mortgageYearsLabel=$('mortgageYearsLabel');
  if(mortgageYearsLabel) mortgageYearsLabel.textContent=S.lang==='en'?'Mortgage term':'房贷年限';
  const homeCarryLabel=$('homeCarryLabel');
  if(homeCarryLabel) homeCarryLabel.textContent=S.lang==='en'?'Property tax + insurance + maintenance':'房产税+保险+维护';
  const assetsLabel=$('assetsLabel');
  if(assetsLabel) assetsLabel.textContent=S.scope==='family'
    ? (S.lang==='en'
      ? 'Combined current investable assets'
      : (S.lang==='bilingual'
        ? '你们当前可投资资产 / Combined current investable assets'
        : '你们当前可投资资产'))
    : L('assets');
  const incomeLabel=$('incomeLabel');
  if(incomeLabel) incomeLabel.textContent=S.lang==='en'
    ? (S.scope==='family' ? 'Current gross income (you and your partner)' : 'Current gross income')
    : L('income');
  const partnerIncomeLabel=$('partnerIncomeLabel');
  if(partnerIncomeLabel) partnerIncomeLabel.textContent=L('partnerIncome');
  const incomeGrowthLabel=$('incomeGrowthLabel');
  if(incomeGrowthLabel) incomeGrowthLabel.textContent=S.lang==='en'
    ? 'Income growth rate'
    : (S.lang==='bilingual' ? '年收入增长率 / Income growth rate' : '年收入增长率');
  const incomeGrowthDesc=$('incomeGrowthDesc');
  if(incomeGrowthDesc) incomeGrowthDesc.textContent=S.lang==='en'
    ? 'Default is 5% yearly income growth. This affects future gross income in both the current path and the target path.'
    : (S.lang==='bilingual'
      ? '默认按每年 5% 的收入增长来推演；这里会影响当前路径和达标路径里未来每年的税前年收入。 / Default is 5% yearly income growth. This affects future gross income in both the current path and the target path.'
      : '默认按每年 5% 的收入增长来推演；这里会影响当前路径和达标路径里未来每年的税前年收入。');
  const taxStateLabel=$('taxStateLabel');
  if(taxStateLabel) taxStateLabel.textContent=L('state');
  const taxCalcLabel=$('taxCalcLabel');
  if(taxCalcLabel) taxCalcLabel.textContent=L('taxCalc');
  const manualTaxLabel=$('manualTaxLabel');
  if(manualTaxLabel) manualTaxLabel.textContent=L('manualTax');
  const taxRateLabel=$('taxRateLabel');
  if(taxRateLabel) taxRateLabel.textContent=L('taxRate');
  const retReturnLabel=$('retReturnLabel');
  if(retReturnLabel) retReturnLabel.textContent=L('retReturn');
  const incomeGrowthV=$('incomeGrowthV');
  if(incomeGrowthV) incomeGrowthV.textContent=(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')+'%';
  const bayBaseSpendLabel=$('bayBaseSpendLabel');
  if(bayBaseSpendLabel) bayBaseSpendLabel.textContent=S.lang==='en'
    ? 'Before-kids household living cost (excluding housing)'
    : (S.lang==='bilingual'
      ? '有孩子前家庭基础生活费（不含房贷） / Before-kids household living cost (excluding housing)'
      : '有孩子前家庭基础生活费（不含房贷）');
  const bayBaseSpendAfterLabel=$('bayBaseSpendAfterLabel');
  if(bayBaseSpendAfterLabel) bayBaseSpendAfterLabel.textContent=S.lang==='en'
    ? 'After-kids household living cost (excluding housing)'
    : (S.lang==='bilingual'
      ? '有孩子后家庭基础生活费（不含房贷） / After-kids household living cost (excluding housing)'
      : '有孩子后家庭基础生活费（不含房贷）');
  const bayBaseSpendDesc=$('bayBaseSpendDesc');
  if(bayBaseSpendDesc) bayBaseSpendDesc.textContent=S.lang==='en'
    ? `This is the ${livingStageLabel('pre')} stage baseline living cost before housing. You can drag the total directly, or expand the detail below to adjust food / goods / insurance / medical / misc. Food and goods scale with household size in that stage, insurance and medical primarily scale with adults, and travel remains a separate top-level spending item. Insurance here mainly means home, auto, life, and umbrella premiums.`
    : (S.lang==='bilingual'
      ? `这是 ${livingStageLabel('pre')} 阶段的房贷前家庭总生活费。你可以直接拖总额，也可以展开下面的 detail 逐项调 food / goods / insurance / medical / misc。food 和 goods 会随该阶段的家庭人数变化，insurance 和 medical 主要随成人数变化，travel 仍然单独作为顶层支出。这里的 insurance 主要指房屋、车、寿险和 umbrella 这类保费。 / This is the ${livingStageLabel('pre')} stage baseline living cost before housing. You can drag the total directly, or expand the detail below to adjust food / goods / insurance / medical / misc. Food and goods scale with household size in that stage, insurance and medical primarily scale with adults, and travel remains a separate top-level spending item. Insurance here mainly means home, auto, life, and umbrella premiums.`
      : `这是 ${livingStageLabel('pre')} 阶段的房贷前家庭总生活费。你可以直接拖总额，也可以展开下面的 detail 逐项调 food / goods / insurance / medical / misc。food 和 goods 会随该阶段的家庭人数变化，insurance 和 medical 主要随成人数变化，travel 仍然单独作为顶层支出。这里的 insurance 主要指房屋、车、寿险和 umbrella 这类保费。`);
  const bayBaseSpendAfterDesc=$('bayBaseSpendAfterDesc');
  if(bayBaseSpendAfterDesc) bayBaseSpendAfterDesc.textContent=S.lang==='en'
    ? 'This stage becomes active after the first child birth age. You can think of it as the current-city household baseline after kids arrive.'
    : (S.lang==='bilingual'
      ? '这个数会在第一个孩子出生年龄之后生效。你可以理解为“有孩子后”的当前地点家庭基础生活费。 / This stage becomes active after the first child birth age. You can think of it as the current-city household baseline after kids arrive.'
      : '这个数会在第一个孩子出生年龄之后生效。你可以理解为“有孩子后”的当前地点家庭基础生活费。');
  const livingStageHint=$('livingStageHint');
  if(livingStageHint) livingStageHint.textContent=S.lang==='en'
    ? 'The detailed editor below follows the stage that matches your current age.'
    : (S.lang==='bilingual'
      ? '下面的明细编辑器会跟随你当前年龄所在的阶段。 / The detailed editor below follows the stage that matches your current age.'
      : '下面的明细编辑器会跟随你当前年龄所在的阶段。');
  const retInfo=$('retInfo');
  if(retInfo) retInfo.innerHTML=S.lang==='en'
    ? 'This is the <b>long-term real return</b> assumption used to grow current assets and future investment gains. Default is <b>3.5%</b>, but you can drag the slider to use 3%, 4%, or any value in between.'
    : (S.lang==='bilingual'
      ? '这是用来增长当前资产和未来投资收益的 <b>长期实际回报率</b> 假设。默认是 <b>3.5%</b>，你可以直接拖滑条改成 3%、4% 或中间任意值。 / This is the <b>long-term real return</b> assumption used to grow current assets and future investment gains. Default is <b>3.5%</b>, but you can drag the slider to use 3%, 4%, or any value in between.'
      : '这是用来增长当前资产和未来投资收益的 <b>长期实际回报率</b> 假设。默认是 <b>3.5%</b>，你可以直接拖滑条改成 3%、4% 或中间任意值。');
  const cityAssumptionSummary=$('cityAssumptionSummary');
  if(cityAssumptionSummary) cityAssumptionSummary.textContent=S.lang==='en'
    ? 'ⓘ Current city assumption'
    : 'ⓘ 当前城市假设';
  const lifestyleAssumptionSummary=$('lifestyleAssumptionSummary');
  if(lifestyleAssumptionSummary) lifestyleAssumptionSummary.textContent=S.lang==='en'
    ? 'ⓘ Retirement lifestyle assumption'
    : (S.lang==='bilingual' ? 'ⓘ 退休后生活方式 Assumption / Retirement lifestyle assumption' : 'ⓘ 退休后生活方式 Assumption');
  const lifestyleSpendLabel=$('lifestyleSpendLabel');
  if(lifestyleSpendLabel) lifestyleSpendLabel.textContent=S.lang==='en'
    ? 'Retirement living spend'
    : (S.lang==='bilingual' ? '退休后生活费 / Retirement living spend' : '退休后生活费');
  const relocationAssumptionSummary=$('relocationAssumptionSummary');
  if(relocationAssumptionSummary) relocationAssumptionSummary.textContent=S.lang==='en'
    ? 'ⓘ Location assumption'
    : (S.lang==='bilingual' ? 'ⓘ 地点假设 / Location assumption' : 'ⓘ 地点假设');
  const retReturnSummary=$('retReturnSummary');
  if(retReturnSummary) retReturnSummary.textContent=S.lang==='en'
    ? 'ⓘ Long-term real return assumption'
    : (S.lang==='bilingual' ? 'ⓘ 长期实际投资回报 Assumption / Long-term real return assumption' : 'ⓘ 长期实际投资回报 Assumption');
  const mortgageAdvancedSummary=$('mortgageAdvancedSummary');
  if(mortgageAdvancedSummary) mortgageAdvancedSummary.textContent=S.lang==='en'
    ? 'ⓘ Housing assumptions'
    : (S.lang==='bilingual' ? 'ⓘ 住房假设 / Housing assumptions' : 'ⓘ 住房假设');
  const homePriceDesc=$('homePriceDesc');
  if(homePriceDesc) homePriceDesc.textContent=S.lang==='en'
    ? 'Default value comes from the location assumption housing cost for your household; drag it to your own target home price.'
    : (S.lang==='bilingual'
      ? '默认值来自 location assumption 里的住房成本假设（按你的家庭口径）；你可以拖动改成自己的买房预算。 / Default value comes from the location assumption housing cost for your household; drag it to your own target home price.'
      : '默认值来自地点假设里的住房成本假设（按你的家庭口径）；你可以拖动改成自己的买房预算。');
  const taxAssumptionSummary=$('taxAssumptionSummary');
  if(taxAssumptionSummary) taxAssumptionSummary.textContent=S.lang==='en'?'ⓘ Tax assumption':'ⓘ 税率 Assumption';
  const taxAssumptionInfo=$('taxAssumptionInfo');
  if(taxAssumptionInfo) taxAssumptionInfo.innerHTML=S.lang==='en'
    ? `Auto mode: federal and payroll taxes use the current planning brackets; California uses a bracketed estimate. Other states use a planning-level state-income-tax approximation, not a full state filing engine. If you already know your real effective tax rate, switch to “manual effective tax rate”.<br><br>
Structured reference: <a href="./assumptions/tax_assumptions.json" target="_blank" rel="noopener">tax_assumptions.json</a><br><br>
States with no personal income tax (TX / WA / FL) are treated as 0 state income tax. This does not include 401(k), HSA, itemized deductions, AMT, NIIT, capital-gains timing, RSUs, or other personalized items.`
    : `自动模式：Federal 与 payroll tax 使用现有规划税档；California 使用分档估算。其他州目前使用规划级的州所得税近似，并不是逐州报税引擎。若你知道自己的实际 effective tax rate，建议切换“手动有效税率”。<br><br>
    结构化数据：<a href="./assumptions/tax_assumptions.json" target="_blank" rel="noopener">tax_assumptions.json</a><br><br>
    无州个人所得税州（TX / WA / FL）按州所得税 0 处理。未计入 401(k)、HSA、itemized deductions、AMT、NIIT、capital gains、RSU timing 等个性化项目。`;
  const bayBaseDesc=$('bayBaseSpendDesc');
  if(bayBaseDesc) bayBaseDesc.textContent=livingBaseSpendDescText();
  const lifestyleInfo=$('lifestyleInfo');
  if(lifestyleInfo){
    const retireSpend=spend(n('fiAge'));
    const retireLiving=Math.max(0,Math.round(retireSpend.breakdown?.living||0));
    lifestyleInfo.innerHTML=`${L('lifestyleAssumption')}<div style="margin-top:8px;font-weight:700">${S.lang==='en'
      ? `Current retirement living spend under this setting: ${money(retireLiving)}/yr.`
      : `当前退休后生活费：${money(retireLiving)}/年。`
    }</div><div style="margin-top:8px">${S.lang==='en'
      ? 'This setting only applies to post-retirement living spending. Pre-retirement spending still follows the current city / current household baseline.'
      : '这个选项只会影响退休后的生活费；退休前仍按当前城市 / 当前家庭基准来算。 / This setting only applies to post-retirement living spending. Pre-retirement spending still follows the current city / current household baseline.'
    }</div>`;
  }
  const retireOnTimeTitle=$('retireOnTimeTitle');
  if(retireOnTimeTitle) retireOnTimeTitle.textContent=S.lang==='en'
      ? '5. FIRE timeline'
      : (S.lang==='bilingual'
        ? '5. 财富自由时间线 / FIRE timeline'
        : '5. 财富自由时间线');
  const retireOnTimeNote=$('retireOnTimeNote');
  if(retireOnTimeNote) retireOnTimeNote.textContent=S.lang==='en'
    ? 'If you choose buy, the top wealth target includes a housing budget; if you choose rent, housing budget is $0, but rent continues into retirement spending, which increases required investable assets.'
    : (S.lang==='bilingual'
      ? '如果选择“买房”，上面的总财富目标包含房产预算；如果选择“租房”，房产预算为 $0，但租金会持续进入退休后的年度支出，所以会提高所需可投资资产。 / If you choose buy, the top wealth target includes a housing budget; if you choose rent, housing budget is $0, but rent continues into retirement spending, which increases required investable assets.'
      : '如果选择“买房”，上面的总财富目标包含房产预算；如果选择“租房”，房产预算为 $0，但租金会持续进入退休后的年度支出，所以会提高所需可投资资产。');
  const requiredIncomeLabel=$('requiredIncomeLabel');
  if(requiredIncomeLabel) requiredIncomeLabel.textContent=S.lang==='en'
    ? 'Required gross household income'
    : (S.lang==='bilingual'
      ? '所需家庭税前年收入 / Required gross household income'
      : '所需家庭税前年收入');
  const spendCutLabel=$('spendCutLabel');
  if(spendCutLabel) spendCutLabel.textContent=S.lang==='en'
    ? 'Or spend less each year'
    : (S.lang==='bilingual'
      ? '或者每年少花 / Or spend less each year'
      : '或者每年少花');
  const spendCutDesc=$('spendCutDesc');
  if(spendCutDesc) spendCutDesc.textContent=S.lang==='en'
    ? 'If income stays unchanged, this is the average annual spending reduction needed from now until retirement.'
    : (S.lang==='bilingual'
      ? '如果收入不变，从现在到退休平均需要减少的年度支出。 / If income stays unchanged, this is the average annual spending reduction needed from now until retirement.'
      : '如果收入不变，从现在到退休平均需要减少的年度支出。');
  const consultTitle=$('consultTitle');
  if(consultTitle) consultTitle.textContent=S.lang==='en'
    ? 'Wealth management consulting'
    : (S.lang==='bilingual'
      ? '财富管理咨询 / Wealth management consulting'
      : '财富管理咨询');
  const consultHeadline=$('consultHeadline');
  if(consultHeadline) consultHeadline.textContent=S.lang==='en'
    ? 'Want a clearer, faster path to FIRE?'
    : (S.lang==='bilingual'
      ? '想更高效地走到财富自由？ / Want a clearer, faster path to FIRE?'
      : '想更高效地走到财富自由？');
  const consultDesc=$('consultDesc');
  if(consultDesc) consultDesc.textContent=S.lang==='en'
    ? 'If you want help turning income, spending, assets, and timing into a concrete plan, reach out to wealth management consulting for a cleaner roadmap.'
    : (S.lang==='bilingual'
      ? '如果你希望把收入、支出、资产和时间线梳理得更清楚，可以联系财富管理咨询，帮助你制定更高效、更明确的财富自由路径。 / If you want help turning income, spending, assets, and timing into a concrete plan, reach out to wealth management consulting for a cleaner roadmap.'
      : '如果你希望把收入、支出、资产和时间线梳理得更清楚，可以联系财富管理咨询，帮助你制定更高效、更明确的财富自由路径。');
  const consultPill=$('consultPill');
  if(consultPill) consultPill.textContent=S.lang==='en'
    ? 'Contact wealth management consulting'
    : (S.lang==='bilingual'
      ? '联系财富管理咨询 / Contact wealth management consulting'
      : '联系财富管理咨询');
  const livingEditorSummary=$('livingEditorSummary');
  if(livingEditorSummary) livingEditorSummary.textContent=S.lang==='en'
    ? 'ⓘ Adjust spending detail / Edit living breakdown'
    : (S.lang==='bilingual' ? 'ⓘ 调整支出明细 / Edit living breakdown' : 'ⓘ 调整支出明细');
  const livingEditorInfo=$('livingEditorInfo');
  if(livingEditorInfo){
    const stage=livingStageForAge(n('currentAge'));
    syncFoodIfAuto(stage);
    const p=livingParts(stage);
    const total=livingPartsTotal(stage);
    const rows=LIVING_PARTS.map(([k,label])=>`
      <div class="control">
        <div class="head"><label>${S.lang==='en'?label.en:label.zh}</label><span class="pill" data-living-pill="${k}">${money(p[k])}${S.lang==='en'?'/yr':'/年'}</span></div>
        <input data-living-key="${k}" type="range" min="0" max="${Math.max(2000,Math.ceil(Math.max(total,p[k])*1.8/500)*500)}" step="500" value="${p[k]}">
      </div>`).join('');
    livingEditorInfo.innerHTML=`
      <div class="desc" style="margin-bottom:8px">${S.lang==='en'
        ? `Drag any item below to adjust the ${livingStageLabel(stage)} Bay Area baseline living-cost mix. The total baseline updates automatically, and the city living-cost projections follow that total. This default mix is calibrated from your last-year spending snapshot.`
        : `你可以直接拖下面任意一项来调整 ${livingStageLabel(stage)} 阶段的湾区基准生活费结构。总生活费会自动更新，城市生活费也会跟着这个总额变化。这个默认结构是根据你去年的 spending snapshot 做过校准的。`
      }</div>
      <div class="desc" style="margin-bottom:10px">${foodAssumptionNote(stage)}</div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px">${rows}</div>
    <div class="desc" style="margin-top:8px">${S.lang==='en'
        ? `Current baseline total: <span id="livingBaseTotalV">${money(total)}/yr</span>`
        : `当前基准总额：<span id="livingBaseTotalV">${money(total)}/年</span>`
      }</div>`;
  }
  const spendDetailSummary=$('spendDetailSummary');
  if(spendDetailSummary) spendDetailSummary.textContent=S.lang==='en'
    ? 'ⓘ Spending detail / annual breakdown'
    : (S.lang==='bilingual' ? 'ⓘ 支出的 detail / Spending detail' : 'ⓘ 支出的 detail');
  const currentSpend=spend(n('currentAge'));
  const spendDetailInfo=$('spendDetailInfo');
  if(spendDetailInfo){
    const fiSpend=spend(n('fiAge'));
    const currentRetCity=retirementLocationCity(n('currentAge'));
    const fiRetCity=retirementLocationCity(n('fiAge'));
    const livingLine=ld=>S.lang==='en'
      ? `Base living mix ${money(ld.coreLiving)} · Medical ${money(ld.medical)}`
      : `基础生活 mix ${money(ld.coreLiving)} · 医疗 ${money(ld.medical)}`;
    const livingSubLine=ld=>S.lang==='en'
      ? `Food ${money(ld.food)} · Consumer goods ${money(ld.goods)} · Insurance ${money(ld.insurance)} · Misc ${money(ld.misc)}`
      : `吃饭 ${money(ld.food)} · 消费品 ${money(ld.goods)} · 保险 ${money(ld.insurance)} · 其他 ${money(ld.misc)}`;
    const box=(title,sp,age,city)=>`
      <div class="box">
        <div class="a">${title}</div>
        <div class="b">${money(sp.total)}${S.lang==='en'?'/yr':'/年'}</div>
        <div class="a" style="margin-top:4px">${S.lang==='en'
          ? `Age ${age} · ${city.nameEn}`
          : `${age}岁 · ${city.nameZh}`
        }</div>
        <div class="a" style="margin-top:6px">${S.lang==='en'
          ? `Housing ${money(sp.breakdown.housing)} · Living ${money(sp.breakdown.living)} · Travel ${money(sp.breakdown.travel)} · Parents ${money(sp.breakdown.parents)} · Kids ${money(sp.breakdown.kids)}`
          : `住房 ${money(sp.breakdown.housing)} · 生活 ${money(sp.breakdown.living)} · 旅行 ${money(sp.breakdown.travel)} · 父母/家人支持 ${money(sp.breakdown.parents)} · 孩子 ${money(sp.breakdown.kids)}`
        }</div>
        <div class="a" style="margin-top:6px">${livingLine(sp.livingDetail)}</div>
        <div class="a" style="margin-top:4px">${livingSubLine(sp.livingDetail)}</div>
      </div>`;
    spendDetailInfo.innerHTML=`<div class="breakdown">
      ${box(S.lang==='en'?'Current age spending':'当前年龄支出',currentSpend,n('currentAge'),currentRetCity)}
      ${box(S.lang==='en'?'At retirement age':'退休年龄支出',fiSpend,n('fiAge'),fiRetCity)}
    </div>
    <div class="desc" style="margin-top:8px">${S.lang==='en'
      ? `Total annual spending is the sum of housing, living, travel, parents / family support, and kids. Medical is now embedded inside living so it is not double-counted at the top level. If you choose family mode, it uses two adults; if you choose rent, housing is rent instead of mortgage + ownership carry.`
      : `年度总支出 = 住房 + 生活 + 旅行 + 父母 / 家人支持 + 孩子。医疗现在已经并入生活费，不再在顶层重复计算。家庭模式下按 2 个成人计算；选择租房时，住房用租金，不用房贷 + 持有成本。`
    }</div>`;
  }
  const projectionSectionTitle=$('projectionSectionTitle');
  if(projectionSectionTitle) projectionSectionTitle.textContent=S.lang==='en'
    ? '6. Annual income, spending, and total assets (to age 80)'
    : (S.lang==='bilingual'
      ? '6. 年度收入、支出、总资产（至80岁） / Annual income, spending, and total assets (to age 80)'
      : '6. 年度收入、支出、总资产（至80岁）');
  updateLivingTotalsView();
  refreshKidsEducationView();
  const projectionCurrentBtn=$('projectionCurrentBtn');
  const projectionTargetBtn=$('projectionTargetBtn');
  if(projectionCurrentBtn) projectionCurrentBtn.textContent=S.lang==='en'?'Current path':(S.lang==='bilingual'?'当前路径 / Current path':'当前路径');
  if(projectionTargetBtn) projectionTargetBtn.textContent=S.lang==='en'?'Target path':(S.lang==='bilingual'?'达标路径 / Target path':'达标路径');
  const projectionNote=$('projectionNote');
  if(projectionNote) projectionNote.textContent=S.lang==='en'
    ? 'Current path projects from your current income and spending; target path projects from the gross income required for FIRE.'
    : (S.lang==='bilingual'
      ? '当前路径使用你现在的收入和支出做 projection；达标路径使用财富自由所需税前年收入做 projection。 / Current path projects from your current income and spending; target path projects from the gross income required for FIRE.'
      : '当前路径使用你现在的收入和支出做 projection；达标路径使用财富自由所需税前年收入做 projection。');
   const scopeBtns=$$('#scope button');
   if(scopeBtns[0]) scopeBtns[0].textContent=S.lang==='en'?'Dual-adult family':(S.lang==='bilingual'?'双成人家庭 / Dual-adult family':'双成人家庭');
   if(scopeBtns[1]) scopeBtns[1].textContent=S.lang==='en'?'Individual':(S.lang==='bilingual'?'个人口径 / Individual':'个人口径');
   const relBtns=$$('#relocationPath button');
   if(relBtns[0]) relBtns[0].textContent=S.lang==='en'?'Return to China':'回国';
   if(relBtns[1]) relBtns[1].textContent=S.lang==='en'?'Stay in the US':'留在美国';
   const childcareBtns=$$('#childcare button');
   if(childcareBtns[0]) childcareBtns[0].textContent=S.lang==='en'?'Daycare':'Daycare为主';
   if(childcareBtns[1]) childcareBtns[1].textContent=S.lang==='en'?'Parent + Nanny + Daycare':'父母+Nanny+Daycare';
   if(childcareBtns[2]) childcareBtns[2].textContent=S.lang==='en'?'Nanny':'Nanny为主';
   const usSchoolBtns=$$('#usSchool button');
   if(usSchoolBtns[0]) usSchoolBtns[0].textContent=S.lang==='en'?'Public school':'优质公立';
   if(usSchoolBtns[1]) usSchoolBtns[1].textContent=S.lang==='en'?'Private school':'私立';
   const cnSchoolBtns=$$('#cnSchool button');
   if(cnSchoolBtns[0]) cnSchoolBtns[0].textContent=S.lang==='en'?'Intl / bilingual':'国际/双语';
   if(cnSchoolBtns[1]) cnSchoolBtns[1].textContent=S.lang==='en'?'China public':'中国公立';
   if(cnSchoolBtns[2]) cnSchoolBtns[2].textContent=S.lang==='en'?'Stay in US':'继续留美';
   const housingBtns=$$('#housing button');
   if(housingBtns[0]) housingBtns[0].textContent=S.lang==='en'?'Rent':'租房';
   if(housingBtns[1]) housingBtns[1].textContent=S.lang==='en'?'Buy':'买房';
   const lifestyleBtns=$$('#lifestyle button');
   if(lifestyleBtns[0]) lifestyleBtns[0].textContent=S.lang==='en'?'Lean':'节制';
   if(lifestyleBtns[1]) lifestyleBtns[1].textContent=S.lang==='en'?'Base':'舒适';
   if(lifestyleBtns[2]) lifestyleBtns[2].textContent=S.lang==='en'?'Comfort':'宽裕';
   const taxModeBtns=$$('#taxMode button');
   if(taxModeBtns[0]) taxModeBtns[0].textContent=L('taxMode');
   if(taxModeBtns[1]) taxModeBtns[1].textContent=L('manualTax');
   $('overviewLegend').innerHTML=`<span><i class="dot" style="background:#4f806b"></i>${S.lang==='en'?'Labor income':'劳动收入'}</span><span><i class="dot" style="background:#aa8344"></i>${S.lang==='en'?'Passive income':'被动收入'}</span><span><i class="dot" style="background:#b75b61"></i>${S.lang==='en'?'Annual spending':'年度支出'}</span><span><i class="dot" style="background:#58719f"></i>${S.lang==='en'?'Total wealth (right axis)':'总财富（右轴）'}</span>`;
   $('detailLegend').innerHTML=`<span>${L('detailLegend1')}</span><span>${L('detailLegend2')}</span>`;
  const currentCitySel=$('currentCity');
  if(currentCitySel){
    Array.from(currentCitySel.options).forEach(opt=>{if(CITY[opt.value]) opt.textContent=cityName(CITY[opt.value]);});
    currentCitySel.value=S.currentCity;
  }
  const retirementCitySel=$('city');
  if(retirementCitySel){
    Array.from(retirementCitySel.options).forEach(opt=>{if(CITY[opt.value]) opt.textContent=cityName(CITY[opt.value]);});
    retirementCitySel.value=S.city;
  }
  const taxStateSel=$('taxState');
  if(taxStateSel){
    const stateLabels={
      CA:{zh:'California', en:'California', bilingual:'California'},
      NY:{zh:'纽约', en:'New York', bilingual:'纽约 / New York'},
      TX:{zh:'德州', en:'Texas', bilingual:'德州 / Texas'},
      WA:{zh:'华盛顿州', en:'Washington', bilingual:'华盛顿州 / Washington'},
      FL:{zh:'佛州', en:'Florida', bilingual:'佛州 / Florida'},
      MA:{zh:'马萨诸塞州', en:'Massachusetts', bilingual:'马萨诸塞州 / Massachusetts'},
      NJ:{zh:'新泽西州', en:'New Jersey', bilingual:'新泽西州 / New Jersey'},
      IL:{zh:'伊利诺伊州', en:'Illinois', bilingual:'伊利诺伊州 / Illinois'},
      PA:{zh:'宾夕法尼亚州', en:'Pennsylvania', bilingual:'宾夕法尼亚州 / Pennsylvania'},
      VA:{zh:'弗吉尼亚州', en:'Virginia', bilingual:'弗吉尼亚州 / Virginia'},
      NC:{zh:'北卡罗来纳州', en:'North Carolina', bilingual:'北卡罗来纳州 / North Carolina'},
      OTHER:{zh:'其他州', en:'Other', bilingual:'其他州 / Other'}
    };
    Array.from(taxStateSel.options).forEach(opt=>{
      const row=stateLabels[opt.value];
      if(row) opt.textContent=row[S.lang]||row.bilingual;
    });
    taxStateSel.value=S.taxState;
  }
  const faqTitle=document.querySelector('.faq h2');
  if(faqTitle) faqTitle.textContent=L('faq');
  const faqCards=$$('.faq details');
  if(S.lang==='en' && faqCards.length>=6){
    faqCards[0].querySelector('summary').textContent='Why is dual-adult spending not 2x the individual version?';
    faqCards[0].querySelector('.answer').innerHTML='Because childcare, school, and college costs do not double just because there is one more adult. Housing is adjusted by household size using the rule “bedrooms = adults + children”; for example, 1 adult + 2 kids = 3BR and 2 adults + 2 kids = 4BR. We also only add the second adult’s marginal costs for food, clothing, transportation, and daily living, while medical is already embedded inside living costs.';
    faqCards[1].querySelector('summary').textContent='How is "projected investable assets on the current path" calculated?';
    faqCards[1].querySelector('.answer').innerHTML='Each year we estimate federal + state + payroll taxes from gross income, subtract annual household spending to get the year’s surplus, and then grow beginning-of-year investable assets by the long-term real return. End-of-year assets = beginning assets + investment return + after-tax income − spending.';
    faqCards[2].querySelector('summary').textContent='All formulas';
    faqCards[2].querySelector('.answer').innerHTML=`<b>1. After-tax income</b><br>
    After-tax income = gross income − federal income tax − state income tax − Social Security − Medicare − Additional Medicare; you can also use the manual effective tax rate directly.<br><br>
    <b>1b. Income growth path</b><br>
    Gross income grows each year by the income growth slider until retirement; after retirement, any retained labor income is based on the retirement-age gross income.<br><br>
    <b>2. Annual household spending</b><br>
    Annual spending = housing + adult living + travel + parents / family support + kids childcare / education.<br><br>
    <b>3. Annual surplus</b><br>
    Annual surplus = after-tax income − annual household spending.<br><br>
    <b>4. Annual investment return</b><br>
    Investment return = beginning-of-year investable assets × long-term real return.<br><br>
    <b>5. End-of-year investable assets</b><br>
    End-of-year investable assets = beginning assets + investment return + annual surplus.<br><br>
    <b>6. Present value of kids’ remaining future spending</b><br>
    Kids spending PV = Σ［future year t kids spending ÷ (1 + real return)^t］<br><br>
    <b>7. Long-term retirement spending</b><br>
    Long-term retirement spending = retirement-location housing (if renting) + adult living + travel + parents / family support.<br>
    If you buy, rent is no longer included in long-term retirement spending.<br><br>
    <b>8. Required investable assets at retirement</b><br>
    Required investable assets = perpetual annual spending ÷ 4% + kids remaining spending PV + remaining mortgage payment PV.<br><br>
    <b>9. Buying and mortgage</b><br>
    In buy mode, you buy immediately at the current age: down payment = home price × down payment ratio; initial mortgage = home price × (1 − down payment ratio). The down payment is deducted from current investable assets; then principal and interest are amortized each year, together with property tax, insurance, and maintenance. Home equity = home price − remaining mortgage balance.<br>
    The FIRE target does not double-count the house: perpetual spending only keeps property tax / insurance / maintenance; any remaining mortgage is counted once via the present value of future payments; and total wealth only includes the home equity already built by the retirement age.<br><br>
    <b>10. Total wealth needed at retirement</b><br>
    Total wealth needed = required investable assets + housing budget<br><br>
    <b>11. Wealth Gap</b><br>
    Gap = projected investable assets at retirement age − total wealth needed at retirement<br>
    If you buy, the housing budget is already included in total wealth, so it is also part of the Gap; Gap > 0 means you are projected to exceed the target, Gap < 0 means there is still a shortfall.<br><br>
    <b>12. Required gross income</b><br>
    The model uses binary search to back-solve the average gross income needed so projected assets at retirement age reach the target.<br><br>
    <b>13. Required income vs current income</b><br>
    Percentage Difference = (required gross income − current gross income) ÷ current gross income<br><br>
    <b>14. Required annual spending cut if income stays unchanged</b><br>
    The model uses binary search to back-solve the average annual spending reduction needed so projected assets at retirement age reach the target.<br><br>
    <b>15. Retirement withdrawals</b><br>
    Retirement withdrawals are derived automatically and are no longer manually set. The system treats “that year’s spending − passive income − any retained labor income” as the cash flow that needs to be filled from the investment account; if passive income already covers it, the withdrawal is 0. Assets still evolve as “beginning assets + investment return + after-tax labor income − spending”, so withdrawals are not double-counted.<br><br>
    <b>16. Detailed cash-flow chart</b><br>
    Above zero = self after-tax income + partner after-tax income (family mode) + investment return<br>
    Below zero = housing + base living + travel + parents / family support + childcare / education<br><br>
    <b>17. Bedroom count</b><br>
    Bedrooms = adults + children<br><br>
    <b>18. Amount units</b><br>
    The dashboard uses 2026 purchasing-power dollars, so long-term investment return is shown as real return, defaulting to 3%.<br><br>
    <b>19. Age ranges</b><br>
    Current age is 18–70; retirement / work-optional age cannot be earlier than current age. The annual simulation starts at current age and extends through at least age 80.<br><br>
    <b>20. Asset path after retirement</b><br>
    The chart starts at your selected current age and extends through at least age 80. Before retirement age it uses your current gross income assumption; starting the year after the retirement age, labor income = pre-retirement gross income × “post-retirement labor income kept”. Investment return and household spending continue year by year, so you can see whether assets keep growing, flatten, or decline.`;
    faqCards[3].querySelector('summary').textContent='How does the automatic tax estimate work?';
    faqCards[3].querySelector('.answer').innerHTML='Federal uses the current planning brackets and the standard deduction; payroll tax includes Social Security, Medicare, and Additional Medicare; California uses a bracketed estimate. Other states use a planning-level state income tax approximation, not a full state filing engine. If you already know your real effective tax rate, switch to manual effective tax rate.<br><br>States with no personal income tax (TX / WA / FL) are treated as 0 state income tax. This does not include 401(k), HSA, itemized deductions, AMT, NIIT, capital-gains timing, RSUs, or other personalized items.';
    faqCards[4].querySelector('summary').textContent='Where does the medical assumption come from?';
    faqCards[4].querySelector('.answer').innerHTML='For adults who are working and covered by employer insurance, we now use a more realistic cash-spending estimate: <a href="https://www.kff.org/health-costs/health-policy-101-employer-sponsored-health-insurance/" target="_blank" rel="noopener">KFF 2025 employer-sponsored insurance benchmark</a> shows average employee premium contributions of about $1,440/year; <a href="https://www.kff.org/health-costs/how-much-do-people-with-employer-plans-spend-out-of-pocket-on-cost-sharing/" target="_blank" rel="noopener">KFF 2025 cost-sharing analysis</a> shows average out-of-pocket cost sharing of about $869/year. Together, a working-age adult with normal employer insurance can be planned at roughly <b>$2.3k/year</b>.<br><br>So we now model U.S. working-age medical spending more conservatively but not wildly high: about $2.3k/year for one adult and $4.6k/year for two adults. If there is no employer coverage and you switch to ACA / self-pay, the number can be much higher.';
    faqCards[5].querySelector('summary').textContent='Where are the project files and assumptions?';
    faqCards[5].querySelector('.answer').innerHTML='The GitHub repo is here: <a href="https://github.com/evasun777/fire-planner/tree/main" target="_blank" rel="noopener">github.com/evasun777/fire-planner</a><br><br>Key files in the repo:<br><b>assumptions/ASSUMPTIONS.md</b> - main assumptions and model notes<br><b>assumptions/tax_assumptions.json</b> - structured tax estimate reference data<br><b>assumptions/city_food_spend_model.csv</b> - city food-cost samples<br><b>assumptions/city_housing_model.csv</b> - city housing-cost assumptions<br><b>assumptions/kids_education_model.csv</b> - kids and education assumptions';
  }
  const pathAssumptionSummary=$('pathAssumptionSummary');
  if(pathAssumptionSummary) pathAssumptionSummary.textContent=S.lang==='en'
    ? 'ⓘ How is "projected assets on current path" calculated?'
    : 'ⓘ “当前路径预计资产”怎么算？';
  const pathAssumptionInfo=$('pathAssumptionInfo');
  if(pathAssumptionInfo) pathAssumptionInfo.innerHTML=S.lang==='en'
    ? `<b>Each year:</b><br>
      1) After-tax income = gross income × (1 − effective tax rate)<br>
      2) Annual surplus = after-tax income − that year’s household spending<br>
      3) Investment return = beginning-of-year investable assets × real return<br>
      4) End-of-year investable assets = beginning assets + investment return + annual surplus<br><br>
      If you choose “return to China”, spending before the return age uses Bay Area costs and spending after the return age uses the target city’s costs.<br><br>
      Effective tax rate changes automatically with current gross income and household / individual mode; the real return defaults to <b>3.5%</b>. This is a deterministic planning baseline, not a promise that markets will actually return 3.5% every year.`
    : `<b>每一年：</b><br>
    1) 税后收入 = 税前年收入 × (1 − 有效税率)<br>
    2) 年度结余 = 税后收入 − 当年家庭支出<br>
    3) 投资收益 = 年初可投资资产 × 实际投资回报率<br>
    4) 年末可投资资产 = 年初资产 + 投资收益 + 年度结余<br><br>
    如果你选择“回国”，回国年龄之前按湾区生活费算，回国年龄之后按目标城市生活费算。<br><br>
    有效税率会根据当前税前年收入和个人/家庭口径自动变化；实际投资回报率默认 <b>3.5%</b>（真实购买力口径），你也可以直接拖动上面的滑条改成 3% 或其他数值。这是确定性 baseline，不代表每年市场真的会稳定涨 3.5%。`;
  const wealthTitle=$('wealthSectionTitle');
  if(wealthTitle) wealthTitle.textContent=S.lang==='en'
    ? '7. Current path: annual income, spending, and total assets (to age 80)'
    : (S.lang==='bilingual'
      ? '7. 当前路径：年度收入、支出、总资产（至80岁） / Current path: annual income, spending, and total assets (to age 80)'
      : '7. 当前路径：年度收入、支出、总资产（至80岁）');
  const targetPathTitle=$('targetPathTitle');
  if(targetPathTitle) targetPathTitle.textContent=S.lang==='en'
    ? '8. Target path: required gross income for FIRE'
    : (S.lang==='bilingual'
      ? '8. 达标路径：按财富自由所需税前年收入 / Target path: required gross income for FIRE'
      : '8. 达标路径：按财富自由所需税前年收入');
  const targetPathNote=$('targetPathNote');
  if(targetPathNote) targetPathNote.textContent=S.lang==='en'
    ? 'This table is back-solved from the required gross income so you can compare what the year-by-year cash flow and asset build-up look like once you reach the FIRE threshold.'
    : '这张表是用“所需税前年收入”反推出来的，方便你对比：如果收入达到财富自由门槛，年度现金流和资产积累会长什么样。';
  const annualDetailSummary=$('annualSummary');
  if(annualDetailSummary) annualDetailSummary.textContent=S.lang==='en'
    ? '7. Annual detail (to age 80)'
    : (S.lang==='bilingual' ? '7. 年度明细（至80岁） / Annual detail (to age 80)' : '7. 年度明细（至80岁）');
  const wealthLegend=$('wealthLegend');
  if(wealthLegend) wealthLegend.innerHTML=S.lang==='en'
    ? `<span><i class="dot" style="background:#58719f"></i>Investable assets</span><span><i class="dot" style="background:#4f806b"></i>Home equity</span><span><i class="dot" style="background:#b75b61"></i>Mortgage balance (debt)</span><span><i class="dot" style="background:#aa8344"></i>Total wealth</span>`
    : `<span><i class="dot" style="background:#58719f"></i>可投资资产</span><span><i class="dot" style="background:#4f806b"></i>房屋净值</span><span><i class="dot" style="background:#b75b61"></i>房贷余额（负债）</span><span><i class="dot" style="background:#aa8344"></i>总财富</span>`;
  const wealthSectionTitleEl=$('wealthSectionTitle');
  if(wealthSectionTitleEl) wealthSectionTitleEl.textContent=L('wealthSectionTitle');
  const wealthNote=$('wealthNote');
  if(wealthNote) wealthNote.textContent=L('wealthNote');
  const annualTable=document.getElementById('rows')?.closest('table');
  if(annualTable){
    const annualHeaders=annualTable.querySelectorAll('thead th');
    if(annualHeaders.length>=9){
      const ths=S.lang==='en'
        ? ['Age','Labor income','Passive income','Spending','Net cash flow','Investment return','Investable assets','Home equity','Total wealth']
        : ['年龄','劳动收入','被动收入','支出','年度净现金流','投资收益','可投资资产','房屋净值','总财富'];
      annualHeaders.forEach((th,i)=>{if(ths[i]) th.textContent=ths[i];});
    }
  }
  const targetTable=document.getElementById('targetRows')?.closest('table');
  if(targetTable){
    const targetHeaders=targetTable.querySelectorAll('thead th');
    if(targetHeaders.length>=9){
      const ths=S.lang==='en'
        ? ['Age','Labor income','Passive income','Spending','Net cash flow','Investment return','Investable assets','Home equity','Total wealth']
        : ['年龄','劳动收入','被动收入','支出','年度净现金流','投资收益','可投资资产','房屋净值','总财富'];
      targetHeaders.forEach((th,i)=>{if(ths[i]) th.textContent=ths[i];});
    }
  }
  const faqSummary=document.querySelector('.card.faq details summary');
  if(faqSummary) faqSummary.textContent=S.lang==='en'?'Why isn\'t dual-adult spending 2x the individual case?':'为什么双成人家庭的支出不是个人口径的两倍？';
  const faqDetails=document.querySelectorAll('.faq details');
  if(faqDetails[0]){
    faqDetails[0].querySelector('summary').textContent=S.lang==='en'
      ? 'Why isn’t dual-adult spending 2x the individual case?'
      : '为什么双成人家庭的支出不是个人口径的两倍？';
    faqDetails[0].querySelector('.answer').innerHTML=S.lang==='en'
      ? 'Because childcare, tuition, and college support do not double when you add one adult. Housing is adjusted by bedroom count using <b>bedrooms = adults + children</b>; adding a second adult mainly increases food, clothing, transportation, and medical costs.'
      : '因为孩子的托育、学费和大学支持不会因为多一个成人而翻倍。住房按“卧室数 = 成人数 + 孩子数”自动调整，例如1成人+2孩子=3居、2成人+2孩子=4居；此外只增加第二个成人的餐饮、衣物、交通和医疗等边际成本。';
  }
  if(faqDetails[1]){
    faqDetails[1].querySelector('summary').textContent=S.lang==='en'
      ? '"Projected investable assets on current path" - how is it calculated?'
      : '“当前路径预计可投资资产”是怎么算的？';
    faqDetails[1].querySelector('.answer').innerHTML=S.lang==='en'
      ? 'Each year, we estimate federal, state, and payroll taxes from gross income to get after-tax income, then subtract that year’s household spending. The portfolio grows by long-term real return on beginning-of-year investable assets. End-of-year assets = beginning assets + investment return + after-tax income − annual spending.'
      : '每一年先根据税前年收入自动估算 Federal + California + payroll taxes，得到税后收入，再减去当年的家庭支出；年初可投资资产按长期实际回报率产生投资收益。年末资产 = 年初资产 + 投资收益 + 税后收入 − 年度支出。';
  }
  if(faqDetails[2]){
    faqDetails[2].querySelector('summary').textContent=S.lang==='en'
      ? 'All formulas'
      : '所有计算公式';
    faqDetails[2].querySelector('.answer').innerHTML=S.lang==='en'
      ? `<b>1. After-tax income</b><br>After-tax income = gross income − federal income tax − state tax − Social Security − Medicare − Additional Medicare; you can also override with a manual effective tax rate.<br><br>
<b>2. Annual household spending</b><br>Annual spending = housing + base living + travel + parents / family support + childcare / education.<br><br>
<b>3. Annual surplus</b><br>Annual surplus = after-tax income − annual spending.<br><br>
<b>4. Annual investment return</b><br>Investment return = beginning-of-year investable assets × long-term real return.<br><br>
<b>5. End-of-year investable assets</b><br>End-of-year investable assets = beginning assets + investment return + annual surplus.<br><br>
<b>6. Present value of remaining child costs</b><br>Child cost PV = Σ[future child cost in year t ÷ (1 + real return)^t].<br><br>
<b>7. Long-term annual retirement spending</b><br>Long-term annual spending = retirement-location housing (if renting) + adult living + travel + parents / family support. If you buy, rent is not included in long-term annual spending.<br><br>
<b>8. Required investable assets at retirement</b><br>Required investable assets = perpetual annual spending ÷ 4% + child cost PV + remaining mortgage payment PV.<br><br>
<b>9. Buy vs mortgage</b><br>Buying mode assumes you buy immediately at the current age: down payment = home price × down-payment ratio; initial mortgage = home price × (1 − down-payment ratio). The down payment comes out of current investable assets; then principal and interest are paid via an amortizing mortgage, while property tax, insurance, and maintenance are included. Home equity = home price − remaining mortgage balance. FIRE does not count the house twice: only property tax / insurance / maintenance stay in perpetual spending; remaining mortgage payments are counted once as PV; total wealth only adds home equity already built by the FI age, not the whole house price again.<br><br>
<b>10. Required total wealth at retirement</b><br>Required total wealth = required investable assets + housing budget.<br><br>
<b>11. Wealth gap</b><br>Gap = projected investable assets at retirement age − required total wealth.<br>If you buy, the housing budget is already inside required total wealth, so it also affects the gap; Gap &gt; 0 means you are above target, Gap &lt; 0 means there is still a shortfall.<br><br>
<b>12. Required gross income</b><br>The model uses binary search to back into the average gross income needed so projected investable assets at retirement age reach the target.<br><br>
<b>13. Income percentage difference</b><br>Percentage Difference = (required gross income − current gross income) ÷ current gross income.<br><br>
<b>14. If income stays fixed, how much spending must be cut</b><br>The model binary-searches the average annual spending reduction needed so projected investable assets at retirement age reach the target.<br><br>
<b>15. Retirement withdrawals</b><br>Retirement withdrawals are automatic: the model fills the gap left after passive income and any retained labor income are counted. In practice, withdrawal cash flow is roughly annual spending − passive income − retained labor income, never below 0 and never above the remaining portfolio balance. The long-term investment return assumption is still 3.5% and is applied to whatever investable assets remain. Withdrawals are cash flow taken from the portfolio, not extra investment return, so the portfolio itself still updates as beginning assets + return + after-tax labor income − spending.<br><br>
<b>16. Detail cash-flow chart</b><br>Above zero = self after-tax income + partner after-tax income (family mode) + investment return<br>
Below zero = housing + base living + travel + parents / family support + childcare / education<br><br>
<b>17. Room count</b><br>Bedrooms = adults + children.<br><br>
<b>18. Currency / real-return basis</b><br>The model uses 2026-dollar purchasing power, so long-term investment return is expressed as a real return, default 3%.<br><br>
<b>19. Age range</b><br>Current age can be 18-70; retirement / work-optional age cannot be earlier than current age. The annual simulation starts at current age and extends to at least age 80.<br><br>
<b>20. Retirement path after FI</b><br>The chart starts at your selected current age and runs to at least age 80. Before retirement age, labor income uses the current gross income assumption; starting the year after retirement age, labor income = pre-retirement gross income × post-retirement labor income kept. Investment return and household spending continue year by year so you can see whether assets grow, flatten, or decline after retirement.`
      : `<b>1. 税后收入</b><br>
税后收入 = 税前年收入 − Federal income tax − 州所得税 − Social Security − Medicare − Additional Medicare；也可以用手动有效总税率直接估算<br><br>

<b>2. 年度家庭总支出</b><br>
年度总支出 = 住房 + 成人基础生活 + 旅行 + 父母 / 家人支持 + 孩子托育/教育<br><br>

<b>3. 年度结余</b><br>
年度结余 = 税后收入 − 年度总支出<br><br>

<b>4. 当年投资收益</b><br>
投资收益 = 年初可投资资产 × 长期实际回报率<br><br>

<b>5. 年末可投资资产</b><br>
年末可投资资产 = 年初可投资资产 + 投资收益 + 年度结余<br><br>

<b>6. 孩子未来剩余支出的现值</b><br>
孩子支出 PV = Σ［未来第 t 年孩子支出 ÷ (1 + 实际回报率)^t］<br><br>

<b>7. 退休后长期年度支出</b><br>
长期年度支出 = 退休地点住房（若租房） + 成人生活 + 旅行 + 父母 / 家人支持<br>
如果选择买房，退休后不再把房租计入长期年度支出。<br><br>

<b>8. 退休时所需可投资资产</b><br>
所需可投资资产 = 永久性年度支出 ÷ 4% + 孩子剩余支出 PV + 退休后剩余房贷付款 PV<br><br>

<b>9. 买房与房贷</b><br>
    买房模式默认会根据当前地点和退休地点来决定购买时点：如果两者相同，就从现在开始买；如果不同，就在搬到退休地点那一年开始买房。首付 = 房价 × 首付比例；初始房贷 = 房价 × (1 − 首付比例)。首付从当前可投资资产扣除；之后按等额本息房贷逐年计算本金与利息，同时计入房产税、保险和维护。房屋净值 = 房价 − 剩余房贷余额。<br>
FIRE 目标不会重复算房子：长期永久支出只保留房产税/保险/维护；退休后尚未还完的房贷只按剩余付款的现值计一次；总财富展示中只加入退休年龄时已经形成的房屋净值，不再把整套房价重新加一遍。<br><br>

<b>10. 退休时所需总财富</b><br>
所需总财富 = 所需可投资资产 + 房产预算<br><br>

<b>11. 财富 Gap</b><br>
Gap = 退休年龄预计可投资资产 − 退休时所需总财富<br>
如果选择买房，房产预算已经包含在“所需总财富”中，因此也会进入 Gap；Gap &gt; 0 表示预计超过总财富目标，Gap &lt; 0 表示仍有缺口。<br><br>

<b>12. 所需税前年收入</b><br>
模型用二分搜索反推平均税前年收入，使退休年龄预计可投资资产达到目标。<br><br>

<b>13. 所需收入与当前收入的百分比差异</b><br>
Percentage Difference = (所需税前年收入 − 当前税前年收入) ÷ 当前税前年收入<br><br>

<b>14. 如果收入不变，需要削减的年度支出</b><br>
模型用二分搜索反推每年平均需要减少的支出，使退休年龄预计可投资资产达到目标。<br><br>

<b>15. 退休后的资产提取</b><br>
退休后资产提取是自动计算的，不再手调。更直白地说，系统会把“当年支出 − 被动收入 − 任何保留的劳动收入”当成需要从投资账户补的那部分现金流；如果这部分已经被被动收入覆盖，那提取就是 0。长期投资回报仍按 3.5% 计算，并作用在剩余的可投资资产上；如果资产已经被花到 0，那投资收益也会变成 0。<br><br>

<b>16. 细分 Cash Flow 图</b><br>
0线上方 = 本人税后收入 + 伴侣税后收入（家庭模式） + 投资收益<br>
0线下方 = 住房 + 基础生活 + 旅行 + 父母 / 家人支持 + 托育/教育<br><br>

<b>17. 房间数</b><br>
卧室数 = 成人数 + 孩子数<br><br>

<b>18. 金额口径</b><br>
模型主要使用 2026 美元购买力口径，因此长期投资回报率采用实际回报率，默认 3%。<br><br>

<b>19. 年龄范围</b><br>
当前年龄可选 18–70 岁；退休 / 工作可选年龄不能早于当前年龄。年度模拟从当前年龄开始，并至少延伸到80岁。<br><br>

<b>20. 退休后的资产路径</b><br>
图表从你选择的“当前年龄”开始，并至少延伸到80岁。退休年龄之前使用当前税前年收入假设；从退休年龄后的下一年开始，劳动收入 = 退休前税前年收入 × “退休后劳动收入保留比例”。投资收益与家庭支出继续逐年计算，因此可以观察退休后资产是增长、趋平还是下降。`;
  }
  if(faqDetails[3]){
    faqDetails[3].querySelector('summary').textContent=S.lang==='en'
      ? 'How does the automatic tax estimate work?'
      : '税率自动估算使用什么数据？';
    faqDetails[3].querySelector('.answer').innerHTML=S.lang==='en'
      ? 'Federal uses the 2026 IRS tax brackets and standard deduction; payroll tax includes Social Security, Medicare, and Additional Medicare; California uses the latest published FTB schedule and standard deduction as a planning approximation. The model is for FIRE planning, not a substitute for filing taxes.'
      : 'Federal 使用 2026 IRS tax brackets 与 standard deduction；Payroll tax 包括 Social Security、Medicare 和 Additional Medicare；California 当前使用 FTB 最新公布的税档与 standard deduction 作为规划近似。模型用于 FIRE 规划，不等同于正式报税结果。';
  }
  if(faqDetails[4]){
    faqDetails[4].querySelector('summary').textContent=S.lang==='en'
      ? 'Where does the medical assumption come from?'
      : '医疗假设是怎么来的？';
    faqDetails[4].querySelector('.answer').innerHTML=S.lang==='en'
      ? `For a working-age adult with employer-sponsored coverage, we now use a cash-spending estimate that is closer to reality. The <a href="https://www.kff.org/health-costs/health-policy-101-employer-sponsored-health-insurance/" target="_blank" rel="noopener">KFF 2025 employer-sponsored insurance benchmark</a> shows an average employee premium contribution of about $1,440 per year for single coverage, and the <a href="https://www.kff.org/health-costs/how-much-do-people-with-employer-plans-spend-out-of-pocket-on-cost-sharing/" target="_blank" rel="noopener">KFF 2025 cost-sharing analysis</a> shows average out-of-pocket cost-sharing of about $869 per person. Together, that puts a typical insured working-age adult around <b>$2.3k/year</b> in planning terms.<br><br>
      We now model US working-age medical spending at roughly $2.3k/year for one adult and $4.6k/year for two adults. If you do not have employer coverage and instead buy ACA coverage or pay fully out of pocket, the number will be materially higher.`
      : `对于“工作中、公司有保险”的成年人，我们现在用更接近现实的现金支出做规划：<a href="https://www.kff.org/health-costs/health-policy-101-employer-sponsored-health-insurance/" target="_blank" rel="noopener">KFF 2025 employer-sponsored insurance benchmark</a> 显示，单人平均雇员保费自付约 $1,440/年；<a href="https://www.kff.org/health-costs/how-much-do-people-with-employer-plans-spend-out-of-pocket-on-cost-sharing/" target="_blank" rel="noopener">KFF 2025 cost-sharing analysis</a> 显示，雇主保险人群平均 out-of-pocket cost-sharing 约 $869/年。两者合起来，工作年龄、正常有雇主保险的单个成年人，大致可以按 <b>$2.3k/年</b> 规划。<br><br>
      所以这里我们把美国工作年龄的医疗支出改成了更保守但不夸张的数：单人约 $2.3k/年，双成人约 $4.6k/年。退休前如果没有公司保险、改成 ACA / 自费，这个数字会明显更高。`;
  }
  if(faqDetails[5]){
    faqDetails[5].querySelector('summary').textContent=S.lang==='en'
      ? 'Where are the project files and assumptions?'
      : '项目资源和假设文件在哪？';
    faqDetails[5].querySelector('.answer').innerHTML=S.lang==='en'
      ? 'The GitHub repo is here: <a href="https://github.com/evasun777/fire-planner/tree/main" target="_blank" rel="noopener">github.com/evasun777/fire-planner</a><br><br>Key files in the repo:<br><b>assumptions/ASSUMPTIONS.md</b> - main assumptions and model notes<br><b>assumptions/tax_assumptions.json</b> - structured tax estimate reference data<br><b>assumptions/city_food_spend_model.csv</b> - city food-cost samples<br><b>assumptions/city_housing_model.csv</b> - city housing-cost assumptions<br><b>assumptions/kids_education_model.csv</b> - kids and education assumptions'
      : 'GitHub 仓库在这里：<a href="https://github.com/evasun777/fire-planner/tree/main" target="_blank" rel="noopener">github.com/evasun777/fire-planner</a><br><br>仓库里主要的假设文件都放在 assumptions/ 文件夹：<br><b>assumptions/ASSUMPTIONS.md</b> - 主假设说明和模型备注<br><b>assumptions/tax_assumptions.json</b> - 税率估算的结构化参考数据<br><b>assumptions/city_food_spend_model.csv</b> - 城市吃饭成本样本<br><b>assumptions/city_housing_model.csv</b> - 城市住房成本假设<br><b>assumptions/kids_education_model.csv</b> - 孩子与教育假设';
  }
 }
function bind(id,key,cast){document.querySelectorAll('#'+id+' button').forEach(b=>b.onclick=()=>{
  S[key]=cast?cast(b.dataset.v):b.dataset.v;
  document.querySelectorAll('#'+id+' button').forEach(x=>x.classList.toggle('active',x===b));
  if(id==='usSchool' || id==='cnSchool') refreshKidsEducationView();
  scheduleUpdate();
  if(id==='usSchool' || id==='cnSchool') update();
  if(id==='mainTabs'){
    setTimeout(()=>{
      requestAnimationFrame(()=>{
        const panel=document.querySelector(`.tab-panel[data-tab="${S.tab}"]`);
        if(!panel) return;
        const top=Math.max(0,panel.getBoundingClientRect().top+window.scrollY-16);
        window.scrollTo({top,behavior:'smooth'});
        panel.scrollIntoView({behavior:'smooth',block:'start'});
      });
    },40);
  }
})}
function syncRelocationPathFromCity(){S.relocationPath=(selectedHomeCity().country==='CN'?'returnChina':'stayUS')}
function bindSelect(id,key,cast){const el=$(id);if(!el) return;el.addEventListener('change',()=>{S[key]=cast?cast(el.value):el.value;if(key==='city') syncRelocationPathFromCity();scheduleUpdate()})}
function bindRange(id,key,cast){const el=$(id);if(!el) return;el.addEventListener('input',()=>{S[key]=cast?cast(el.value):el.value;if(key==='kids'){S.livingPartsAuto.pre=true;S.livingPartsAuto.post=true;S.autoFood.pre=true;S.autoFood.post=true;updateLivingTotalsView();}scheduleUpdate()})}
 function adults(){return S.scope==='family'?2:1}
 function bedrooms(){return Math.max(1,adults()+S.kids)}
 function housingByBedrooms(c,mode){
   const br=bedrooms();
   if(mode==='rent'){
     if(br<=1)return c.rent3*0.55;
     if(br===2)return c.rent3*0.75;
     if(br===3)return c.rent3;
     return c.rent4;
   }else{
     if(br<=1)return c.buy3*0.60;
     if(br===2)return c.buy3*0.78;
     if(br===3)return c.buy3;
     return c.buy4;
   }
 }
function currentHomeCity(){return CITY[S.currentCity]||CITY.bay}
function selectedHomeCity(){return CITY[S.city]}
function purchaseCity(){return residenceCity(homePurchaseAge())}
function suggestedHomePurchaseAge(){
  if(S.relocationPath==='returnChina' && S.currentCity!==S.city) return n('fiAge');
  return n('currentAge');
}
function defaultHomePriceForCity(c){return housingByBedrooms(c,'buy')}
function homePurchaseAge(){return Math.max(n('currentAge'),Math.min(n('homePurchaseAge'),n('fiAge')))}
 function residenceCity(age){
   return age<n('fiAge')?currentHomeCity():retirementLocationCity(age);
 }
 function homePriceForCity(c){return S.housing==='buy'?(S.homePriceManual?n('homePrice'):defaultHomePriceForCity(c)):0}
 function homePrice(){return S.housing==='buy'?homePriceForCity(purchaseCity()):0}
 function mortgageInitialPrincipalForCity(c){return homePriceForCity(c)*(1-n('downPay'))}
 function monthlyMortgagePaymentForCity(c){
   const P=mortgageInitialPrincipalForCity(c), yrs=n('mortgageYears'), mr=n('mortgageRate')/12, N=yrs*12;
   if(P<=0||N<=0)return 0;
   if(mr===0)return P/N;
   return P*mr*Math.pow(1+mr,N)/(Math.pow(1+mr,N)-1);
 }
 function mortgageSnapshotForCity(c,age,startAge=homePurchaseAge()){
   if(S.housing!=='buy')return {balance:0,principalPaid:0,interestPaid:0,annualPayment:0};
   const start=startAge;
   const monthsElapsed=Math.max(0,Math.min((age-start)*12,n('mortgageYears')*12));
   let bal=mortgageInitialPrincipalForCity(c), pmt=monthlyMortgagePaymentForCity(c), prin=0, interest=0;
   const mr=n('mortgageRate')/12;
   for(let i=0;i<monthsElapsed;i++){
     if(bal<=0)break;
     const it=bal*mr, pr=Math.min(bal,Math.max(0,pmt-it));
     bal-=pr;
   }
   // payments during this age year
   let temp=bal;
   for(let i=0;i<12;i++){
     if(temp<=0)break;
     const it=temp*mr, pr=Math.min(temp,Math.max(0,pmt-it));
     temp-=pr; prin+=pr; interest+=it;
   }
   return {balance:Math.max(0,bal),principalPaid:prin,interestPaid:interest,annualPayment:prin+interest};
 }
 function mortgageSnapshot(age){
   return mortgageSnapshotForCity(residenceCity(age),age,homePurchaseAge());
 }
 function homeEquityAt(age){
   if(S.housing!=='buy')return 0;
   const c=residenceCity(age);
   if(age<homePurchaseAge()) return 0;
   return Math.max(0,homePriceForCity(c)-mortgageSnapshotForCity(c,age+1).balance);
 }
 function ownershipCarry(c=residenceCity(_spendAge||n('currentAge'))){return S.housing==='buy'?homePriceForCity(c)*n('homeCarry'):0}

function births(){if(S.kids===0)return[];const first=n('childBirthAge');return Array.from({length:S.kids},(_,i)=>first+i*2)}
 function kidCostForSchool(cage,age,usSchool=S.usSchool,cnSchool=S.cnSchool){
  if(cage<0)return 0;let cc=CC[S.childcare];
  if(cage===0)return cc.y0;if(cage<=5)return cc.y15;
  if(cage<=17){
   const c=selectedHomeCity();
   const useChinaSchool=c.country==='CN'&&S.relocationPath==='returnChina'&&age>=n('fiAge')&&cnSchool!=='stayUS';
   if(!useChinaSchool) return usSchool==='public'?SCHOOL.usPublic:SCHOOL.usPrivate;
   return cnSchool==='intl'?SCHOOL.cnIntl:SCHOOL.cnPublic;
  }
  if(cage<=21)return SCHOOL.college;return 0
 }
 function kidCost(cage,age){
  return kidCostForSchool(cage,age);
 }
function parentSupport(age,m){return age<=70?15000*m:0;}
function lifestyleMultiplierAtAge(age=_spendAge||n('currentAge')){
  return age>=n('fiAge') ? (LIFE[S.lifestyle] ?? 1) : 1;
}
function medicalSpend(c=selectedHomeCity(),age=_spendAge||n('currentAge')){
  const a=adults();
  const m=lifestyleMultiplierAtAge(age);
  if(c.country==='US'){
   const employerCoveredHealth=a===1?2300:4600;
   return (age<n('fiAge')?employerCoveredHealth:(a===1?12000:20500))*m;
  }
  return ((c.health1||0)+(a===2?(c.health2||0):0))*m;
 }
 function livingBreakdown(coreLiving,medical,secondAdult=0,age=_spendAge||n('currentAge')){
  const stage=livingStageForAge(age);
  const totalBase=Math.max(0,coreLiving+secondAdult);
  const p=livingParts(stage);
  const baseTotal=Math.max(1,livingPartsTotal(stage));
  const scale=totalBase/baseTotal;
  const parts={
   coreLiving:totalBase,
   food:p.food*scale,
   goods:p.goods*scale,
   insurance:p.insurance*scale,
   medical:medical,
   misc:p.misc*scale,
   secondAdult
  };
  parts.total=totalBase+medical;
  return parts;
 }
 function livingEditorHTML(){
  const p=livingParts();
  const total=livingPartsTotal();
  return LIVING_PARTS.map(([k,label])=>{
    const current=p[k]||0;
    const max=Math.max(2000,Math.ceil(Math.max(total,current)*1.8/500)*500);
    return `<div class="control">
      <div class="head"><label>${S.lang==='en'?label.en:label.zh}</label><span class="pill" data-living-pill="${k}">${money(current)}${S.lang==='en'?'/yr':'/年'}</span></div>
      <input data-living-key="${k}" type="range" min="0" max="${max}" step="500" value="${current}">
    </div>`;
  }).join('');
 }
 function cityAdultSpend(c=selectedHomeCity(),age=_spendAge||n('currentAge')){
  let m=lifestyleMultiplierAtAge(age),a=adults();
  const purchaseAge=homePurchaseAge();
  let housing;
  if(S.housing==='rent' || age<purchaseAge){
    housing=housingByBedrooms(c,'rent');
  }else{
    const downPayment=age===purchaseAge?homePriceForCity(c)*n('downPay'):0;
    housing=mortgageSnapshotForCity(c,age,purchaseAge).annualPayment+ownershipCarry(c)+downPayment;
  }
  let medical=medicalSpend(c,age);
  let coreLiving=livingSpendForCity(c,age)*m;
  let secondAdult=(a===2?c.secondAdult*m:0);
  let living=coreLiving+secondAdult+medical;
  let parents=parentSupport(age,m);
  return {housing,living,health:0,medical,livingDetail:livingBreakdown(coreLiving,medical,secondAdult,age),travel:c.travel*m,parents,total:housing+living+c.travel*m+parents};
 }
function usAdultSpend(c=CITY.bay,age=_spendAge||n('currentAge')){
  let a=adults(),m=lifestyleMultiplierAtAge(age);
  const purchaseAge=homePurchaseAge();
  let housing;
  if(S.housing==='rent' || age<purchaseAge){
    housing=housingByBedrooms(c,'rent');
  }else{
    const downPayment=age===purchaseAge?homePriceForCity(c)*n('downPay'):0;
    housing=mortgageSnapshotForCity(c,age,purchaseAge).annualPayment+ownershipCarry(c)+downPayment;
  }
  const medical=medicalSpend(c,age);
  let coreLiving=livingSpendForCity(c,age)*m;
  let secondAdult=(a===2?c.secondAdult*m:0);
  let living=coreLiving+secondAdult+medical;
  let travel=15000*m,parents=parentSupport(age,m);
  return {housing,living,health:0,medical,livingDetail:livingBreakdown(coreLiving,medical,secondAdult,age),travel,parents,total:housing+living+travel+parents};
 }
 function retirementLocationCity(age){
   if(age<n('fiAge')) return currentHomeCity();
   const c=selectedHomeCity();
   if(S.relocationPath==='returnChina'){
     return c;
   }
   return c.country==='US'?c:CITY.bay;
 }
 function retirementAdultSpend(age){
   const c=retirementLocationCity(age);
   return c.country==='US'?usAdultSpend(c):cityAdultSpend(c);
 }
 let _spendAge=null;
 function adultSpend(age){
  _spendAge=age;
   const v=retirementAdultSpend(age);
   _spendAge=null;
   return v;
 }
function spend(age){
  let ad=adultSpend(age);
  let kids=births().reduce((s,b)=>s+kidCost(age-b,age),0);
  return {
     ad,kids,total:ad.total+kids,
     breakdown:{
       housing:ad.housing,
       living:ad.living,
       travel:ad.travel,
       parents:ad.parents,
       kids:kids
     },
    livingDetail:ad.livingDetail
  };
 }
 function startAssets(){
  if(S.housing!=='buy') return Math.max(0,n('assets'));
  if(n('currentAge')<homePurchaseAge()) return Math.max(0,n('assets'));
  const c=currentHomeCity();
  return Math.max(0,n('assets')-homePriceForCity(c)*n('downPay'));
 }
 function gross(){return n('income')+(S.scope==='family'?n('partnerIncome'):0)}
 function incomeGrowthRate(){return Math.max(0,n('incomeGrowth'))}
 function incomeAtAge(age,startAge=n('currentAge'),baseGross=gross()){
  const growth=incomeGrowthRate();
  const years=Math.max(0,age-startAge);
  return baseGross*Math.pow(1+growth,years);
 }

 function progressiveTax(taxable, brackets){
   taxable=Math.max(0,taxable);
   let tax=0,prev=0;
   for(let i=0;i<brackets.length;i++){
     const [cap,rate]=brackets[i];
     const top=cap===null?taxable:Math.min(taxable,cap);
     if(top>prev) tax+=(top-prev)*rate;
     if(cap===null||taxable<=cap) break;
     prev=cap;
   }
   return tax;
 }

 function estimateTaxes(grossOverride=null){
   const joint=S.scope==='family';
   let g1, g2;
   if(grossOverride!==null){
     // When solving required household income, preserve the current household income split.
     const current1=n('income'), current2=joint?n('partnerIncome'):0, total=Math.max(1,current1+current2);
     g1=grossOverride*(current1/total);
     g2=joint?grossOverride*(current2/total):0;
   }else{
     g1=n('income'); g2=joint?n('partnerIncome'):0;
   }
   const g=g1+g2;
   if(S.taxMode==='manual'){
     const total=g*n('manualTax');
     return {gross:g,federal:0,california:0,state:0,socialSecurity:0,medicare:0,additionalMedicare:0,total,effective:g>0?total/g:0,net:g-total};
   }

   const fedSingle=[[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[640600,.35],[null,.37]];
   const fedJoint=[[24800,.10],[100800,.12],[211400,.22],[403550,.24],[512450,.32],[768700,.35],[null,.37]];
   const fedDed=joint?32200:16100;
   const fedTaxable=Math.max(0,g-fedDed);
   const federal=progressiveTax(fedTaxable,joint?fedJoint:fedSingle);

   // California latest official published schedule currently available: 2025.
   const caSingle=[[11079,.01],[26264,.02],[41452,.04],[57542,.06],[72724,.08],[371479,.093],[445771,.103],[742953,.113],[null,.123]];
   const caJoint=[[22158,.01],[52528,.02],[82904,.04],[115084,.06],[145448,.08],[742958,.093],[891542,.103],[1485906,.113],[null,.123]];
   const caDed=joint?11412:5706;
   const caTaxable=Math.max(0,g-caDed);
   let california=progressiveTax(caTaxable,joint?caJoint:caSingle);
   // California Mental Health Services Tax: +1% on taxable income above $1M.
   if(caTaxable>1000000) california+=(caTaxable-1000000)*.01;

   function ficaForWage(w){
     const ss=Math.min(w,184500)*.062;
     const medicare=w*.0145;
     return {ss,medicare};
   }
   const f1=ficaForWage(g1), f2=ficaForWage(g2);
   const socialSecurity=f1.ss+f2.ss;
   const medicare=f1.medicare+f2.medicare;
   const addMedThreshold=joint?250000:200000;
   const additionalMedicare=Math.max(0,g-addMedThreshold)*.009;

   let stateTax=california;
   if(S.taxState!=='CA'){
     const stateRate={NY:.065,TX:0,WA:0,FL:0,MA:.05,NJ:.06,IL:.045,PA:.031,VA:.05,NC:.045,OTHER:.04}[S.taxState]??.04;
     stateTax=g*stateRate;
   }
   const total=federal+stateTax+socialSecurity+medicare+additionalMedicare;
   return {gross:g,federal,california:stateTax,state:stateTax,socialSecurity,medicare,additionalMedicare,total,effective:g>0?total/g:0,net:g-total};
 }

 function net(grossOverride=null){return estimateTaxes(grossOverride).net}
 function householdNetSplit(){
   if(S.scope!=='family') return {self:estimateTaxes(n('income')).net,partner:0};
   // Approximate household after-tax income split proportional to gross wages.
   const tx=estimateTaxes(), totalGross=Math.max(1,n('income')+n('partnerIncome'));
   return {self:tx.net*n('income')/totalGross, partner:tx.net*n('partnerIncome')/totalGross};
 }
 function permanentSpend(){
   return spend(n('fiAge')).total;
 }
function kidPV(startAge=n('currentAge'), usSchool=S.usSchool, cnSchool=S.cnSchool){
  const r=n('ret');
  const begin=Math.max(0,startAge);
  let pv=0;
  for(let age=begin;age<=65;age++){
    const k=births().reduce((s,b)=>s+kidCostForSchool(age-b,age,usSchool,cnSchool),0);
    pv+=k/Math.pow(1+r,age-begin+1);
  }
  return pv;
}
 function houseReserveAtAge(age){
   // House is assumed purchased now, so retirement target should not add the full home price again.
   // For total-net-worth presentation, include only the home equity expected to exist at the age being evaluated.
   return S.housing==='buy'?homeEquityAt(age):0;
 }
 function houseReserve(){
   return houseReserveAtAge(n('fiAge'));
 }
 function mortgagePVAtFI(){
  if(S.housing!=='buy')return 0;
  const fi=n('fiAge'), r=n('ret');
  let pv=0;
  for(let age=fi;age<fi+n('mortgageYears')+1;age++){
     const pay=mortgageSnapshot(age).annualPayment;
     if(pay<=0)break;
     pv+=pay/Math.pow(1+r,age-fi+1);
  }
  return pv;
 }
function retirementSpendPV(){
  const fi=n('fiAge'), r=n('ret');
  let pv=0;
  for(let age=fi;age<=80;age++){
    pv+=spend(age).total/Math.pow(1+r,age-fi+1);
  }
  return pv;
}
function retirementSpendPVAtAge(startAge){
  const r=n('ret');
  let pv=0;
  for(let age=startAge;age<=80;age++){
    pv+=spend(age).total/Math.pow(1+r,age-startAge+1);
  }
  return pv;
}
function cumulativeSpendFromTo(startAge,endAgeExclusive){
  let total=0;
  for(let age=startAge;age<Math.min(endAgeExclusive,81);age++) total+=spend(age).total;
  return total;
}
function nextFiveYearSpend(){
  return cumulativeSpendFromTo(n('currentAge'),n('currentAge')+5);
}
function spendToFiTotal(){
  return cumulativeSpendFromTo(n('currentAge'),n('fiAge'));
}
function kidsEducationAnnualNow(){
  return spend(n('currentAge')).breakdown.kids;
}
function kidsEducationRemainingPV(usSchool=S.usSchool, cnSchool=S.cnSchool){
  return kidPV(n('currentAge'),usSchool,cnSchool);
}
function refreshKidsEducationView(){
  const kidsEduSummaryV=$('kidsEduSummaryV');
  if(kidsEduSummaryV) kidsEduSummaryV.textContent=money(kidsEducationRemainingPV())+(S.lang==='en'?'/ PV':'/现值');
  const kidsEduSummaryBar=$('kidsEduSummaryBar');
  if(kidsEduSummaryBar){
    const pv=kidsEducationRemainingPV();
    const share=Math.max(0,Math.min(100,pv/1500000*100));
    kidsEduSummaryBar.style.width=share+'%';
  }
  const kidsEduSummaryS=$('kidsEduSummaryS');
  const selectedSchoolLabel=S.usSchool==='private'
    ? (S.lang==='en'?'private school':'私立')
    : (S.lang==='en'?'public school':'优质公立');
  const selectedSchoolAnnual=money(S.usSchool==='private'?SCHOOL.usPrivate:SCHOOL.usPublic);
  const altSchoolType=S.usSchool==='private'?'public':'private';
  const altSchoolLabel=altSchoolType==='private'
    ? (S.lang==='en'?'private school':'私立')
    : (S.lang==='en'?'public school':'优质公立');
  const currentEduPV=kidsEducationRemainingPV();
  if(kidsEduSummaryS) kidsEduSummaryS.innerHTML=S.lang==='en'
    ? `Selected US school: ${selectedSchoolLabel} (${selectedSchoolAnnual}/yr). Remaining childcare + education cost from now, discounted to today: ${money(currentEduPV)}.`
    : `当前美国学校：${selectedSchoolLabel}（${selectedSchoolAnnual}/年）。从现在开始的孩子托育 + 教育剩余总成本，折现到今天：${money(currentEduPV)}。`;
}
function liquidTarget(){
  // Liquid FIRE need = discounted future spending through age 80.
  // The spending path is age-aware, so return-age changes affect the target.
  return retirementSpendPV();
}
function liquidTargetAtAge(startAge){
  return retirementSpendPVAtAge(startAge);
}
function totalTarget(){return liquidTarget()+houseReserve()}
function totalTargetAtAge(startAge){return liquidTargetAtAge(startAge)+houseReserveAtAge(startAge)}
function deterministic(grossOverride=null,cut=0,endAge=null){
  const fi=n('fiAge');
  const finalAge=endAge===null?fi:endAge;
  let a=startAssets(),r=n('ret'),out=[];
  const baseGross=grossOverride===null?gross():grossOverride;
  const startAge=n('currentAge');

  for(let age=startAge;age<=finalAge;age++){
   const grossAtAge=incomeAtAge(Math.min(age,fi),startAge,baseGross);
   const yearGross=age<=fi?grossAtAge:grossAtAge*n('postRetireIncome');
   const laborNet=estimateTaxes(yearGross).net;

   const rawSpend=spend(age);
   const sp=Math.max(0,rawSpend.total-cut);
   const inv=Math.max(0,a)*r;

   // Retirement withdrawals are computed automatically from the gap between spending
   // and what passive income plus any retained labor income already covers.
   const portfolioDraw=age>fi?Math.min(Math.max(0,a),Math.max(0,sp-inv-laborNet)):0;
   const laborIncome=laborNet;
   const passiveIncome=portfolioDraw+inv;
   const disposableIncome=laborIncome+passiveIncome;
   const cashSurplus=disposableIncome-sp;

   // Asset accounting: return + labor income - spending.
   // This is algebraically equivalent to subtracting the withdrawal then reinvesting unused cash.
   a=a+inv+laborNet-sp;

   let split={self:0,partner:0};
   if(yearGross>0){
     const currentBase=gross();
     const selfGrossBase=grossOverride===null?n('income'):baseGross*(n('income')/Math.max(1,currentBase));
     const partnerGrossBase=S.scope==='family'
       ? (grossOverride===null?n('partnerIncome'):baseGross*(n('partnerIncome')/Math.max(1,currentBase)))
       : 0;
     const totalBase=Math.max(1,selfGrossBase+partnerGrossBase);
     split={self:laborNet*selfGrossBase/totalBase,partner:laborNet*partnerGrossBase/totalBase};
   }

   const equity=homeEquityAt(age);
   const mortgageBalance=mortgageSnapshot(age+1).balance;
   out.push({
     age,net:disposableIncome,laborNet,laborIncome,passiveIncome,portfolioDraw,spend:sp,surplus:cashSurplus,inv,
     assets:a,homeEquity:equity,mortgageBalance,totalWealth:a+equity,
     incomeSelf:split.self,incomePartner:split.partner,
     spendBreakdown:rawSpend.breakdown
   });
  }
  return out;
 } function solveIncome(goal){let lo=0,hi=2500000;for(let i=0;i<55;i++){let mid=(lo+hi)/2;if(deterministic(mid).slice(-1)[0].assets>=goal)hi=mid;else lo=mid}return hi}
 function solveCut(goal){if(deterministic().slice(-1)[0].assets>=goal)return 0;let lo=0,hi=400000;for(let i=0;i<55;i++){let mid=(lo+hi)/2;if(deterministic(null,mid).slice(-1)[0].assets>=goal)hi=mid;else lo=mid}return hi}
function draw(data){
  let c=$('chart'),ctx=c.getContext('2d'),W=c.width,H=c.height,m={l:66,r:64,t:24,b:35};
  ctx.clearRect(0,0,W,H);
  const pw=W-m.l-m.r, ph=H-m.t-m.b;
  const fiAge=n('fiAge');
  function drawRetirementMarker(x){
    ctx.save();
    ctx.strokeStyle='#aa8344';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(x,m.t);ctx.lineTo(x,H-m.b);ctx.stroke();
    ctx.setLineDash([]);ctx.fillStyle='#8d6b37';ctx.font='9px sans-serif';
    ctx.fillText(S.lang==='en'?`Age ${fiAge}, when you retire`:`${fiAge}岁退休`,Math.min(x+5,W-m.r-55),m.t+12);
    ctx.restore();
  }
  function drawFiMarker(x,age){
    ctx.save();
    ctx.strokeStyle='#3f6f60';ctx.lineWidth=1.8;ctx.setLineDash([3,4]);
    ctx.beginPath();ctx.moveTo(x,m.t);ctx.lineTo(x,H-m.b);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#3f6f60';
    ctx.font='9px sans-serif';
    const label=S.lang==='en'
      ? `FIRE age ${age}: current path reaches the wealth target`
      : `财富自由年龄 ${age}岁：当前路径达到总财富门槛`;
    ctx.fillText(label,Math.min(x+5,W-m.r-150),m.t+24);
    ctx.restore();
  }

  if(S.chartMode==='overview'){
    const leftMax=Math.max(...data.flatMap(x=>[x.incomeSelf+x.incomePartner,x.portfolioDraw+x.inv,x.spend]))*1.15;
    const rightMax=Math.max(...data.map(x=>x.totalWealth))*1.10;
    const rightAxisX=W-m.r;

    ctx.font='10px sans-serif';
    ctx.strokeStyle='#ebe6df';
    ctx.fillStyle='#867f77';

    // Left axis: labor income / passive income / spending
    for(let i=0;i<=5;i++){
      const y=m.t+ph*i/5;
      const leftVal=leftMax*(1-i/5);
      ctx.beginPath();ctx.moveTo(m.l,y);ctx.lineTo(rightAxisX,y);ctx.stroke();
      ctx.textAlign='left';
      ctx.fillText('$'+(leftVal/1000).toFixed(0)+'k',5,y+3);
    }

    // Right axis: investable assets
    ctx.fillStyle='#58719f';
    for(let i=0;i<=5;i++){
      const y=m.t+ph*i/5;
      const rightVal=rightMax*(1-i/5);
      ctx.textAlign='right';
      ctx.fillText('$'+(rightVal/1e6).toFixed(1)+'M',W-3,y+3);
    }
    ctx.textAlign='left';

    const xFor=i=>m.l+pw*i/(data.length-1);
    const yLeft=v=>m.t+ph*(1-Math.max(0,v)/leftMax);
    const yRight=v=>m.t+ph*(1-Math.max(0,v)/rightMax);

    function lineAccessor(accessor,yFn,color,width=2.5){
      ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;
      data.forEach((x,i)=>{
        const xx=xFor(i),yy=yFn(accessor(x));
        i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);
      });
      ctx.stroke();
    }

    lineAccessor(x=>x.incomeSelf+x.incomePartner,yLeft,'#4f806b');
    lineAccessor(x=>x.portfolioDraw+x.inv,yLeft,'#aa8344');
    lineAccessor(x=>x.spend,yLeft,'#b75b61');
    lineAccessor(x=>x.totalWealth,yRight,'#58719f',3);

    ctx.fillStyle='#867f77';
    data.forEach((x,i)=>{if(i%2===0)ctx.fillText(S.lang==='en'?`${x.age}`:`${x.age}岁`,xFor(i)-6,H-10)});

    // Small axis labels
    ctx.font='9px sans-serif';
    ctx.fillStyle='#867f77';
    ctx.fillText(S.lang==='en'?'Left axis: labor income / passive income / spending':'左轴：劳动收入 / 被动收入 / 支出',m.l,m.t-5);
    ctx.fillStyle='#58719f';
    ctx.textAlign='right';
    ctx.fillText(S.lang==='en'?'Right axis: total wealth':'右轴：总财富',W-m.r,m.t-5);
    ctx.textAlign='left';
    const fiIdx=Math.max(0,Math.min(data.length-1,fiAge-data[0].age));
    drawRetirementMarker(xFor(fiIdx));
    if(S.projectionMode==='current' && currentPathFireAge!==null){
      drawFiMarker(xFor(currentPathFireIndex),currentPathFireAge);
    }

    c._chartMeta={data,mode:'overview',leftMax,rightMax,m,pw,ph,W,H};
    return;
  }

  // Detail mode: stacked cash-flow waterfall around zero.
  const incomeTotal=x=>x.incomeSelf+x.incomePartner+x.portfolioDraw+x.inv;
  const laborIncome=x=>x.incomeSelf+x.incomePartner;
  const passiveIncome=x=>x.portfolioDraw+x.inv;
  const expenseTotal=x=>Object.values(x.spendBreakdown).reduce((a,b)=>a+b,0);
  const maxPos=Math.max(...data.flatMap(x=>[laborIncome(x),passiveIncome(x)]),1);
  const maxNeg=Math.max(...data.map(expenseTotal),1);
  const maxAbs=Math.max(maxPos,maxNeg)*1.15;
  const zeroY=m.t+ph/2;
  const scale=(ph/2)/maxAbs;

  ctx.font='10px sans-serif';
  ctx.fillStyle='#867f77';
  ctx.strokeStyle='#ebe6df';
  for(let i=1;i<=2;i++){
    const val=maxAbs*i/2;
    const yu=zeroY-val*scale, yd=zeroY+val*scale;
    ctx.beginPath();ctx.moveTo(m.l,yu);ctx.lineTo(W-m.r,yu);ctx.stroke();
    ctx.beginPath();ctx.moveTo(m.l,yd);ctx.lineTo(W-m.r,yd);ctx.stroke();
    ctx.fillText('$'+(val/1000).toFixed(0)+'k',8,yu+3);
    ctx.fillText('−$'+(val/1000).toFixed(0)+'k',4,yd+3);
  }
  ctx.strokeStyle='#a9a19a';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(m.l,zeroY);ctx.lineTo(W-m.r,zeroY);ctx.stroke();
  ctx.fillStyle='#867f77';ctx.fillText('$0',25,zeroY+3);

  const slot=pw/data.length;
  const barW=Math.max(8,Math.min(30,slot*.62));
  const cols={
    self:'#4f806b', partner:'#7b9d8e', draw:'#6f8f7c', inv:'#aa8344',
    housing:'#b75b61', living:'#c6866d',
    travel:'#a78c6b', parents:'#8d7a6d', kids:'#805b68'
  };

  data.forEach((d,i)=>{
    const x=m.l+slot*i+slot/2-barW/2;

    let y=zeroY;
    [
      ['self',d.incomeSelf],
      ['partner',S.scope==='family'?d.incomePartner:0],
      ['draw',d.portfolioDraw],
      ['inv',d.inv]
    ].forEach(([k,v])=>{
      if(v<=0)return;
      const h=v*scale;
      y-=h;ctx.fillStyle=cols[k];ctx.fillRect(x,y,barW,h);
    });

    y=zeroY;
    [
      ['housing',d.spendBreakdown.housing],
      ['living',d.spendBreakdown.living],
      ['travel',d.spendBreakdown.travel],
      ['parents',d.spendBreakdown.parents],
      ['kids',d.spendBreakdown.kids]
    ].forEach(([k,v])=>{
      if(v<=0)return;
      const h=v*scale;
      ctx.fillStyle=cols[k];ctx.fillRect(x,y,barW,h);y+=h;
    });

    if(i%2===0){
      ctx.fillStyle='#867f77';
      ctx.fillText(S.lang==='en'?`${d.age}`:`${d.age}岁`,x+barW/2-6,H-10);
    }
  });

  const fiIdx=Math.max(0,Math.min(data.length-1,fiAge-data[0].age));
  drawRetirementMarker(m.l+slot*fiIdx+slot/2);
  if(S.projectionMode==='current' && currentPathFireAge!==null){
    drawFiMarker(m.l+slot*currentPathFireIndex+slot/2,currentPathFireAge);
  }
    c._chartMeta={data,mode:'detail',m,pw,ph,W,H,slot,barW,zeroY,scale};
  }
 function drawWealth(data){
  let c=$('wealthChart');
  if(!c) return;
  let ctx=c.getContext('2d'),W=c.width,H=c.height,m={l:66,r:64,t:24,b:35};
  if(!ctx) return;
  ctx.clearRect(0,0,W,H);
  const pw=W-m.l-m.r, ph=H-m.t-m.b;
  const maxPos=Math.max(...data.flatMap(x=>[x.assets,x.homeEquity,x.totalWealth]),1);
  const maxNeg=Math.max(...data.map(x=>x.mortgageBalance),1);
  const zeroY=m.t+ph*(maxPos/(maxPos+maxNeg));
  const topSpan=Math.max(1,zeroY-m.t);
  const bottomSpan=Math.max(1,H-m.b-zeroY);
  const xFor=i=>m.l+pw*i/(data.length-1);
  const y=v=>v>=0?zeroY-v*topSpan/maxPos:zeroY+(-v)*bottomSpan/maxNeg;

  ctx.font='10px sans-serif';
  ctx.strokeStyle='#ebe6df';
  ctx.fillStyle='#867f77';
  for(let i=0;i<=4;i++){
    const val=maxPos*(1-i/4);
    const yy=m.t+topSpan*i/4;
    ctx.beginPath();ctx.moveTo(m.l,yy);ctx.lineTo(W-m.r,yy);ctx.stroke();
    ctx.textAlign='left';
    ctx.fillText('$'+(val/1e6).toFixed(1)+'M',5,yy+3);
  }
  for(let i=1;i<=4;i++){
    const val=maxNeg*i/4;
    const yy=zeroY+bottomSpan*i/4;
    ctx.beginPath();ctx.moveTo(m.l,yy);ctx.lineTo(W-m.r,yy);ctx.stroke();
    ctx.textAlign='left';
    ctx.fillText('−$'+(val/1e6).toFixed(1)+'M',5,yy+3);
  }
  ctx.strokeStyle='#a9a19a';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(m.l,zeroY);ctx.lineTo(W-m.r,zeroY);ctx.stroke();
  ctx.fillStyle='#867f77';ctx.fillText('$0',25,zeroY+3);

  function lineAccessor(accessor,color,width=2.5,dashed=false){
    ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dashed?[6,4]:[]);
    data.forEach((x,i)=>{
      const xx=xFor(i),yy=y(accessor(x));
      i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);
    });
    ctx.stroke();ctx.setLineDash([]);
  }

  lineAccessor(x=>x.assets,'#58719f',3);
  lineAccessor(x=>x.homeEquity,'#4f806b',2.5);
  lineAccessor(x=>-x.mortgageBalance,'#b75b61',2.5,true);
  lineAccessor(x=>x.totalWealth,'#aa8344',3);

  ctx.fillStyle='#867f77';
  data.forEach((x,i)=>{if(i%2===0)ctx.fillText(S.lang==='en'?`${x.age}`:`${x.age}岁`,xFor(i)-6,H-10)});
  ctx.font='9px sans-serif';
  ctx.fillStyle='#867f77';
  ctx.fillText(S.lang==='en'?'Left axis: assets / equity / debt':'左轴：资产 / 净值 / 负债',m.l,m.t-5);
  ctx.textAlign='right';
  ctx.fillText(S.lang==='en'?'Right axis: total wealth':'右轴：总财富',W-m.r,m.t-5);
  ctx.textAlign='left';

  c._wealthMeta={data,m,pw,ph,W,H,maxPos,maxNeg,zeroY,topSpan,bottomSpan};
 }
 function showWealthTooltipFromClientX(clientX,clientY){
  const c=$('wealthChart'),meta=c._wealthMeta,tip=$('wealthTooltip');
  if(!meta) return;
  const rect=c.getBoundingClientRect();
  const xCanvas=(clientX-rect.left)*(c.width/rect.width);
  const idx=Math.max(0,Math.min(meta.data.length-1,Math.round((xCanvas-meta.m.l)/meta.pw*(meta.data.length-1))));
  const d=meta.data[idx];
  tip.innerHTML=S.lang==='en'
    ? `<b>Age ${d.age}</b><br>Investable assets: ${compact(d.assets)}<br>Home equity: ${compact(d.homeEquity)}<br>Mortgage balance: ${compact(d.mortgageBalance)}<br>Total wealth: ${compact(d.totalWealth)}`
    : `<b>${d.age}岁</b><br>可投资资产：${compact(d.assets)}<br>房屋净值：${compact(d.homeEquity)}<br>房贷余额：${compact(d.mortgageBalance)}<br>总财富：${compact(d.totalWealth)}`;
  tip.style.display='block';
  const xCss=(clientX-rect.left);
  tip.style.left=Math.min(rect.width-205,Math.max(4,xCss+8))+'px';
  tip.style.top='12px';
 }
 function showTooltipFromClientX(clientX,clientY){
  const c=$('chart'),meta=c._chartMeta,tip=$('chartTooltip');
  if(!meta)return;
   const rect=c.getBoundingClientRect();
   const xCanvas=(clientX-rect.left)*(c.width/rect.width);
   let idx;
   if(meta.mode==='detail'){
     idx=Math.max(0,Math.min(meta.data.length-1,Math.floor((xCanvas-meta.m.l)/meta.slot)));
   }else{
     idx=Math.max(0,Math.min(meta.data.length-1,Math.round((xCanvas-meta.m.l)/meta.pw*(meta.data.length-1))));
   }
   const d=meta.data[idx],b=d.spendBreakdown;
   const laborIncome=d.incomeSelf+d.incomePartner;
   const passiveIncome=d.portfolioDraw+d.inv;
   const totalIncome=laborIncome+passiveIncome;
   if(S.chartMode==='overview'){
    tip.innerHTML=S.lang==='en'
      ? `<b>Age ${d.age}</b><br>Labor income: ${money(laborIncome)}<br>Passive income: ${money(passiveIncome)}<br>Total available income: ${money(totalIncome)}<br>Annual spending: ${money(d.spend)}<br>Investable assets: ${compact(d.assets)}<br>Home equity: ${compact(d.homeEquity)}<br>Total wealth: ${compact(d.totalWealth)}`
      : `<b>${d.age}岁</b><br>劳动收入：${money(laborIncome)}<br>被动收入：${money(passiveIncome)}<br>总可用收入：${money(totalIncome)}<br>年度支出：${money(d.spend)}<br>可投资资产：${compact(d.assets)}<br>房屋净值：${compact(d.homeEquity)}<br>总财富：${compact(d.totalWealth)}`;
   }else{
     const totalIn=totalIncome;
     const totalOut=Object.values(b).reduce((a,v)=>a+v,0);
     tip.innerHTML=S.lang==='en'
      ? `<b>Age ${d.age} · Cash Flow</b><br>
      <span style="color:#bfe2d1">+ Labor income: ${money(laborIncome)}</span><br>
      <span style="color:#e3c98f">+ Passive income: ${money(passiveIncome)}</span><br>
      <b>Total inflow: ${money(totalIn)}</b><br><br>
      <span style="color:#bfe2d1">+ Self after-tax income: ${money(d.incomeSelf)}</span><br>
      ${S.scope==='family'?`<span style="color:#bfe2d1">+ Partner after-tax income: ${money(d.incomePartner)}</span><br>`:''}
      <span style="color:#bfe2d1">+ Retirement withdrawals: ${money(d.portfolioDraw)}</span><br><span style="color:#e3c98f">+ Investment return: ${money(d.inv)}</span><br>
      <span>− Housing: ${money(b.housing)}</span><br>
      <span>− Base living: ${money(b.living)}</span><br>
      <span>− Travel: ${money(b.travel)}</span><br>
      <span>− Parents / family support: ${money(b.parents)}</span><br>
      <span>− Childcare / education: ${money(b.kids)}</span><br>
      <b>Total outflow: ${money(totalOut)}</b><br><br>
      Net cash flow: <b>${money(totalIn-totalOut)}</b>`
      : `<b>${d.age}岁 · Cash Flow</b><br>
      <span style="color:#bfe2d1">+ 劳动收入：${money(laborIncome)}</span><br>
      <span style="color:#e3c98f">+ 被动收入：${money(passiveIncome)}</span><br>
      <b>总流入：${money(totalIn)}</b><br><br>
      <span style="color:#bfe2d1">+ 本人税后收入：${money(d.incomeSelf)}</span><br>
      ${S.scope==='family'?`<span style="color:#bfe2d1">+ 伴侣税后收入：${money(d.incomePartner)}</span><br>`:''}
      <span style="color:#bfe2d1">+ 退休后资产提取：${money(d.portfolioDraw)}</span><br><span style="color:#e3c98f">+ 投资收益：${money(d.inv)}</span><br>
      <span>− 住房：${money(b.housing)}</span><br>
      <span>− 基础生活：${money(b.living)}</span><br>
      <span>− 旅行：${money(b.travel)}</span><br>
      <span>− 父母 / 家人支持：${money(b.parents)}</span><br>
      <span>− 托育/教育：${money(b.kids)}</span><br>
      <b>总流出：${money(totalOut)}</b><br><br>
      净现金流：<b>${money(totalIn-totalOut)}</b>`;
   }
   tip.style.display='block';
   const xCss=(clientX-rect.left);
   tip.style.left=Math.min(rect.width-205,Math.max(4,xCss+8))+'px';
   tip.style.top='12px';
 }
function renderRows(tbodyId,data,fireAge=null){
  const tbody=$(tbodyId);
  if(!tbody) return;
 tbody.innerHTML='';
 data.forEach(x=>{
    const tr=document.createElement('tr');
    if(fireAge!==null && x.age===fireAge) tr.classList.add('fire-hit');
    const labor=x.incomeSelf+x.incomePartner;
    const passive=x.portfolioDraw+x.inv;
    tr.innerHTML=`<td>${x.age}</td><td>${money(labor)}</td><td>${money(passive)}</td><td>${money(x.spend)}</td><td class="${x.surplus>=0?'pos':'neg'}">${money(x.surplus)}</td><td>${money(x.inv)}</td><td>${compact(x.assets)}</td><td>${compact(x.homeEquity)}</td><td>${compact(x.totalWealth)}</td>`;
    tbody.appendChild(tr);
  });
 }
function csvEscape(value){
  const text=value==null ? '' : String(value);
  if(/[",\n\r]/.test(text)) return `"${text.replace(/"/g,'""')}"`;
  return text;
}
function triggerDownload(filename, content, mime='text/csv;charset=utf-8;'){
  const blob=new Blob(['\ufeff',content],{type:mime});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=filename;
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{
    URL.revokeObjectURL(url);
    a.remove();
  },0);
}
function annualCsvFilename(){
  const mode=S.projectionMode==='target'?'target-path':'current-path';
  const age=n('fiAge');
  const lang=S.lang==='en'?'en':'zh';
  return `fire-annual-detail-${mode}-to-age-${age}-${lang}.csv`;
}
function annualRowsToCsv(rows){
  const headers=[
    'Age / 年龄',
    'Self after-tax income / 本人税后收入',
    'Partner after-tax income / 伴侣税后收入',
    'Labor income / 劳动收入',
    'Passive income / 被动收入',
    'Portfolio withdrawals / 资产提取',
    'Investment return / 投资收益',
    'Annual spending / 年度支出',
    'Housing / 住房',
    'Living / 生活',
    'Travel / 旅行',
    'Parents / family support / 父母 / 家人支持',
    'Kids / 孩子',
    'Net cash flow / 年度净现金流',
    'Investable assets / 可投资资产',
    'Home equity / 房屋净值',
    'Mortgage balance / 房贷余额',
    'Total wealth / 总财富'
  ];
  const lines=[headers.map(csvEscape).join(',')];
  const round=v=>Math.round(Number(v)||0);
  rows.forEach(x=>{
    const laborIncome=round(x.incomeSelf)+round(x.incomePartner);
    const passiveIncome=round(x.portfolioDraw)+round(x.inv);
    const b=x.spendBreakdown||{};
    lines.push([
      round(x.age),
      round(x.incomeSelf),
      round(x.incomePartner),
      laborIncome,
      passiveIncome,
      round(x.portfolioDraw),
      round(x.inv),
      round(x.spend),
      round(b.housing),
      round(b.living),
      round(b.travel),
      round(b.parents),
      round(b.kids),
      round(x.surplus),
      round(x.assets),
      round(x.homeEquity),
      round(x.mortgageBalance),
      round(x.totalWealth)
    ].map(csvEscape).join(','));
  });
  return lines.join('\n');
}
function downloadAnnualCsv(){
  if(!lastAnnualRows.length) return;
  triggerDownload(annualCsvFilename(), annualRowsToCsv(lastAnnualRows));
}
function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g,ch=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[ch]));
}
function wrapLines(text, maxChars=78){
  const words=String(text||'').split(/\s+/).filter(Boolean);
  const lines=[];
  let line='';
  words.forEach(word=>{
    const next=line ? `${line} ${word}` : word;
    if(next.length>maxChars && line){
      lines.push(line);
      line=word;
    }else{
      line=next;
    }
  });
  if(line) lines.push(line);
  return lines;
}
function annualSnapshot(){
  const currentAge=n('currentAge');
  const fiAge=n('fiAge');
  const endAge=Math.max(80, fiAge);
  const currentData=deterministic(null,0,endAge);
  const currentFireIndex=currentData.findIndex(x=>x.totalWealth>=totalTargetAtAge(x.age));
  const currentFireAge=currentFireIndex>=0 ? currentData[currentFireIndex].age : null;
  const currentFiPoint=currentData.find(x=>x.age===fiAge) || currentData[currentData.length-1];
  const goal=totalTarget();
  const liquidGoal=liquidTarget();
  const propertyGoal=houseReserve();
  const req=solveIncome(goal);
  const cut=solveCut(goal);
  const projectedTotal=currentFiPoint?.totalWealth ?? 0;
  const projectedAssets=currentFiPoint?.assets ?? 0;
  const gap=projectedTotal-goal;
  const avgIncome=currentData.length
    ? currentData.reduce((sum,x)=>sum+(x.incomeSelf+x.incomePartner+x.portfolioDraw+x.inv),0)/currentData.length
    : 0;
  const avgSpend=currentData.length
    ? currentData.reduce((sum,x)=>sum+x.spend,0)/currentData.length
    : 0;
  return {
    currentAge,
    fiAge,
    endAge,
    currentData,
    currentFireAge,
    currentFiPoint,
    goal,
    liquidGoal,
    propertyGoal,
    req,
    cut,
    projectedTotal,
    projectedAssets,
    gap,
    avgIncome,
    avgSpend
  };
}
function buildShareLines(snapshot){
  const currentCityName=cityName(currentHomeCity());
  const retireCityName=cityName(selectedHomeCity());
  const scopeText=S.scope==='family'
    ? (S.lang==='en' ? 'Dual-adult household' : (S.lang==='bilingual' ? '双成人家庭 / Dual-adult household' : '双成人家庭'))
    : (S.lang==='en' ? 'Individual' : (S.lang==='bilingual' ? '个人口径 / Individual' : '个人口径'));
  const lifestyleText=S.lang==='en'
    ? (S.lifestyle==='lean'?'Lean':S.lifestyle==='comfort'?'Comfort':'Base')
    : (S.lifestyle==='lean'?'节制':S.lifestyle==='comfort'?'宽裕':'舒适');
  const kidsText=S.lang==='en'
    ? `${S.kids} kid${S.kids===1?'':'s'}`
    : `${S.kids}个孩子`;
  const growthText=(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')+'%';
  const returnText=(n('ret')*100).toFixed(1).replace(/\.0$/,'')+'%';
  const fireAgeText=snapshot.currentFireAge===null
    ? (S.lang==='en' ? 'Not reached by age 80' : '80岁前未达到')
    : (S.lang==='en' ? `${snapshot.currentFireAge} years old` : `${snapshot.currentFireAge}岁`);
  const fireDef=S.lang==='en'
    ? 'FIRE = passive income > spending'
    : '财富自由 = 被动收入大于总支出';
  return {
    headline:S.lang==='en' ? `Age ${snapshot.fiAge} retirement snapshot` : `${snapshot.fiAge}岁退休快照`,
    subline:S.lang==='en'
      ? `Current path · current age ${snapshot.currentAge} → retirement age ${snapshot.fiAge}`
      : `当前路径 · 当前年龄 ${snapshot.currentAge} → 退休年龄 ${snapshot.fiAge}`,
    bodyLines:[
      S.lang==='en'
        ? `Household: ${scopeText} · Kids: ${kidsText} · Lifestyle: ${lifestyleText}`
        : `家庭口径：${scopeText} · 孩子：${kidsText} · 生活方式：${lifestyleText}`,
      S.relocationPath==='returnChina'
        ? (S.lang==='en'
          ? `City path: ${currentCityName} before ${snapshot.fiAge}, then ${retireCityName} after ${snapshot.fiAge}`
          : `城市路径：${snapshot.fiAge} 岁前按 ${currentCityName}，之后按 ${retireCityName}`)
        : (S.lang==='en'
          ? `City path: stay in ${currentCityName} through age 80`
          : `城市路径：一直按 ${currentCityName} 计算到 80 岁`),
      S.lang==='en'
        ? `Income growth: ${growthText} · Real return: ${returnText} · Tax state: ${stateText(S.taxState)}`
        : `年收入增长：${growthText} · 实际回报：${returnText} · 报税州：${stateText(S.taxState)}`,
      S.lang==='en'
        ? `Current-path FIRE age: ${fireAgeText} · ${fireDef}`
        : `当前路径财富自由年龄：${fireAgeText} · ${fireDef}`
    ],
    footnote:S.lang==='en'
      ? `Projected current-path wealth at age ${snapshot.fiAge}: ${compact(snapshot.projectedTotal)} · Required wealth: ${compact(snapshot.goal)} · Gap: ${(snapshot.gap>=0?'+':'−')+compact(Math.abs(snapshot.gap))}`
      : `${snapshot.fiAge}岁当前路径预计总财富：${compact(snapshot.projectedTotal)} · 所需总财富：${compact(snapshot.goal)} · Gap：${(snapshot.gap>=0?'+':'−')+compact(Math.abs(snapshot.gap))}`
  };
}
function renderShareCanvas(snapshot){
  const canvas=document.createElement('canvas');
  canvas.width=1080;
  canvas.height=1440;
  const ctx=canvas.getContext('2d');
  const dpr=window.devicePixelRatio||1;
  ctx.scale(1,1);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const W=canvas.width;
  const H=canvas.height;
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#f6f2ec');
  bg.addColorStop(1,'#fbf8f4');
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,W,H);

  const shadow=(x,y,w,h,r)=>{
    ctx.save();
    ctx.shadowColor='rgba(45,38,34,.10)';
    ctx.shadowBlur=24;
    ctx.shadowOffsetY=10;
    roundRect(x,y,w,h,r);
    ctx.fill();
    ctx.restore();
  };
  const roundRect=(x,y,w,h,r)=>{
    const rr=Array.isArray(r)?r:[r,r,r,r];
    ctx.beginPath();
    ctx.moveTo(x+rr[0],y);
    ctx.lineTo(x+w-rr[1],y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+rr[1]);
    ctx.lineTo(x+w,y+h-rr[2]);
    ctx.quadraticCurveTo(x+w,y+h,x+w-rr[2],y+h);
    ctx.lineTo(x+rr[3],y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-rr[3]);
    ctx.lineTo(x,y+rr[0]);
    ctx.quadraticCurveTo(x,y,x+rr[0],y);
    ctx.closePath();
  };
  const drawCard=(x,y,w,h,fill,accent)=>{
    ctx.save();
    shadow(x,y,w,h,28);
    const grad=ctx.createLinearGradient(0,y,0,y+h);
    grad.addColorStop(0,fill[0]);
    grad.addColorStop(1,fill[1]);
    ctx.fillStyle=grad;
    roundRect(x,y,w,h,28);
    ctx.fill();
    ctx.fillStyle=accent;
    ctx.fillRect(x,y,8,h);
    ctx.restore();
  };
  const drawText=(text,x,y,opts={})=>{
    const {
      font='40px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif',
      color='#292521',
      maxWidth=960,
      lineHeight=46,
      weight='700',
      align='left'
    }=opts;
    ctx.save();
    ctx.fillStyle=color;
    ctx.font=`${weight} ${font}`;
    ctx.textAlign=align;
    const lines=String(text||'').split('\n');
    let cursorY=y;
    lines.forEach(part=>{
      const wrapped=wrapLines(part, Math.max(18, Math.floor(maxWidth/16)));
      wrapped.forEach(line=>{
        ctx.fillText(line,x,cursorY);
        cursorY+=lineHeight;
      });
    });
    ctx.restore();
    return cursorY;
  };
  const moneyText=v=>compact(v).replace('−','-');
  const pctText=v=>`${(Number(v)*100).toFixed(1).replace(/\.0$/,'')}%`;
  const share=buildShareLines(snapshot);
  ctx.fillStyle='#c56c52';
  ctx.font='800 26px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('LIFE MAP',40,54);
  ctx.fillStyle='#292521';
  ctx.font='900 64px -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  const titleLines=wrapLines(S.lang==='en'?'FIRE Financial Freedom Planner':'FIRE 财富自由规划器',18);
  let titleY=108;
  titleLines.forEach(line=>{
    ctx.fillText(line,40,titleY);
    titleY+=72;
  });
  ctx.font='700 24px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillStyle='#766f68';
  ctx.fillText(share.subline,40,titleY+10);

  const metrics=[
    {
      label:S.lang==='en'?`Total wealth needed at age ${snapshot.fiAge}`:`${snapshot.fiAge}岁需要的总财富`,
      value:compact(snapshot.goal),
      sub:S.lang==='en'
        ? `Retirement spending PV ${compact(snapshot.liquidGoal)} + home equity ${compact(snapshot.propertyGoal)}`
        : `退休期支出现值 ${compact(snapshot.liquidGoal)} + 房屋净值 ${compact(snapshot.propertyGoal)}`,
      fill:['#2f2a27','#2f2a27'],
      accent:'#c56c52',
      text:'#fff'
    },
    {
      label:S.lang==='en'?`Projected wealth at age ${snapshot.fiAge}`:`${snapshot.fiAge}岁预计总财富`,
      value:compact(snapshot.projectedTotal),
      sub:S.lang==='en'
        ? `Investable assets ${compact(snapshot.projectedAssets)} · ${snapshot.fiAge} years old`
        : `可投资资产 ${compact(snapshot.projectedAssets)} · ${snapshot.fiAge} 岁`,
      fill:['#ffffff','#f8f8f6'],
      accent:'#58719f',
      text:'#292521'
    },
    {
      label:S.lang==='en'?'Wealth gap':'财富 Gap',
      value:`${snapshot.gap>=0?'+':'-'}${compact(Math.abs(snapshot.gap))}`,
      sub:snapshot.gap>=0
        ? (S.lang==='en'?'Ahead of the target':'已超过目标')
        : (S.lang==='en'?'Still below target':'仍低于目标'),
      fill:['#ffffff','#f8f8f6'],
      accent:snapshot.gap>=0 ? '#4f806b' : '#b75b61',
      text:snapshot.gap>=0 ? '#4f806b' : '#b75b61'
    },
    {
      label:S.lang==='en'?'Required gross income':'需要的税前年收入',
      value:moneyText(snapshot.req)+(S.lang==='en'?'/yr':'/年'),
      sub:S.lang==='en'
        ? `About ${(snapshot.req-n('income'))>0?moneyText(snapshot.req-n('income'))+' above current income':'same as current income'}`
        : `比当前收入${(snapshot.req-n('income'))>0?`高 ${moneyText(snapshot.req-n('income'))}`:'基本相同'}`,
      fill:['#ffffff','#f8f8f6'],
      accent:'#aa8344',
      text:'#292521'
    }
  ];
  let x=40;
  let y=240;
  const w=490;
  const h=180;
  metrics.forEach((m,i)=>{
    const cx=i%2;
    const cy=Math.floor(i/2);
    const px=x+cx*(w+20);
    const py=y+cy*(h+18);
    drawCard(px,py,w,h,m.fill,m.accent);
    ctx.fillStyle=m.text;
    ctx.font='700 24px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(m.label,px+26,py+38);
    ctx.font='900 52px -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(m.value,px+26,py+94);
    ctx.font='700 19px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle='#7b726a';
    const subLines=wrapLines(m.sub,38);
    let subY=py+128;
    subLines.slice(0,2).forEach(line=>{
      ctx.fillText(line,px+26,subY);
      subY+=24;
    });
  });

  // summary panel
  drawCard(40,610,1000,375,['#ffffff','#f9f5f1'],'#b85e43');
  ctx.fillStyle='#292521';
  ctx.font='900 34px -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText(S.lang==='en'?'Planning snapshot':'规划快照',68,662);
  ctx.font='700 22px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillStyle='#766f68';
  ctx.fillText(share.headline,68,702);
  ctx.fillStyle='#5a534d';
  ctx.font='700 24px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  let lineY=746;
  share.bodyLines.forEach(line=>{
    ctx.fillText(line,68,lineY);
    lineY+=38;
  });
  ctx.fillStyle='#7b726a';
  ctx.font='700 20px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  const footLines=wrapLines(share.footnote,48);
  let footY=888;
  footLines.forEach(line=>{
    ctx.fillText(line,68,footY);
    footY+=28;
  });

  // bottom section
  drawCard(40,1010,1000,340,['#eef4fb','#f8fbff'],'#58719f');
  ctx.fillStyle='#445f85';
  ctx.font='900 28px -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText(S.lang==='en'?'Key assumptions':'关键假设',68,1060);
  ctx.fillStyle='#5a534d';
  ctx.font='700 22px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  const assumptionLines=[
    S.lang==='en'
      ? `Current age ${snapshot.currentAge} · retirement age ${snapshot.fiAge} · annual income growth ${pctText(n('incomeGrowth'))} · real return ${pctText(n('ret'))}`
      : `当前年龄 ${snapshot.currentAge} 岁 · 退休年龄 ${snapshot.fiAge} 岁 · 年收入增长 ${pctText(n('incomeGrowth'))} · 实际回报 ${pctText(n('ret'))}`,
    S.lang==='en'
      ? `Current city ${currentCityName} → retirement city ${retireCityName} · household mode ${scopeText} · kids ${kidsText} · lifestyle ${lifestyleText}`
      : `当前城市 ${currentCityName} → 退休城市 ${retireCityName} · 家庭口径 ${scopeText} · 孩子 ${kidsText} · 生活方式 ${lifestyleText}`,
    S.lang==='en'
      ? `Tax state ${stateText(S.taxState)} · current investable assets ${compact(n('assets'))} · current gross income ${money(n('income'))}/yr`
      : `报税州 ${stateText(S.taxState)} · 当前可投资资产 ${compact(n('assets'))} · 当前税前收入 ${money(n('income'))}/年`,
    S.lang==='en'
      ? `FIRE age ${snapshot.currentFireAge===null?'not reached by age 80':snapshot.currentFireAge} · definition: passive income > spending`
      : `财富自由年龄 ${snapshot.currentFireAge===null?'80岁前未达到':snapshot.currentFireAge+'岁'} · 定义：被动收入大于总支出`
  ];
  let aY=1102;
  assumptionLines.forEach(line=>{
    const lines=wrapLines(line,54);
    lines.forEach(l=>{
      ctx.fillText(l,68,aY);
      aY+=30;
    });
    aY+=10;
  });

  ctx.fillStyle='#968a81';
  ctx.font='700 18px -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('Generated by FIRE planner',40,1390);
  return canvas;
}
function openPrintableReport(){
  const snapshot=annualSnapshot();
  const title=S.lang==='en' ? 'FIRE Planner Report' : 'FIRE 财富自由报告';
  const summaryHtml=summaryText(snapshot.currentData,snapshot.currentFireAge,'current');
  const html=`<!doctype html>
  <html>
  <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width,initial-scale=1">
   <title>${escapeHtml(title)}</title>
   <style>
    @page{size:A4;margin:14mm}
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif;background:#f5f2ed;color:#292521}
    .page{max-width:980px;margin:0 auto;padding:0}
    .hero{padding:0 0 14px;border-bottom:1px solid #e7dfd5;margin-bottom:14px}
    .eyebrow{font-size:12px;color:#b85e43;font-weight:800;letter-spacing:.08em}
    h1{margin:6px 0 6px;font-size:32px;line-height:1.15}
    .sub{font-size:12px;color:#766f68;line-height:1.5}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .kpi{border:1px solid #e7dfd5;border-radius:14px;padding:12px 14px;background:#fff}
    .kpi.primary{background:#2d2926;color:#fff;border-color:#2d2926}
    .kpi .lab{font-size:11px;color:inherit;opacity:.72;font-weight:700}
    .kpi .num{font-size:28px;font-weight:900;margin-top:4px}
    .kpi .small{font-size:11px;line-height:1.45;color:inherit;opacity:.78;margin-top:4px}
    .card{border:1px solid #e7dfd5;border-radius:16px;background:#fff;padding:14px 16px;margin-top:12px;page-break-inside:avoid}
    .card h2{margin:0 0 8px;font-size:18px}
    .note{font-size:11px;line-height:1.6;color:#5b554f}
    .summary{font-size:12px;line-height:1.7;color:#5b554f}
    .summary b{color:#292521}
    table{width:100%;border-collapse:collapse;font-size:11px;margin-top:8px}
    th,td{border-bottom:1px solid #eee7df;padding:7px 6px;text-align:left;vertical-align:top}
    th{color:#7d756d;font-size:10px}
    .tag{display:inline-block;background:#f2eee8;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:800;color:#6b625b;margin-right:6px}
    .footer{font-size:10px;color:#8b827a;margin-top:12px}
   </style>
  </head>
  <body>
   <div class="page">
    <div class="hero">
      <div class="eyebrow">LIFE MAP</div>
      <h1>${escapeHtml(title)}</h1>
      <div class="sub">${escapeHtml(snapshot.fiAge)}岁退休快照 · ${escapeHtml(cityName(currentHomeCity()))} → ${escapeHtml(cityName(selectedHomeCity()))} · ${escapeHtml(stateText(S.taxState))}</div>
    </div>
    <div class="grid">
      <div class="kpi primary"><div class="lab">${escapeHtml(S.lang==='en'?`Total wealth needed at age ${snapshot.fiAge}`:`${snapshot.fiAge}岁需要的总财富`)}</div><div class="num">${escapeHtml(compact(snapshot.goal))}</div><div class="small">${escapeHtml(S.lang==='en'?`Retirement spending PV ${compact(snapshot.liquidGoal)} + home equity ${compact(snapshot.propertyGoal)}`:`退休期支出现值 ${compact(snapshot.liquidGoal)} + 房屋净值 ${compact(snapshot.propertyGoal)}`)}</div></div>
      <div class="kpi"><div class="lab">${escapeHtml(S.lang==='en'?`Projected wealth at age ${snapshot.fiAge}`:`${snapshot.fiAge}岁预计总财富`)}</div><div class="num">${escapeHtml(compact(snapshot.projectedTotal))}</div><div class="small">${escapeHtml(S.lang==='en'?`Projected investable assets ${compact(snapshot.projectedAssets)}`:`预计可投资资产 ${compact(snapshot.projectedAssets)}`)}</div></div>
      <div class="kpi"><div class="lab">${escapeHtml(S.lang==='en'?'Wealth gap':'财富 Gap')}</div><div class="num">${escapeHtml((snapshot.gap>=0?'+':'−')+compact(Math.abs(snapshot.gap)))}</div><div class="small">${escapeHtml(snapshot.gap>=0?(S.lang==='en'?'Ahead of the target':'已超过目标'):(S.lang==='en'?'Still below the target':'仍低于目标'))}</div></div>
      <div class="kpi"><div class="lab">${escapeHtml(S.lang==='en'?'Required gross income':'需要的税前年收入')}</div><div class="num">${escapeHtml(money(snapshot.req)+(S.lang==='en'?'/yr':'/年'))}</div><div class="small">${escapeHtml(S.lang==='en'?`Current gross income ${money(n('income'))}/yr`:`当前税前收入 ${money(n('income'))}/年`)}</div></div>
    </div>
    <div class="card">
      <h2>${escapeHtml(S.lang==='en'?'Planning summary':'规划摘要')}</h2>
      <div class="summary">${summaryHtml}</div>
    </div>
    <div class="card">
      <h2>${escapeHtml(S.lang==='en'?'Key assumptions':'关键假设')}</h2>
      <div class="note">
        <span class="tag">${escapeHtml(S.lang==='en'?'Household mode':'家庭口径')}</span>${escapeHtml(S.scope==='family'?(S.lang==='en'?'Dual-adult household':'双成人家庭'):(S.lang==='en'?'Individual':'个人口径'))}<br>
        <span class="tag">${escapeHtml(S.lang==='en'?'Kids':'孩子')}</span>${escapeHtml(S.kids + (S.lang==='en' ? (S.kids===1?' kid':' kids') : '个孩子'))}<br>
        <span class="tag">${escapeHtml(S.lang==='en'?'Lifestyle':'生活方式')}</span>${escapeHtml(S.lifestyle==='lean'?(S.lang==='en'?'Lean':'节制'):S.lifestyle==='comfort'?(S.lang==='en'?'Comfort':'宽裕'):(S.lang==='en'?'Base':'舒适'))}<br>
        <span class="tag">${escapeHtml(S.lang==='en'?'Income growth':'年收入增长')}</span>${escapeHtml((n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')+'%')}<br>
        <span class="tag">${escapeHtml(S.lang==='en'?'Real return':'实际回报')}</span>${escapeHtml((n('ret')*100).toFixed(1).replace(/\.0$/,'')+'%')}<br>
        <span class="tag">${escapeHtml(S.lang==='en'?'FIRE age':'财富自由年龄')}</span>${escapeHtml(snapshot.currentFireAge===null ? (S.lang==='en'?'Not reached by age 80':'80岁前未达到') : `${snapshot.currentFireAge}${S.lang==='en'?' years old':'岁'}`)}<br>
        <span class="tag">${escapeHtml(S.lang==='en'?'Definition':'定义')}</span>${escapeHtml(S.lang==='en'?'Passive income > total spending':'被动收入大于总支出')}
      </div>
    </div>
    <div class="card">
      <h2>${escapeHtml(S.lang==='en'?'Current path annual averages':'当前路径年均值')}</h2>
      <table>
        <thead><tr><th>Item</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>${escapeHtml(S.lang==='en'?'Average annual income':'平均年度收入')}</td><td>${escapeHtml(money(snapshot.avgIncome)+(S.lang==='en'?'/yr':'/年'))}</td></tr>
          <tr><td>${escapeHtml(S.lang==='en'?'Average annual spending':'平均年度支出')}</td><td>${escapeHtml(money(snapshot.avgSpend)+(S.lang==='en'?'/yr':'/年'))}</td></tr>
          <tr><td>${escapeHtml(S.lang==='en'?'Average annual net cash flow':'平均年度净现金流')}</td><td>${escapeHtml(money(snapshot.avgIncome-snapshot.avgSpend)+(S.lang==='en'?'/yr':'/年'))}</td></tr>
          <tr><td>${escapeHtml(S.lang==='en'?'Current age / FI age':'当前年龄 / 退休年龄')}</td><td>${escapeHtml(`${snapshot.currentAge} / ${snapshot.fiAge}${S.lang==='en'?' yrs':'岁'}`)}</td></tr>
          <tr><td>${escapeHtml(S.lang==='en'?'Current city / retirement city':'当前城市 / 退休城市')}</td><td>${escapeHtml(`${cityName(currentHomeCity())} → ${cityName(selectedHomeCity())}`)}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="footer">${escapeHtml(S.lang==='en'?'Generated by FIRE planner. Save/Print this page as PDF from your browser print dialog.':'由 FIRE planner 生成。可在浏览器打印对话框中另存为 PDF。')}</div>
   </div>
   <script>window.onload=()=>setTimeout(()=>window.print(),250);</script>
  </body>
  </html>`;
  const win=window.open('','_blank','width=1100,height=1400');
  if(!win){
    alert(S.lang==='en'?'Popup blocked. Please allow popups to export the PDF report.':'弹窗被拦截了，请允许弹窗后再导出 PDF 报告。');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
let lastRenderedLang=null;
let updateScheduled=false;
let lastAnnualRows=[];
let lastAnnualProjectionMode='current';
let lastAnnualFireAge=null;
 function scheduleUpdate(){
  if(updateScheduled) return;
  updateScheduled=true;
  requestAnimationFrame(()=>{updateScheduled=false;update()});
 }
function update(){
  syncRelocationPathFromCity();
  if(lastRenderedLang!==S.lang){
    renderLanguage();
    lastRenderedLang=S.lang;
  }
  applyMainTabs();
  const projectionCurrentBtn=$('projectionCurrentBtn');
  const projectionTargetBtn=$('projectionTargetBtn');
  const targetProjection=S.projectionMode==='target';
  if(projectionCurrentBtn) projectionCurrentBtn.classList.toggle('active',!targetProjection);
  if(projectionTargetBtn) projectionTargetBtn.classList.toggle('active',targetProjection);
  $('overviewLegend').style.display='flex';
  $('detailLegend').classList.add('show');
  $('assetsLabel').textContent=S.scope==='family'
    ? (S.lang==='en'?'Current household investable assets':'你们当前可投资总资产')
    : (S.lang==='en'?'Current investable assets':'你当前可投资资产');
  $('partnerIncomeWrap').classList.toggle('hidden',S.scope!=='family');
  $('scopeDesc').textContent=S.scope==='individual'?L('scopeIndividual'):L('scopeFamily');
  const hideKidsEducation=S.kids===0;
  $('childBirthAgeWrap')?.classList.toggle('hidden',hideKidsEducation);
  $('childcare').closest('.grid')?.classList.toggle('hidden',hideKidsEducation);
  $('kidsSchoolWrap').classList.toggle('hidden',hideKidsEducation);
  $('cnSchoolWrap').classList.toggle('hidden',S.relocationPath==='stayUS');
  $('returnAgeWrap')?.classList.add('hidden');
  $('postRetireIncomeV').textContent=Math.round(n('postRetireIncome')*100)+'%';
  $('mortgageWrap').classList.toggle('hidden',S.housing!=='buy');
  $('downPayV').textContent=Math.round(n('downPay')*100)+'%';
  $('mortgageRateV').textContent=(n('mortgageRate')*100).toFixed(2)+'%';
  $('mortgageYearsV').textContent=n('mortgageYears')+(S.lang==='en'?' yrs':'年');
  $('homeCarryV').textContent=(n('homeCarry')*100).toFixed(1)+'%';
  updateSpendingSummaryMeters();
  $('taxStateV').textContent=stateText(S.taxState);
  $('taxModeV').textContent=S.taxMode==='auto'?L('taxMode'):L('manualTax');
  $('manualTaxWrap').classList.toggle('hidden',S.taxMode!=='manual');
  $('manualTaxV').textContent=Math.round(n('manualTax')*100)+'%';
  $('currentAgeV').textContent=n('currentAge')+(S.lang==='en'?' yrs':'岁');
  $('incomeGrowthV').textContent=(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')+'%';
  const childBirthAgeEl=$('childBirthAge');
  if(childBirthAgeEl){
    childBirthAgeEl.min='18';
    childBirthAgeEl.max='55';
    childBirthAgeEl.step='1';
    const suggestedChildBirthAge=n('currentAge')+2;
    if(!S.childBirthAgeManual && Number(childBirthAgeEl.value)!==suggestedChildBirthAge) childBirthAgeEl.value=suggestedChildBirthAge;
  }
  if($('childBirthAgeV')) $('childBirthAgeV').textContent=n('childBirthAge')+(S.lang==='en'?' yrs':'岁');
  const fiEl=$('fiAge');
  fiEl.min=n('currentAge');
  if(n('fiAge')<n('currentAge')) fiEl.value=n('currentAge');
  $('fiAgeV').textContent=n('fiAge')+(S.lang==='en'?' yrs':'岁');
  const purchaseEl=$('homePurchaseAge');
  if(purchaseEl){
    purchaseEl.min=n('currentAge');
    purchaseEl.max=Math.max(n('currentAge'),n('fiAge'));
    const suggestedPurchaseAge=suggestedHomePurchaseAge();
    if(!S.homePurchaseAgeManual && Number(purchaseEl.value)!==suggestedPurchaseAge) purchaseEl.value=suggestedPurchaseAge;
    if(n('homePurchaseAge')<n('currentAge')) purchaseEl.value=n('currentAge');
    if(n('homePurchaseAge')>n('fiAge')) purchaseEl.value=n('fiAge');
  }
  if($('homePurchaseAgeV')) $('homePurchaseAgeV').textContent=n('homePurchaseAge')+(S.lang==='en'?' yrs':'岁');
  const homePriceEl=$('homePrice');
  if(homePriceEl){
    homePriceEl.min='0';
    homePriceEl.max='10000000';
    homePriceEl.step='25000';
    const suggestedHomePrice=defaultHomePriceForCity(purchaseCity());
    if(!S.homePriceManual){
      if(Number(homePriceEl.value)!==suggestedHomePrice) homePriceEl.value=suggestedHomePrice;
    }else if(Number(homePriceEl.value)!==n('homePrice')){
      homePriceEl.value=n('homePrice');
    }
  }
  if($('homePriceV')) $('homePriceV').textContent=money(n('homePrice'));
  $('relocationInfo').innerHTML=S.relocationPath==='returnChina'
    ? (S.lang==='en'
      ? `Assumption: from age ${n('currentAge')} to age ${n('fiAge')}, we use ${cityName(CITY[S.currentCity])}; from age ${n('fiAge')} to age 80, we use ${cityName(CITY[S.city])}.<br><br>This same location assumption also feeds the retirement housing defaults below, including the home price and rent assumptions.`
      : `假设：从 ${n('currentAge')} 岁到 ${n('fiAge')} 岁按 ${cityName(CITY[S.currentCity])} 计算；从 ${n('fiAge')} 岁到 80 岁按 ${cityName(CITY[S.city])} 计算。<br><br>这套 location assumption 也会影响下面的退休住房默认值，包括房价和租金假设。`)
    : (S.lang==='en'
      ? `Assumption: from age ${n('currentAge')} to age 80, we use ${cityName(CITY[S.currentCity])}; the model does not switch to a China retirement city.<br><br>This same location assumption also feeds the retirement housing defaults below, including the home price and rent assumptions.`
      : `假设：从 ${n('currentAge')} 岁到 80 岁都按 ${cityName(CITY[S.currentCity])} 计算，不切换到回国退休地点。<br><br>这套 location assumption 也会影响下面的退休住房默认值，包括房价和租金假设。`);
  $('assetsV').textContent=money(n('assets'));$('incomeV').textContent=money(n('income'))+(S.lang==='en'?'/yr':'/年');$('partnerIncomeV').textContent=money(n('partnerIncome'))+(S.lang==='en'?'/yr':'/年');$('retV').textContent=(n('ret')*100).toFixed(1)+'%';
  const tx=estimateTaxes();
  $('taxV').textContent=(tx.effective*100).toFixed(1)+'%';
  $('taxBreakdown').textContent=S.lang==='en'
    ? `Estimated after-tax income ${money(tx.net)}/yr · Federal ${money(tx.federal)} · State ${money(tx.california)} · Social Security ${money(tx.socialSecurity)} · Medicare ${money(tx.medicare+tx.additionalMedicare)}`
    : `预计税后收入 ${money(tx.net)}/年 · Federal ${money(tx.federal)} · 州税 ${money(tx.california)} · Social Security ${money(tx.socialSecurity)} · Medicare ${money(tx.medicare+tx.additionalMedicare)}`;
  const formulaSummary=$('formulaSummary');
  if(formulaSummary) formulaSummary.textContent=S.lang==='en'
    ? 'ⓘ Main formulas + current values'
    : (S.lang==='bilingual' ? 'ⓘ 主要公式 / Main formulas + 当前数值' : 'ⓘ 主要公式 + 当前数值');
  $('totalNeedLabel').textContent=S.lang==='en'
    ? `Total wealth needed at age ${n('fiAge')}`
    : `${n('fiAge')}岁需要的总财富`;
  $('projectLabel').textContent=S.lang==='en'
    ? `Projected investable assets at age ${n('fiAge')} on ${targetProjection?'target path':'current path'}`
    : (targetProjection
      ? `按达标路径 ${n('fiAge')}岁预计可投资资产`
      : `按当前路径 ${n('fiAge')}岁预计可投资资产`);
  let c=selectedHomeCity();
  {
    const purchaseC = purchaseCity();
    const selectedBuy = homePrice();
    const defaultBuy = defaultHomePriceForCity(purchaseC);
    const selectedRent = housingByBedrooms(c,'rent');
    const housingSample = cityHousingSample(c);
    const labelCurrentCity=S.lang==='en'?'Current city assumption used':'当前地点假设';
    const labelRetCity=S.lang==='en'?'Retirement city assumption used':'退休地点假设';
    const labelSwitch=S.lang==='en'?'Switch age':'切换年龄';
    const labelFactor=S.lang==='en'?'Living factor used':'生活系数';
    const labelLivingNow=S.lang==='en'?'Current city living cost at current age':'当前年龄的当前城市生活费';
    const labelLivingRet=S.lang==='en'?'Retirement city living cost at retirement age':'退休年龄的退休城市生活费';
    const labelHomePrice=S.lang==='en'?'Current model home price':'当前模型采用房价';
    const labelRent=S.lang==='en'?'Current model rent':'当前模型采用租金';
    $('cityInfo').innerHTML=`<div class="info-grid">
      <div class="icell"><div class="ik">${labelCurrentCity}</div><div class="iv">${cityName(currentHomeCity())}</div></div>
      <div class="icell"><div class="ik">${labelRetCity}</div><div class="iv">${cityName(c)}</div></div>
      <div class="icell"><div class="ik">${labelSwitch}</div><div class="iv">${S.relocationPath==='returnChina'?n('fiAge')+(S.lang==='en'?' yrs':'岁'):(S.lang==='en'?'Not used':'不切换')}</div></div>
      <div class="icell"><div class="ik">${labelFactor}</div><div class="iv">${c.livingFactor.toFixed(2)}x</div></div>
      <div class="icell"><div class="ik">${labelLivingNow}</div><div class="iv">${money(livingSpendForCity(currentHomeCity(),n('currentAge')))}${S.lang==='en'?'/yr':'/年'}</div></div>
      <div class="icell"><div class="ik">${labelLivingRet}</div><div class="iv">${money(livingSpendForCity(c,n('fiAge')))}${S.lang==='en'?'/yr':'/年'}</div></div>
      <div class="icell"><div class="ik">${labelHomePrice}</div><div class="iv">${S.housing==='buy'?compact(selectedBuy):'$0'}</div></div>
      <div class="icell"><div class="ik">${labelRent}</div><div class="iv">${S.housing==='rent'?money(selectedRent/12)+(S.lang==='en'?'/mo':'/月'):'$0'}</div></div>
    </div>
    <div class="note" style="margin-top:10px">${S.lang==='en'
      ? `Final assumption used in the model: ${cityName(currentHomeCity())} before the switch age, then ${cityName(c)} after the switch age. This location assumption drives the living-cost factor and the retirement housing defaults below.`
      : `模型最终使用的假设：切换年龄之前按 ${cityName(currentHomeCity())} 计算，切换年龄之后按 ${cityName(c)} 计算。这个地点假设会继续驱动下面的生活费系数和退休住房默认值。`
    }</div>
    <div class="note" style="margin-top:8px">${cityResource(c)}</div>`;
  }
  let now=spend(45),ad=adultSpend(45);
  
  
  let liquidGoal=liquidTarget(),propertyGoal=houseReserve(),goal=totalTarget();
  const endAge=Math.max(80,n('fiAge'));
  const currentData=deterministic(null,0,endAge);
  const currentFireIndex=currentData.findIndex(x=>x.totalWealth>=totalTargetAtAge(x.age));
  const currentFireAge=currentFireIndex>=0?currentData[currentFireIndex].age:null;
  currentPathFireIndex=currentFireIndex;
  currentPathFireAge=currentFireAge;
  const summaryTextEl=$('summaryText');
  if(summaryTextEl) summaryTextEl.innerHTML=summaryText(currentData,currentFireAge,S.projectionMode);
  const req=solveIncome(goal),cut=solveCut(goal);
  const targetData=deterministic(req,0,endAge);
  const data=S.projectionMode==='target'?targetData:currentData;
  lastAnnualRows=data;
  lastAnnualProjectionMode=S.projectionMode;
  lastAnnualFireAge=currentFireAge;
  const fiPoint=data.find(x=>x.age===n('fiAge'))||data.slice(-1)[0];
  const age80Point=currentData.find(x=>x.age===80)||currentData[currentData.length-1];
  const proj=fiPoint.assets;
  const projectedTotal=fiPoint.totalWealth;
  const gap=projectedTotal-goal;
  const formulaInfo=$('formulaInfo');
  if(formulaInfo){
    const currentRetCity=retirementLocationCity(n('fiAge'));
    const preRetCity=S.relocationPath==='returnChina'?CITY.bay:currentRetCity;
    const postRetCity=currentRetCity;
    const investRate=(n('ret')*100).toFixed(1)+'%';
    const taxRatePct=(tx.effective*100).toFixed(1)+'%';
    const lifestyleMult=LIFE[S.lifestyle].toFixed(2)+'x';
    const fiSpend=spend(n('fiAge'));
    const preLiving=money(livingSpendForCity(preRetCity,n('currentAge')))+(S.lang==='en'?'/yr':'/年');
    const postLiving=money(livingSpendForCity(postRetCity,n('fiAge')))+(S.lang==='en'?'/yr':'/年');
    const currentRetSpend=money(fiSpend.total)+(S.lang==='en'?'/yr':'/年');
    const mortgageNote=S.housing==='buy'
      ? `${money(mortgageSnapshot(n('fiAge')).annualPayment)}${S.lang==='en'?'/yr':'/年'}`
      : '$0';
    formulaInfo.innerHTML=`<div class="info-grid">
      <div class="icell"><div class="ik">${S.lang==='en'?'Taxed income':'税后收入'}</div><div class="iv">${money(tx.net)}${S.lang==='en'?'/yr':'/年'}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Formula':'公式'}</div><div class="iv">${money(gross())}${S.lang==='en'?'/yr':'/年'} × (1 − ${taxRatePct})</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Income growth':'年收入增长率'}</div><div class="iv">${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}%</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Projected gross at FI age':'退休年龄预计税前收入'}</div><div class="iv">${money(incomeAtAge(n('fiAge')))}${S.lang==='en'?'/yr':'/年'}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Retirement lifestyle multiplier':'退休后生活方式倍率'}</div><div class="iv">${lifestyleMult}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Living cost path':'生活费路径'}</div><div class="iv">${preLiving}${S.relocationPath==='returnChina'&&currentRetCity.country==='CN'?` → ${postLiving}`:''}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Retirement spend (this age)':'当前年龄支出'}</div><div class="iv">${currentRetSpend}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Mortgage / housing cash cost':'房贷 / 住房现金成本'}</div><div class="iv">${mortgageNote}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Retirement spending PV':'退休期支出现值'}</div><div class="iv">${compact(liquidGoal)}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Total wealth target':'总财富目标'}</div><div class="iv">${compact(goal)} = ${compact(liquidGoal)} + ${compact(propertyGoal)}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Projected wealth at FI age':'退休年龄预计总财富'}</div><div class="iv">${compact(projectedTotal)} = ${compact(fiPoint.assets)} + ${compact(fiPoint.homeEquity)}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Wealth gap':'财富 Gap'}</div><div class="iv">${(gap>=0?'+':'−')+compact(Math.abs(gap))}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Current inputs':'当前输入'}</div><div class="iv">${S.lang==='en'?`${n('currentAge')} / ${n('fiAge')} yrs · ${money(n('assets'))} · ${money(n('income'))}/yr`:`${n('currentAge')} / ${n('fiAge')}岁 · ${money(n('assets'))} · ${money(n('income'))}/年`}</div></div>
      <div class="icell"><div class="ik">${S.lang==='en'?'Return / return-city rule':'回国 / 城市规则'}</div><div class="iv">${S.lang==='en'
        ? (S.relocationPath==='returnChina'
            ? `Before age ${n('fiAge')}, use ${cityName(preRetCity)}; from age ${n('fiAge')} onward, use ${cityName(postRetCity)}.`
            : `No China city switch; stay in ${cityName(postRetCity)} through age 80.`)
        : (S.relocationPath==='returnChina'
            ? `从 ${n('fiAge')} 岁前按 ${preRetCity.nameZh} 计算；${n('fiAge')} 岁起按 ${postRetCity.nameZh} 计算。`
            : `不切换回国城市，直到 80 岁都按 ${postRetCity.nameZh} 计算。`)}</div></div>
    </div>
    <div class="desc" style="margin-top:8px">${S.lang==='en'
      ? `Main inputs used here: real return ${investRate}, effective tax ${taxRatePct}, income growth ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}%, retirement lifestyle ${lifestyleMult}, current-stage Bay Area baseline ${money(bayBaseSpend())}/yr, selected city factor ${c.livingFactor.toFixed(2)}x, and retirement age ${n('fiAge')}.`
      : `这里主要用到的输入：实际回报 ${investRate}、有效税率 ${taxRatePct}、年收入增长率 ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}%、退休后生活方式倍率 ${lifestyleMult}、当前阶段湾区基准生活费 ${money(bayBaseSpend())}/年、所选城市系数 ${c.livingFactor.toFixed(2)}x、退休年龄 ${n('fiAge')} 岁。`
    }</div>
    <div class="desc" style="margin-top:8px">${S.lang==='en'
      ? `<b>FIRE definition:</b> at the retirement age, passive income (withdrawals + portfolio returns) plus any retained labor income should be enough to cover that year’s spending; separately, the total asset base should stay strong enough through age 80.`
      : `<b>财富自由定义：</b>在退休年龄，<b>被动收入（提款 + 投资收益）</b> 再加上任何保留的劳动收入，应该足以覆盖当年的支出；同时，总资产基底还要足够支撑到80岁。`
    }</div>`;
  }
  const faqFormulaDetail=document.getElementById('faqFormulaDetail');
  if(faqFormulaDetail){
    const exampleAge=n('fiAge');
    const exampleProjected=compact(projectedTotal);
    const exampleGoal=compact(goal);
    const exampleLiquid=compact(liquidGoal);
    const exampleProperty=compact(propertyGoal);
    const exampleGap=(gap>=0?'+':'−')+compact(Math.abs(gap));
    const exampleReq=money(req)+(S.lang==='en'?'/yr':'/年');
    const exampleCut=money(cut)+(S.lang==='en'?'/yr':'/年');
    faqFormulaDetail.querySelector('summary').textContent=S.lang==='en'
      ? 'All formulas + current example'
      : '所有计算公式 + 当前示例';
    faqFormulaDetail.querySelector('.answer').innerHTML=S.lang==='en'
      ? `<b>Current example</b><br>
        With the current settings, the retirement-age target at <b>${exampleAge} years old</b> is <b>${exampleGoal}</b> total wealth.<br>
        It is built from <b>${exampleLiquid}</b> of retirement spending PV plus <b>${exampleProperty}</b> of home equity.<br>
        The current-path projection is <b>${exampleProjected}</b>, so the wealth gap is <b>${exampleGap}</b>.<br>
        To hit that target, the model estimates you need about <b>${exampleReq}</b> of gross income, or else you would need to cut spending by about <b>${exampleCut}</b> per year.<br><br>
        <b>How the number is built</b><br>
        1) We estimate after-tax income from gross income using federal, state, and payroll taxes.<br>
        2) We estimate annual spending from housing, living, travel, parents / family support, and childcare / education.<br>
        3) We discount future retirement spending through age 80 using the real return assumption.<br>
        4) Required total wealth = retirement spending PV + home equity.<br>
        5) Projected wealth = projected investable assets + home equity at the FI age.<br><br>
        <b>FIRE definition</b><br>
        The model treats you as financially independent when passive income plus any retained labor income can cover annual spending at the retirement age, while the asset base remains strong enough through age 80. In practical terms, the withdrawal you need is the remaining gap after passive income is subtracted from spending.`
      : `<b>当前示例</b><br>
        按现在这套设置，<b>${exampleAge}岁</b> 时需要的总财富是 <b>${exampleGoal}</b>。<br>
        其中 <b>${exampleLiquid}</b> 来自“退休期支出现值”，<b>${exampleProperty}</b> 来自“房屋净值”。<br>
        当前路径预计总财富是 <b>${exampleProjected}</b>，所以财富 Gap 是 <b>${exampleGap}</b>。<br>
        如果要达到这个目标，模型估算所需税前年收入大约是 <b>${exampleReq}</b>，或者你每年大约需要少花 <b>${exampleCut}</b>。<br><br>
        <b>这个数字怎么来的</b><br>
        1) 先根据税前年收入和 Federal / 州税 / payroll tax 估算税后收入。<br>
        2) 再根据住房、生活、旅行、父母 / 家人支持、孩子托育/教育估算年度支出。<br>
        3) 把未来到80岁的退休支出按实际回报率折现。<br>
        4) 退休时所需总财富 = 退休期支出现值 + 房屋净值。<br>
        5) 当前路径预计总财富 = 退休年龄时预计可投资资产 + 房屋净值。<br><br>
        <b>财富自由定义</b><br>
        在退休年龄，被动收入加上任何保留的劳动收入，应该足以覆盖当年的支出；同时，总资产基底还要足够支撑到80岁。`;
  }
  $('totalNeed').textContent=compact(goal);
  $('totalNeedBreakdown').textContent=S.lang==='en'
    ? `Retirement spending PV ${compact(liquidGoal)} + home equity ${compact(propertyGoal)} = total wealth ${compact(goal)}`
    : `退休期支出现值 ${compact(liquidGoal)} + 房屋净值 ${compact(propertyGoal)} = 总财富 ${compact(goal)}`;
  $('projectWealth').textContent=compact(proj);
  $('projectWealthSub').textContent=S.lang==='en'
    ? `Home equity ${compact(fiPoint.homeEquity)} · total wealth ${compact(projectedTotal)} · gap ${(gap>=0?'+':'−')+compact(Math.abs(gap))}`
    : `房屋净值 ${compact(fiPoint.homeEquity)} · 总财富 ${compact(projectedTotal)} · Gap ${(gap>=0?'+':'−')+compact(Math.abs(gap))}`;
  $('path80Wealth').textContent=compact(age80Point.totalWealth);
  $('requiredIncomeTop').textContent=money(req)+(S.lang==='en'?'/yr':'/年');
  $('requiredIncome').textContent=money(req)+(S.lang==='en'?'/yr':'/年');
  const currentGross=gross();
  const pctDiff=currentGross>0?(req-currentGross)/currentGross:0;
  const pctAbs=Math.abs(pctDiff*100);
  const pctText=S.lang==='en'
    ? (Math.abs(pctDiff)<0.005
      ? 'About the same as the current income assumption'
      : (pctDiff>0?`About ${pctAbs.toFixed(0)}% higher than current income`:`About ${pctAbs.toFixed(0)}% lower than current income`))
    : (Math.abs(pctDiff)<0.005
      ? '与当前收入假设基本相同'
      : (pctDiff>0?`比当前收入高 ${pctAbs.toFixed(0)}%`:`比当前收入低 ${pctAbs.toFixed(0)}%`));
  $('requiredIncomePctTop').textContent=S.lang==='en'
    ? `${pctText} · current ${money(currentGross)}/yr · assumes ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}% annual growth`
    : `${pctText} · 当前 ${money(currentGross)}/年 · 假设年收入增长 ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}%`;
  $('incomeDelta').textContent=S.lang==='en'
    ? (req<=currentGross
      ? `Current income is already sufficient under the deterministic baseline, assuming ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}% annual growth.`
      : `It is about ${money(req-currentGross)}/yr above current gross income, back-solved with ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}% annual growth.`)
    : (req<=currentGross
      ? `当前收入按确定性基准已足够，且已把年收入增长 ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}% 算进去。`
      : `比当前总税前年收入多约 ${money(req-currentGross)}/年，已按年收入增长 ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}% 反推。`);
  $('incomeDeltaPct').textContent=S.lang==='en'
    ? (Math.abs(pctDiff)<0.005?'About the same as current income assumptions.':(pctDiff>0?`About ${pctAbs.toFixed(0)}% higher than current income.`:`About ${pctAbs.toFixed(0)}% lower than current income.`))
    : `${pctText} · 年收入增长 ${(n('incomeGrowth')*100).toFixed(1).replace(/\.0$/,'')}%`;
  $('spendCut').textContent=money(cut)+(S.lang==='en'?'/yr':'/年');
  const fireAgeLabel=$('fireAgeLabel');
  const fireAgeValue=$('fireAgeValue');
  const fireAgeSub=$('fireAgeSub');
  const fireAgeSideNote=$('fireAgeSideNote');
  if(fireAgeLabel) fireAgeLabel.textContent=S.lang==='en'?'Current-path FIRE age':'当前路径的财富自由年龄';
  if(fireAgeSub) fireAgeSub.textContent=S.lang==='en'
    ? 'The first year when the current path reaches the age-specific total wealth target'
    : '当前路径首次达到对应年龄总财富门槛的那一年';
  if(fireAgeValue) fireAgeValue.textContent=currentFireAge===null
    ? (S.lang==='en'?'Not reached by age 80':'80岁前未达到')
    : (S.lang==='en'?`${currentFireAge} years old`:`${currentFireAge}岁`);
  if(fireAgeSideNote) fireAgeSideNote.textContent=currentFireAge===null
    ? (S.lang==='en'?'On the current path, the age-specific wealth target is never reached before age 80.':'按当前路径，到80岁前仍未达到对应年龄的总财富门槛。')
    : (S.lang==='en'
      ? `The current path first reaches the wealth target in ${currentFireAge}.`
      : `按当前路径，首次达到总财富门槛是在 ${currentFireAge} 岁。`);
  draw(data);
  drawWealth(data);
  renderRows('rows',data,S.projectionMode==='current'?currentFireAge:null);
 }
const downloadAnnualCsvBtn=$('downloadAnnualCsvBtn');
if(downloadAnnualCsvBtn) downloadAnnualCsvBtn.addEventListener('click',downloadAnnualCsv);
const exportPdfBtn=$('exportPdfBtn');
if(exportPdfBtn) exportPdfBtn.addEventListener('click',openPrintableReport);
bind('langMode','lang');bind('mainTabs','tab');bind('scope','scope');bind('relocationPath','relocationPath');bind('taxMode','taxMode');bind('childcare','childcare');bind('usSchool','usSchool');bind('cnSchool','cnSchool');bindSelect('currentCity','currentCity');bindSelect('city','city');bind('housing','housing');bind('lifestyle','lifestyle');
bindRange('kids','kids',Number);
document.querySelectorAll('#scope button').forEach(btn=>btn.addEventListener('click',()=>{S.livingPartsAuto.pre=true;S.livingPartsAuto.post=true;S.autoFood.pre=true;S.autoFood.post=true;updateLivingTotalsView();}));
document.querySelectorAll('#lifestyle button').forEach(btn=>btn.addEventListener('click',()=>{scheduleUpdate();}));
['currentAge','fiAge','postRetireIncome','assets','income','partnerIncome','ret','homePrice','downPay','mortgageRate','mortgageYears','homeCarry','manualTax','childBirthAge'].forEach(id=>$(id).addEventListener('input',()=>{if(id==='childBirthAge')S.childBirthAgeManual=true;scheduleUpdate()}));
const incomeGrowthEl=$('incomeGrowth');
if(incomeGrowthEl) incomeGrowthEl.addEventListener('input',()=>{S.incomeGrowth=Number(incomeGrowthEl.value)||0;scheduleUpdate()});
const homePurchaseAgeEl=$('homePurchaseAge');
  if(homePurchaseAgeEl) homePurchaseAgeEl.addEventListener('input',()=>{S.homePurchaseAgeManual=true;scheduleUpdate()});
const homePriceEl=$('homePrice');
  if(homePriceEl) homePriceEl.addEventListener('input',()=>{S.homePriceManual=true;scheduleUpdate()});
 $('bayBaseSpend').addEventListener('input',e=>{syncLivingPartsFromTotal(Number(e.target.value)||0,'pre');updateLivingTotalsView();scheduleUpdate()});
 const bayBaseSpendAfterEl=$('bayBaseSpendAfter');
 if(bayBaseSpendAfterEl) bayBaseSpendAfterEl.addEventListener('input',e=>{syncLivingPartsFromTotal(Number(e.target.value)||0,'post');updateLivingTotalsView();scheduleUpdate()});
 document.addEventListener('input',e=>{
   const t=e.target;
   if(!t || !t.matches) return;
   if(t.matches('[data-living-key]')){
     const key=t.dataset.livingKey;
     if(key){
       const stage=livingStageForAge(n('currentAge'));
       if(key==='food') S.autoFood[stage]=false;
       setLivingPart(key,Number(t.value)||0,stage);
       updateLivingTotalsView();
       scheduleUpdate();
     }
   }
 });
 $('projectionCurrentBtn').addEventListener('click',()=>{S.projectionMode='current';scheduleUpdate();});
 $('projectionTargetBtn').addEventListener('click',()=>{S.projectionMode='target';scheduleUpdate();});
  $('taxState').addEventListener('change',e=>{S.taxState=e.target.value;scheduleUpdate();});
  const chartEl=$('chart');
  chartEl.addEventListener('mousemove',e=>showTooltipFromClientX(e.clientX,e.clientY));
  chartEl.addEventListener('mouseleave',()=>{$('chartTooltip').style.display='none'});
  chartEl.addEventListener('touchstart',e=>{if(e.touches[0])showTooltipFromClientX(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
  chartEl.addEventListener('touchmove',e=>{if(e.touches[0])showTooltipFromClientX(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
  chartEl.addEventListener('touchend',()=>{setTimeout(()=>{$('chartTooltip').style.display='none'},900)});
  const wealthChartEl=$('wealthChart');
  if(wealthChartEl){
    wealthChartEl.addEventListener('mousemove',e=>showWealthTooltipFromClientX(e.clientX,e.clientY));
    wealthChartEl.addEventListener('mouseleave',()=>{$('wealthTooltip').style.display='none'});
    wealthChartEl.addEventListener('touchstart',e=>{if(e.touches[0])showWealthTooltipFromClientX(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
    wealthChartEl.addEventListener('touchmove',e=>{if(e.touches[0])showWealthTooltipFromClientX(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
    wealthChartEl.addEventListener('touchend',()=>{setTimeout(()=>{$('wealthTooltip').style.display='none'},900)});
  }

 const LIVING_PARTS=[
  ['food', {zh:'吃饭', en:'Food'}],
  ['goods', {zh:'消费品', en:'Consumer goods'}],
  ['insurance', {zh:'保险', en:'Insurance'}],
  ['medical', {zh:'医疗', en:'Medical'}],
  ['misc', {zh:'其他', en:'Misc'}]
 ];
function livingStageForAge(age=n('currentAge')){
  return (S.kids>0 && age>=n('childBirthAge')) ? 'post' : 'pre';
}
function livingStageLabel(stage){
  return stage==='post'
    ? (S.lang==='en' ? 'after-kids' : (S.lang==='bilingual' ? '有孩子后 / after-kids' : '有孩子后'))
    : (S.lang==='en' ? 'before-kids' : (S.lang==='bilingual' ? '有孩子前 / before-kids' : '有孩子前'));
}
function livingStageSlug(stage){
  return stage==='post' ? 'post' : 'pre';
}
function livingStagePartsKey(stage){
  return livingStageSlug(stage)==='post' ? 'post' : 'pre';
}
function defaultLivingPartsForHousehold(stage='pre'){
  const a=adults();
  const k=stage==='post' ? S.kids : 0;
  const people=a+k;
  return {
    food: Math.round(people * 30 * 365),
    goods: Math.round(people * 11 * 365),
    insurance: Math.round(a*1300 + k*250),
    medical: Math.round(a*2400 + k*1000),
    misc: Math.round(people * 2000)
  };
 }
 function livingParts(stageOrAge=livingStageForAge()){
  const stage=typeof stageOrAge==='string'
    ? livingStageSlug(stageOrAge)
    : livingStageForAge(Number(stageOrAge));
  if(!S.livingParts[stage] || S.livingPartsAuto[stage]){
    S.livingParts[stage]=defaultLivingPartsForHousehold(stage);
    S.livingPartsAuto[stage]=true;
  }
  return S.livingParts[stage];
 }
 function livingPartsTotal(stageOrAge=livingStageForAge()){
  return Object.values(livingParts(stageOrAge)).reduce((a,b)=>a+b,0);
 }
function foodAssumptionAnnual(stage='pre'){
  const a=adults();
  const k=stage==='post' ? S.kids : 0;
  const people=a+k;
  return Math.round(people * 30 * 365);
 }
function foodAssumptionNote(stage=livingStageForAge()){
  const amount=foodAssumptionAnnual(stage);
  if(S.lang==='en'){
    return `Calibrated from your spend snapshot: about ${money(amount)}/yr for the ${livingStageLabel(stage)} stage. We now use a roughly $30/day-per-person floor, so the food baseline scales directly with the household size for that stage.`;
  }
  if(S.lang==='bilingual'){
    return `吃饭口径按你去年的支出做了校准：${livingStageLabel(stage)}阶段大约 ${money(amount)}/年。现在按大约每人每天 $30 的底线来算，所以 food 基准会直接按该阶段的 household 人头放大。 / Calibrated from your spend snapshot: about ${money(amount)}/yr for the ${livingStageLabel(stage)} stage. We now use a roughly $30/day-per-person floor, so the food baseline scales directly with the household size for that stage.`;
  }
  return `吃饭口径按你去年的支出做了校准：${livingStageLabel(stage)}阶段大约 ${money(amount)}/年。现在按大约每人每天 $30 的底线来算，所以 food 基准会直接按该阶段的 household 人头放大。`;
 }
function livingBaseSpendDescText(){
  if(S.lang==='en'){
    return 'This is the current-city household living cost before housing. We split it into two stage-specific baselines: before kids and after kids. The model switches between them at the first child birth age, and the detail below edits the stage that matches your current age. Food and goods scale by household size within that stage, insurance and medical primarily scale by adults, and travel remains a separate top-level spending item. Insurance here mainly means home, auto, life, and umbrella premiums.';
  }
  if(S.lang==='bilingual'){
    return '这是当前地点房贷前的家庭总生活费。我们把它拆成两段：有孩子前和有孩子后。模型会在第一个孩子出生年龄处自动切换，下面的明细默认编辑你当前年龄对应的那一段。food 和 goods 会按该阶段的家庭人数变化，insurance 和 medical 主要按成人数变化，travel 仍然单独作为顶层支出。这里的 insurance 主要指房屋、车、寿险和 umbrella 这类保费。 / This is the current-city household living cost before housing. We split it into two stage-specific baselines: before kids and after kids. The model switches between them at the first child birth age, and the detail below edits the stage that matches your current age. Food and goods scale by household size within that stage, insurance and medical primarily scale by adults, and travel remains a separate top-level spending item. Insurance here mainly means home, auto, life, and umbrella premiums.';
  }
  return '这是当前地点房贷前的家庭总生活费。我们把它拆成两段：有孩子前和有孩子后。模型会在第一个孩子出生年龄处自动切换，下面的明细默认编辑你当前年龄对应的那一段。food 和 goods 会按该阶段的家庭人数变化，insurance 和 medical 主要按成人数变化，travel 仍然单独作为顶层支出。这里的 insurance 主要指房屋、车、寿险和 umbrella 这类保费。';
 }
 function syncFoodIfAuto(stage=livingStageForAge()){
  const key=livingStageSlug(stage);
  if(!S.autoFood[key]) return;
  S.livingParts[key].food=foodAssumptionAnnual(key);
 }
 function recalibrateLivingPartsIfAuto(stage=livingStageForAge()){
  const key=livingStageSlug(stage);
  if(!S.livingPartsAuto[key]) return;
  S.livingParts[key]=defaultLivingPartsForHousehold(key);
  syncFoodIfAuto(key);
 }
 function livingBaseTargetTotal(stageOrAge=livingStageForAge()){
  const stage=typeof stageOrAge==='string'
    ? livingStageSlug(stageOrAge)
    : livingStageForAge(Number(stageOrAge));
  recalibrateLivingPartsIfAuto(stage);
  syncFoodIfAuto(stage);
  return livingPartsTotal(stage);
 }
 function refreshLivingEditorDisplay(){
  const livingEditorInfo=$('livingEditorInfo');
  if(!livingEditorInfo) return;
  const stage=livingStageForAge(n('currentAge'));
  const p=livingParts(stage);
  const total=livingPartsTotal(stage);
  livingEditorInfo.querySelectorAll('[data-living-pill]').forEach(el=>{
    const key=el.dataset.livingPill;
    if(!key || !(key in p)) return;
    el.textContent=money(p[key])+(S.lang==='en'?'/yr':'/年');
  });
  livingEditorInfo.querySelectorAll('[data-living-key]').forEach(el=>{
    const key=el.dataset.livingKey;
    if(!key || !(key in p)) return;
    el.value=String(p[key]);
    el.max=String(Math.max(2000,Math.ceil(Math.max(total,p[key])*1.8/500)*500));
  });
  const livingBaseTotalV=$('livingBaseTotalV');
  if(livingBaseTotalV) livingBaseTotalV.innerHTML=`${money(total)}${S.lang==='en'?'/yr':'/年'}`;
 }
 function updateLivingTotalsView(){
  const preTotal=livingBaseTargetTotal('pre');
  const postTotal=livingBaseTargetTotal('post');
  const stage=livingStageForAge(n('currentAge'));
  const activeTotal=stage==='post'?postTotal:preTotal;
  const bayBaseSpendEl=$('bayBaseSpend');
  const bayBaseSpendV=$('bayBaseSpendV');
  const bayBaseSpendAfterEl=$('bayBaseSpendAfter');
  const bayBaseSpendAfterV=$('bayBaseSpendAfterV');
  const livingBaseTotalV=$('livingBaseTotalV');
  const livingStageHint=$('livingStageHint');
  if(bayBaseSpendEl) bayBaseSpendEl.value=preTotal;
  if(bayBaseSpendV) bayBaseSpendV.textContent=money(preTotal)+'/yr';
  if(bayBaseSpendAfterEl) bayBaseSpendAfterEl.value=postTotal;
  if(bayBaseSpendAfterV) bayBaseSpendAfterV.textContent=money(postTotal)+'/yr';
  if(livingBaseTotalV) livingBaseTotalV.innerHTML=`${money(activeTotal)}${S.lang==='en'?'/yr':'/年'}`;
  if(livingStageHint) livingStageHint.innerHTML=S.lang==='en'
    ? `The model uses <b>${livingStageLabel(stage)}</b> living costs for the current age. You can still edit both stage totals above; the detailed editor below follows the stage that matches your current age.`
    : (S.lang==='bilingual'
      ? `模型在当前年龄使用 <b>${livingStageLabel(stage)}</b> 阶段的生活费。你可以在上面分别编辑两段总额；下面的明细编辑器会跟随你当前年龄所在的阶段。 / The model uses <b>${livingStageLabel(stage)}</b> living costs for the current age. You can still edit both stage totals above; the detailed editor below follows the stage that matches your current age.`
      : `模型在当前年龄使用 <b>${livingStageLabel(stage)}</b> 阶段的生活费。你可以在上面分别编辑两段总额；下面的明细编辑器会跟随你当前年龄所在的阶段。`);
  refreshLivingEditorDisplay();
 }
 function syncLivingPartsFromTotal(total,stageOrAge=livingStageForAge()){
  const stage=typeof stageOrAge==='string'
    ? livingStageSlug(stageOrAge)
    : livingStageForAge(Number(stageOrAge));
  const p=livingParts(stage);
  S.livingPartsAuto[stage]=false;
  const current=livingPartsTotal(stage);
  if(current<=0){
    const base={food:.3333,goods:.1806,insurance:.1528,medical:.125,misc:.2083};
    Object.keys(base).forEach(k=>{p[k]=Math.max(0,Math.round(total*base[k]));});
  }else{
    const ratio=total/current;
    Object.keys(p).forEach(k=>{p[k]=Math.max(0,Math.round(p[k]*ratio));});
    const diff=total-livingPartsTotal(stage);
    p.misc=Math.max(0,p.misc+diff);
  }
  refreshLivingEditorDisplay();
 }
 function setLivingPart(key,value,stageOrAge=livingStageForAge()){
  const stage=typeof stageOrAge==='string'
    ? livingStageSlug(stageOrAge)
    : livingStageForAge(Number(stageOrAge));
  const p=livingParts(stage);
  S.livingPartsAuto[stage]=false;
  p[key]=Math.max(0,Math.round(value));
  refreshLivingEditorDisplay();
 }

 update();
 Promise.all([loadFoodSampleCSV(),loadHousingSampleCSV(),loadKidsEduSampleCSV()]).finally(()=>scheduleUpdate());
})();
