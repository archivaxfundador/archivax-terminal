export async function onRequestPost(context){
  const body = await context.request.json();
  if(body.type==="payment"){
    const id = body.data.id;
    const p = await fetch(`https://api.mercadopago.com/v1/payments/${id}`,{
      headers:{Authorization:`Bearer ${context.env.MP_ACCESS_TOKEN}`}
    }).then(r=>r.json());
    if(p.status==="approved"){
      const email = p.metadata.email;
      await context.env.ARCHIVAX_KV.put(`premium:${email}`, "true");
    }
  }
  return new Response("ok");
}
