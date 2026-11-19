/** Preparation only. Paste after reviewing the existing bound script; no trigger is created. */
var QringAiTrafficV1 = (function () {
  'use strict';
  var HEADERS = ['日付', 'AIサービス', '参照元 / メディア', 'セッション'];
  var TAB = 'GA4_AI流入元', STATUS = '更新状況', TZ = 'Asia/Tokyo';
  // Exact hostname candidates, not claims that these sources were observed in this property.
  var HOSTS = {
    'chatgpt.com':'ChatGPT', 'www.chatgpt.com':'ChatGPT', 'chat.openai.com':'ChatGPT',
    'perplexity.ai':'Perplexity', 'www.perplexity.ai':'Perplexity',
    'claude.ai':'Claude', 'www.claude.ai':'Claude',
    'gemini.google.com':'Gemini', 'copilot.microsoft.com':'Copilot'
  };
  function fail(code) { var e = new Error(code); e.qringCode = code; throw e; }
  function day(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value+'T12:00:00Z').toISOString().slice(0,10) !== value) fail('INVALID_DATE');
    return value;
  }
  function move(value, offset) { var d = new Date(day(value)+'T12:00:00Z'); d.setUTCDate(d.getUTCDate()+offset); return d.toISOString().slice(0,10); }
  function windowFor(today) { var end = move(today,-1); return {start:move(end,-89), end:end}; }
  function source(value) {
    var pieces = String(value).split(' / '), original = pieces.length === 2 ? pieces[0].trim().toLowerCase() : '';
    var host = original.replace(/^https?:\/\//,'').split(/[/?#]/)[0];
    // Never export paths, query strings, email addresses, or arbitrary UTM values.
    if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(host) || host.length > 253) host = '';
    var medium = pieces.length === 2 && /^(?:[a-zA-Z0-9_-]{1,40}|\(none\)|\(not set\))$/.test(pieces[1].trim()) ? pieces[1].trim() : '(媒体未特定)';
    return {service:HOSTS[host] || null, display:(host || '(参照元未特定)')+' / '+medium};
  }
  function request(dimensions, w, offset, filter, limit) {
    var q = {dateRanges:[{startDate:w.start,endDate:w.end}],dimensions:dimensions.map(function(n){return {name:n};}),metrics:[{name:'sessions'}],limit:limit,offset:offset,
      orderBys:dimensions.map(function(n){return {dimension:{dimensionName:n}};})};
    if (filter) q.dimensionFilter = {filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{matchType:'EXACT',value:'AI Assistant',caseSensitive:true}}};
    return q;
  }
  function fetchRows(run, property, dimensions, w, filter, pageSize) {
    var limit = pageSize || 10000, rows = [], total = null, keys = {};
    do {
      var response = run(request(dimensions,w,rows.length,filter,limit),property);
      if (!response || !response.metadata || response.metadata.timeZone !== TZ) fail('PROPERTY_TIMEZONE_UNCONFIRMED');
      var m=response.metadata;
      if (m.subjectToThresholding || m.dataLossFromOtherRow || (m.samplingMetadatas || []).length) fail('INCOMPLETE_OR_THRESHOLDED');
      if (JSON.stringify((response.dimensionHeaders || []).map(function(h){return h.name;})) !== JSON.stringify(dimensions) ||
          JSON.stringify((response.metricHeaders || []).map(function(h){return h.name;})) !== JSON.stringify(['sessions'])) fail('SCHEMA_MISMATCH');
      var count = Number(response.rowCount || 0), page = response.rows || [];
      if (!Number.isSafeInteger(count) || count < 0 || count > 50000 || (total !== null && total !== count)) fail('UNSTABLE_OR_OVERSIZED_REPORT');
      total = count;
      if (page.length > limit || rows.length+page.length > total || (!page.length && rows.length < total)) fail('INCOMPLETE_PAGE');
      page.forEach(function(r){
        if (!r.dimensionValues || r.dimensionValues.length !== dimensions.length || !r.metricValues || r.metricValues.length !== 1) fail('INVALID_ROW');
        var values = r.dimensionValues.map(function(v){return String(v.value || '');});
        var key=JSON.stringify(values);if(keys[key]) fail('DUPLICATE_REPORT_ROW');keys[key]=true;
        var date = values[0].replace(/^(\d{4})(\d{2})(\d{2})$/,'$1-$2-$3');day(date);
        var sessions = Number(r.metricValues[0].value);
        if (date < w.start || date > w.end || !/^\d+$/.test(String(r.metricValues[0].value)) || !Number.isSafeInteger(sessions) || sessions < 0) fail('INVALID_ROW');
        rows.push({date:date,source:filter ? null : values[1],channel:filter ? values[1] : values[2],sessions:sessions});
      });
    } while(rows.length < total);
    return rows;
  }
  function aggregate(rows, control, w) {
    var totals={}, expected={}, groups={}, seen={};
    rows.forEach(function(r){
      if(r.sessions>0) seen[r.date]=true;
      if(r.channel==='AI Assistant') totals[r.date]=(totals[r.date] || 0)+r.sessions;
      var s=source(r.source), service=s.service || (r.channel==='AI Assistant' ? '不明' : null);
      if(!service) return;
      var key=JSON.stringify([r.date,service,s.display]);groups[key]=(groups[key] || 0)+r.sessions;
    });
    control.forEach(function(r){if(r.channel!=='AI Assistant') fail('CONTROL_CHANNEL_MISMATCH');expected[r.date]=(expected[r.date] || 0)+r.sessions;});
    for(var d=w.start;d<=w.end;d=move(d,1)) if((totals[d]||0)!==(expected[d]||0)) fail('AI_CHANNEL_RECONCILIATION_FAILED');
    var output=Object.keys(groups).map(function(k){return JSON.parse(k).concat(groups[k]);});
    var represented={};output.forEach(function(r){represented[r[0]]=true;});
    var unknownDays=0;
    for(var date=w.start;date<=w.end;date=move(date,1)) if(!represented[date]) {
      // Without any observed traffic, API silence cannot prove collection was operating.
      output.push([date,seen[date]?'該当なし':'未確認','—',seen[date]?0:'']);if(!seen[date]) unknownDays++;
    }
    output.sort(function(a,b){return JSON.stringify(a.slice(0,3)).localeCompare(JSON.stringify(b.slice(0,3)));});
    return {rows:output,unknownDays:unknownDays,aiAssistantSessions:Object.keys(totals).reduce(function(n,k){return n+totals[k];},0)};
  }
  function refresh(deps, config) {
    var w=windowFor(config.today), dims=['date','sessionSourceMedium','sessionDefaultChannelGroup'];
    var rows=fetchRows(deps.run,config.property,dims,w,false,config.pageSize);
    var control=fetchRows(deps.run,config.property,['date','sessionDefaultChannelGroup'],w,true,config.pageSize);
    if(!rows.length) fail('NO_TRAFFIC_DATA');
    var result=aggregate(rows,control,w);
    // Commit only after BOTH full reports validate and reconcile; no sheet clear on API errors.
    deps.commit(result.rows,w);return result;
  }
  function commit(book, fresh, w) {
    var sheet=book.getSheetByName(TAB), old=[];
    if(sheet && sheet.getLastRow()) {
      if(sheet.getLastRow()>100000) fail('TARGET_TOO_LARGE');
      old=sheet.getRange(1,1,sheet.getLastRow(),4).getValues();
      if(JSON.stringify(old[0])!==JSON.stringify(HEADERS)) fail('TARGET_HEADER_MISMATCH');
      old.slice(1).forEach(function(r){day(String(r[0]));if(r.length!==4 || !/^(ChatGPT|Perplexity|Claude|Gemini|Copilot|不明|該当なし|未確認)$/.test(String(r[1])) || /^[=+@-]/.test(String(r[2])) || (r[3]!=='' && (!Number.isSafeInteger(r[3]) || r[3]<0))) fail('TARGET_ROW_MISMATCH');});
    }
    var keep=old.slice(1).filter(function(r){return String(r[0])<w.start || String(r[0])>w.end;});
    var data=keep.concat(fresh);data.sort(function(a,b){return String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1])) || String(a[2]).localeCompare(String(b[2]));});
    var matrix=[HEADERS].concat(data), height=Math.max(matrix.length,old.length);
    while(matrix.length<height) matrix.push(['','','','']);
    if(!sheet) sheet=book.insertSheet(TAB);
    if(sheet.getMaxRows()<height) sheet.insertRowsAfter(sheet.getMaxRows(),height-sheet.getMaxRows());
    sheet.getRange(1,1,height,3).setNumberFormat('@');
    sheet.getRange(1,1,height,4).setValues(matrix);
    sheet.setFrozenRows(1);
  }
  function status(book, value, stamp, detail) {
    var sheet=book.getSheetByName(STATUS);if(!sheet) fail('STATUS_TAB_MISSING');
    var last=sheet.getLastRow();if(last>2000) fail('STATUS_TOO_LARGE');
    var labels=last?sheet.getRange(1,1,last,1).getValues():[], hits=[];
    labels.forEach(function(r,i){if(r[0]===TAB) hits.push(i+1);});
    if(hits.length>1) fail('DUPLICATE_STATUS_ROW');
    var row=hits[0] || last+1;if(row>sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(),1);
    sheet.getRange(row,1,1,4).setValues([[TAB,value,stamp,detail]]);
  }
  function runEnabled() {
    var p=PropertiesService.getScriptProperties();
    if(p.getProperty('QRING_AI_WRITE_ENABLED')!=='true') return {status:'disabled'};
    var lock=LockService.getScriptLock();if(!lock.tryLock(0)) return {status:'busy'};
    var book=null, stage='setup', stamp=Utilities.formatDate(new Date(),TZ,'yyyy-MM-dd HH:mm:ss');
    try {
      var id=p.getProperty('QRING_AI_SPREADSHEET_ID'), property=p.getProperty('QRING_AI_GA4_PROPERTY_ID');
      if(!id || !/^\d+$/.test(property || '')) fail('CONFIG_REQUIRED');
      book=SpreadsheetApp.openById(id);
      if(!book.getSheetByName(STATUS)) fail('STATUS_TAB_MISSING');
      stage='fetch';var w=windowFor(Utilities.formatDate(new Date(),TZ,'yyyy-MM-dd'));
      var result=refresh({run:function(q,prop){return AnalyticsData.Properties.runReport(q,prop);},commit:function(rows,window){stage='write';commit(book,rows,window);}},
        {today:move(w.end,1),property:'properties/'+property});
      stage='status';status(book,'成功',stamp,w.start+'〜'+w.end+' / AI Assistant整合一致 / 元データ未確認'+result.unknownDays+'日');
      return {status:'success',rows:result.rows.length,unknownDays:result.unknownDays};
    } catch(e) {
      var code=e.qringCode || (stage==='write'?'WRITE_STATE_UNCONFIRMED':stage==='status'?'STATUS_WRITE_FAILED':'API_OR_SETUP_FAILED');
      var recorded=false;try{if(book){status(book,code==='NO_TRAFFIC_DATA'?'未確認':'失敗',stamp,code+'（前回成功データと今回の状態を区別）');recorded=true;}}catch(ignored){}
      return {status:'error',code:code,statusRecorded:recorded};
    } finally {lock.releaseLock();}
  }
  return {windowFor:windowFor,source:source,request:request,fetchRows:fetchRows,aggregate:aggregate,refresh:refresh,commit:commit,status:status,runEnabled:runEnabled};
})();
function updateQringAiTraffic() { return QringAiTrafficV1.runEnabled(); }
