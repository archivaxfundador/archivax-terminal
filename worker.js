const PROTEGIDAS = ["/camara", "/evp", "/ouija", "/llamada", "/psicofonia"];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";

    // --- TU ACCESO FUNDADOR UNICO ---
    if (url.searchParams.get("key") === "FUNDADOR-LCIA-2026-ARCHIVAX-UNICO") {
      const id = "FUNDADOR";
      await env.ARCHIVAX_USERS.put(`session:${id}`, JSON.stringify({
        type: "fundador", premium: true, ip, fingerprint: "fundador"
      }), {expirationTtl: 31536000});
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/index.html",
          "Set-Cookie": `archivax_session=${id}; Path=/; Max-Age=31536000; Secure; SameSite=Lax; HttpOnly`
        }
      });
    }

    // Verificar
