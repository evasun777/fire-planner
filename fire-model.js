(function(global){
  const CITY = {
    bay:{nameZh:'湾区',nameEn:'Bay Area',livingFactor:1.00,rent3:6500*12,rent4:8000*12,buy3:1900000,buy4:2300000,travel:18000},
    nyc:{nameZh:'纽约',nameEn:'New York',livingFactor:1.14,rent3:7500*12,rent4:9000*12,buy3:1700000,buy4:2100000,travel:18000},
    seattle:{nameZh:'西雅图',nameEn:'Seattle',livingFactor:0.95,rent3:4600*12,rent4:5600*12,buy3:1250000,buy4:1550000,travel:17000},
    losangeles:{nameZh:'洛杉矶',nameEn:'Los Angeles',livingFactor:1.02,rent3:4200*12,rent4:5200*12,buy3:1150000,buy4:1450000,travel:17000},
    dallas:{nameZh:'达拉斯',nameEn:'Dallas',livingFactor:0.82,rent3:3200*12,rent4:4000*12,buy3:850000,buy4:1050000,travel:16000},
    shanghai:{nameZh:'上海',nameEn:'Shanghai',livingFactor:0.68,rent3:2100*12,rent4:2800*12,buy3:1500000,buy4:2000000,travel:18000},
    hangzhou:{nameZh:'杭州',nameEn:'Hangzhou',livingFactor:0.56,rent3:1400*12,rent4:1800*12,buy3:950000,buy4:1250000,travel:17000},
    suzhou:{nameZh:'苏州',nameEn:'Suzhou',livingFactor:0.52,rent3:1050*12,rent4:1350*12,buy3:700000,buy4:900000,travel:16000},
    chengdu:{nameZh:'成都',nameEn:'Chengdu',livingFactor:0.50,rent3:950*12,rent4:1250*12,buy3:620000,buy4:800000,travel:17000},
    kunming:{nameZh:'昆明',nameEn:'Kunming',livingFactor:0.44,rent3:750*12,rent4:1000*12,buy3:450000,buy4:580000,travel:16000}
  };

  const DEFAULT_STATE = {
    scope:'individual',
    currentAge:34,
    fiAge:45,
    currentCity:'bay',
    retireCity:'shanghai',
    path:'returnChina',
    housing:'buy',
    assets:1000000,
    income:200000,
    partnerIncome:200000,
    lifestyle:'base',
    kids:2,
    postRetireIncome:0.00,
    downPay:.20,
    carryRate:.018,
    baseLiving:30000,
    taxRate:.25
  };

  const LIFESTYLE_MULT = {lean:.86, base:1, comfort:1.20};

  function cloneDefaultState(){
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  function adults(state){
    return state.scope === 'family' ? 2 : 1;
  }
  function bedrooms(state){
    return Math.max(1, (state.scope === 'family' ? 2 : 1) + state.kids);
  }
  function lifestyleMult(state){
    return LIFESTYLE_MULT[state.lifestyle] || 1;
  }
  function familyMult(state){
    return state.scope === 'family' ? 1.60 : 1;
  }
  function currentCity(state){
    return CITY[state.currentCity] || CITY.bay;
  }
  function retireCityKey(state){
    return state.path === 'returnChina' ? state.retireCity : state.currentCity;
  }
  function retireCity(state){
    return CITY[retireCityKey(state)] || CITY.bay;
  }
  function housingAnnual(city, state){
    const br = bedrooms(state);
    const rentBase = br <= 2 ? city.rent3 * .55 : br === 3 ? city.rent3 : city.rent4;
    const buyBase = br <= 2 ? city.buy3 * .55 : br === 3 ? city.buy3 : city.buy4;
    return state.housing === 'buy' ? buyBase * state.carryRate : rentBase;
  }
  function housePrice(city, state){
    const br = bedrooms(state);
    return br <= 2 ? city.buy3 * .55 : br === 3 ? city.buy3 : city.buy4;
  }
  function kidAnnual(city, state){
    if(state.kids === 0) return 0;
    return state.kids * Math.round(14000 * city.livingFactor * (state.scope === 'family' ? 1.05 : 1));
  }
  function spendForCity(city, state){
    const living = state.baseLiving * city.livingFactor * lifestyleMult(state) * familyMult(state);
    const housing = housingAnnual(city, state);
    return Math.round(living + housing + city.travel + kidAnnual(city, state));
  }
  function currentSpend(state){
    return spendForCity(currentCity(state), state);
  }
  function retireSpend(state){
    return spendForCity(retireCity(state), state);
  }
  function grossIncome(state){
    return state.scope === 'family' ? state.income + state.partnerIncome : state.income;
  }
  function annualSavings(state){
    return Math.round(grossIncome(state) * (1 - state.taxRate) - currentSpend(state));
  }
  function targetNeed(state){
    const city = retireCity(state);
    const housingNeed = state.housing === 'buy' ? housePrice(city, state) * state.downPay : 0;
    return Math.round(retireSpend(state) * 25 + housingNeed);
  }
  function projectedAssetsAt(state, ageEnd){
    let a = state.assets;
    const save = annualSavings(state);
    for(let age = state.currentAge; age < ageEnd; age++){
      a = a * 1.07 + save;
    }
    return Math.round(a);
  }
  function fireAgeEstimate(state){
    const need = targetNeed(state);
    let a = state.assets;
    const save = annualSavings(state);
    if(a >= need) return state.currentAge;
    for(let age = state.currentAge + 1; age <= 80; age++){
      a = a * 1.07 + save;
      if(a >= need) return age;
    }
    return null;
  }
  function summaryLine(state){
    return [
      state.scope === 'family' ? '双成人家庭' : '个人口径',
      `${state.currentAge} 岁 → ${state.fiAge} 岁`,
      `${(currentCity(state).nameZh)} → ${(retireCity(state).nameZh)}`,
      state.housing === 'buy' ? '买房' : '租房',
      `${state.kids} 个孩子`
    ].join(' · ');
  }
  function formatMoney(value){
    return '$' + Math.round(value).toLocaleString('en-US');
  }
  function formatMoneyYear(value){
    return formatMoney(value) + '/yr';
  }
  function formatPct(value){
    return Math.round(value * 100) + '%';
  }

  global.FirePlannerModel = {
    CITY,
    DEFAULT_STATE,
    cloneDefaultState,
    adults,
    bedrooms,
    lifestyleMult,
    familyMult,
    currentCity,
    retireCity,
    housingAnnual,
    housePrice,
    kidAnnual,
    spendForCity,
    currentSpend,
    retireSpend,
    grossIncome,
    annualSavings,
    targetNeed,
    projectedAssetsAt,
    fireAgeEstimate,
    summaryLine,
    formatMoney,
    formatMoneyYear,
    formatPct
  };
})(window);
