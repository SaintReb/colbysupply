export async function onRequestPost({ request }) {
  // Cloudflare Pages Function placeholder for quote requests.
  // Next step: wire to an email provider (SendGrid/Postmark/Mailgun) via API key.
  // This endpoint returns 200 so the front-end can be tested immediately.
  try {
    await request.json();
  } catch (_) {}
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" }
  });
}
