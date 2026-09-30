export async function onRequestPost(context){
  const { email } = await context.request.json();
  const res = await fetch("https://api.mercadopago.com/checkout/preferences",{
    method:"POST",
    headers:{
      "Authorization": `Bearer ${context.env.MP_ACCESS_TOKEN}`,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      items:[{title:"ARCHIVAX PREMIUM ILIMITADO", quantity:1, unit_price:2990, currency_id:"ARS"}],
      back_urls:{success:"https://archiviax.com.ar/success.html?email="+email, failure:"https://archiviax.com.ar/", pending:"https://archiviax.com.ar/"},
      auto_return:"approved",
      metadata:{email:email}
    })
  });
  const data = await res.json();
  return new Response(JSON.stringify({init_point:data.init_point}), {headers:{"Content-Type":"application/json"}});
}
