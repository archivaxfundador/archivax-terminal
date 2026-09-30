export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json().catch(() => ({}));
  const plan = body.plan || 'mensual';

  let price, title;

  if (plan === 'anual') {
    price = 71390;
    title = 'Archivax Terminal - Plan Anual (15% OFF)';
  } else {
    price = 6999;
    title = 'Archivax Terminal - Plan Mensual';
  }

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ title, quantity: 1, unit_price: price, currency_id: 'ARS' }],
      back_urls: {
        success: 'https://archiviax.com.ar/success.html',
        failure: 'https://archiviax.com.ar/',
        pending: 'https://archiviax.com.ar/'
      },
      auto_return: 'approved'
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify({ init_point: data.init_point, price, title }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
