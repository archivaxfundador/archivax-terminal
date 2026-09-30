const FOUNDER_KEY="FUNDADOR-LCIA-2026-ARCHIVAX-UNICO";
const PUBLIC_PATHS=["/","/index.html","/login.html","/api/login","/api/register","/api/guest","/api/me"];

export default {
 async fetch(request, env){
  const url=new URL(request.url);
  const path=url.pathname;
  const fp=request.headers.get("x-fp") || url.searchParams.get("fp") || "";

  // 1. LLAVE FUNDADORA
  if(url.searchParams.get("key")===FOUNDER_KEY){
    const sess="sess_"+crypto.randomUUID();
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({type:"founder",exp:Date.now()+1000*60*60*24*365}),{expirationTtl:31536000});
    let res=Response.redirect(url.origin+"/",302);
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
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({email,exp:Date.now()+1000*60*60*24*7}),{expirationTtl:604800});
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
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({email,exp:Date.now()+1000*60*60*24*7}),{expirationTtl:604800});
    return json({ok:true},sess);
  }

  // 4. API GUEST 10 MIN
  if(path==="/api/guest" && request.method==="POST"){
    const {fp}=await request.json();
    const key="guest:"+fp;
    const used=await env.ARCHIVAX_USERS.get(key);
    if(used) return json({ok:false,error:"Ya usaste tus 10 min. Registrate para seguir."});
    await env.ARCHIVAX_USERS.put(key,"used",{expirationTtl:60*60*24*30});
    const sess="sess_"+crypto.randomUUID();
    await env.ARCHIVAX_USERS.put("sess:"+sess, JSON.stringify({type:"guest",exp:Date.now()+1000*60*10}),{expirationTtl:600});
    return json({ok:true},sess);
  }

  // 5. PROTECCION RUTAS
  if(PUBLIC_PATHS.some(p=>path.startsWith(p)) || path.startsWith("/api/")){
    // deja pasar index y apis, pero si quiere camara revisa abajo
    if(path==="/"||path==="/index.html"||path.startsWith("/api/")) {
      if(path.startsWith("/api/")) {} // ya manejado
      else return env.ASSETS.fetch(request);
    }
  }

  const cookie=request.headers.get("Cookie")||"";
  const m=cookie.match(/archiviax_sess=([^;]+)/);
  if(!m) return Response.redirect("/index.html",302);
  const sessData=await env.ARCHIVAX_USERS.get("sess:"+m[1]);
  if(!sessData) return Response.redirect("/index.html",302);
  const s=JSON.parse(sessData);
  if(s.exp<Date.now()){
    await env.ARCHIVAX_USERS.delete("sess:"+m[1]);
    return Response.redirect("/index.html?expired=1",302);
  }

  return env.ASSETS.fetch(request);
 }
}

function json(obj,sess){
 let r=new Response(JSON.stringify(obj),{headers:{"Content-Type":"application/json"}});
 if(sess) r.headers.set("Set-Cookie",`archiviax_sess=${sess}; Path=/; Max-Age=604800; SameSite=Lax`);
 return r;
  }
