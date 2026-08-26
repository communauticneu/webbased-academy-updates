const BASE='https://api.heygen.com';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function germanHttpError(status,body=''){return new Error(`HeyGen-Verbindung fehlgeschlagen (${status}). ${body}`.trim())}
async function jsonRequest(url,{apiKey,method='GET',body,fetchImpl=global.fetch}={}){
  let res;
  try{res=await fetchImpl(url,{method,headers:{accept:'application/json','content-type':'application/json','X-Api-Key':apiKey},body:body?JSON.stringify(body):undefined})}
  catch(e){throw new Error('HeyGen ist derzeit nicht erreichbar. Bitte Internetverbindung prüfen.')}
  const text=await res.text?.(); let data={};
  try{data=text?JSON.parse(text):(await res.json())}catch{data={}}
  if(!res.ok || data?.error) throw germanHttpError(res.status||'API',data?.error?.message||data?.message||'');
  return data;
}
function validate({apiKey,avatarId,voiceId,text}){
  if(!String(apiKey||'').trim())throw new Error('HeyGen-API-Schlüssel fehlt. Bitte zuerst lokal speichern.');
  if(!String(avatarId||'').trim())throw new Error('HeyGen Avatar-ID fehlt. Bitte einen Testavatar auswählen oder eine Avatar-ID eintragen.');
  if(!String(voiceId||'').trim())throw new Error('HeyGen Voice-ID fehlt. Bitte eine Stimme auswählen oder eine Voice-ID eintragen.');
  if(!String(text||'').trim())throw new Error('Bitte einen kurzen Test-Sprechtext eingeben.');
}
async function generateAvatarVideo({apiKey,avatarId,voiceId,text,fetchImpl=global.fetch}){
  validate({apiKey,avatarId,voiceId,text});
  const data=await jsonRequest(`${BASE}/v2/video/generate`,{apiKey,method:'POST',fetchImpl,body:{video_inputs:[{character:{type:'avatar',avatar_id:avatarId,avatar_style:'normal'},voice:{type:'text',input_text:text,voice_id:voiceId},background:{type:'color',value:'#102432'}}],dimension:{width:1280,height:720}}});
  const videoId=data?.data?.video_id;
  if(!videoId)throw new Error('HeyGen hat keine Video-ID zurückgegeben.');
  return videoId;
}
async function pollVideoStatus({apiKey,videoId,fetchImpl=global.fetch,delay=sleep,onStatus=()=>{},maxAttempts=120}){
  for(let i=0;i<maxAttempts;i++){
    const data=await jsonRequest(`${BASE}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,{apiKey,fetchImpl});
    const d=data?.data||{}; const status=String(d.status||'').toLowerCase(); onStatus(status);
    if(status==='completed'){
      if(!d.video_url)throw new Error('HeyGen meldet „fertig“, liefert aber keine Video-Adresse.');
      return {status,videoUrl:d.video_url};
    }
    if(status==='failed')throw new Error('HeyGen konnte das Avatarvideo nicht erzeugen'+(d.error?': '+d.error:'.'));
    if(!['pending','waiting','processing'].includes(status))throw new Error('Unbekannter HeyGen-Status: '+(status||'leer'));
    await delay(3000);
  }
  throw new Error('HeyGen benötigt ungewöhnlich lange. Der Test wurde ohne Absturz beendet.');
}
async function listAvatars(apiKey,fetchImpl=global.fetch){if(!apiKey)throw new Error('HeyGen-API-Schlüssel fehlt.');const d=await jsonRequest(`${BASE}/v2/avatars`,{apiKey,fetchImpl});return d?.data?.avatars||[]}
async function listVoices(apiKey,fetchImpl=global.fetch){if(!apiKey)throw new Error('HeyGen-API-Schlüssel fehlt.');const d=await jsonRequest(`${BASE}/v2/voices`,{apiKey,fetchImpl});return d?.data?.voices||[]}
module.exports={generateAvatarVideo,pollVideoStatus,listAvatars,listVoices,validate};
