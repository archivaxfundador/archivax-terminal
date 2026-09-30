const FOUNDER_KEY="FUNDADOR-LCIA-2026-ARCHIVAX-UNICO";
const PUBLIC_PATHS=["/","/index.html","/menu.html","/login.html","/api/login","/api/register","/api/guest","/api/me","/api/create-payment","/api/webhook"];
const MP_TOKEN_ENV="MP_ACCESS_TOKEN";
const PRECIOS={mensual:6999, anual:71389};
const DIAS={mensual:30, anual:365};

export default {
 async fetch(request, env){
  const url=new URL(request.url);
  const path=url.pathname;
  const fp=request.headers.get("x-fp") || url.searchParams.get("fp") || "";

  // 1. LLAVE FUNDADORA
  if(url.searchParams.get("key")===FOUNDER_KEY){
    const sess="sess_"+crypto.randomUUID();
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({type:"founder",email:"fundador",exp:Date.now()+1000*60*60*24*365}),{expirationTtl:31536000});
    let res=Response.redirect(url.origin+"/menu.html?premium=founder",302);
    res.headers.set("Set-Cookie",`archiviax_sess=${sess}; Path=/; Max-Age=31536000; SameSite=Lax`);
    return res;
  }

  // 2. API REGISTER
  if(path==="/api/register" && request.method==="POST"){
    const {email,pass,fp}=await request.json();
    if(!email||!pass) return json({ok:false,error:"Faltan datos"});
    const exists=await env.ARCHIVAX_USERS.get("user:"+email.toLowerCase());
    if(exists) return json({ok:false,error:"Email ya registrado"});
    await env.ARCHIVAX_USERS.put("user:"+email.toLowerCase(), JSON.stringify({pass,fp,created:Date.now()}));
    const sess="sess_"+crypto.randomUUID();
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({email:email.toLowerCase(),exp:Date.now()+1000*60*60*24*7}),{expirationTtl:604800});
    return json({ok:true},sess);
  }

  // 3. API LOGIN
  if(path==="/api/login" && request.method==="POST"){
    const {email,pass}=await request.json();
    const raw=await env.ARCHIVAX_USERS.get("user:"+email.toLowerCase());
    if(!raw) return json({ok:false,error:"No existe, registrate"});
    const u=JSON.parse(raw);
    if(u.pass!==pass) return json({ok:false,error:"Clave incorrecta"});
    const sess="sess_"+crypto.randomUUID();
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({email:email.toLowerCase(),exp:Date.now()+1000*60*60*24*7}),{expirationTtl:604800});
    return json({ok:true},sess);
  }

  // 4. API GUEST 10 MIN
  if(path==="/api/guest" && request.method==="POST"){
    const {fp}=await request.json();
    if(!fp) return json({ok:false,error:"Falta fp"});
    const key="guest:"+fp;
    const used=await env.ARCHIVAX_USERS.get(key);
    if(used) return json({ok:false,error:"Ya usaste tus 10 min. Registrate para seguir."});
    await env.ARCHIVAX_USERS.put(key,"used",{expirationTtl:60*60*24*30});
    const sess="sess_"+crypto.randomUUID();
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({type:"guest",exp:Date.now()+1000*60*10}),{expirationTtl:600});
    return json({ok:true},sess);
  }

  // 5. API ME
  if(path==="/api/me"){
    const cookie=request.headers.get("Cookie")||"";
    const m=cookie.match(/archiviax_sess=([^;]+)/);
    if(!m) return json({ok:false,type:"none"});
    const sd=await env.ARCHIVAX_USERS.get("sess:"+m[1]);
    if(!sd) return json({ok:false,type:"none"});
    const s=JSON.parse(sd);
    if(s.email){
      const prem=await env.ARCHIVAX_USERS.get("premium:"+s.email.toLowerCase());
      if(prem) s.premium=prem;
    }
    return new Response(JSON.stringify(s),{headers:{"Content-Type":"application/json"}});
  }

  // 6. API LOGOUT
  if(path==="/api/logout"){
    let r=json({ok:true});
    r.headers.set("Set-Cookie","archiviax_sess=; Path=/; Max-Age=0; SameSite=Lax");
    return r;
  }

  // 7. CREAR PAGO AUTOMATICO MENSUAL / ANUAL
  if(path==="/api/create-payment"){
    const cookie=request.headers.get("Cookie")||"";
    const m=cookie.match(/archiviax_sess=([^;]+)/);
    if(!m) return json({ok:false,error:"Debes registrarte para pagar premium"});
    const sd=await env.ARCHIVAX_USERS.get("sess:"+m[1]);
