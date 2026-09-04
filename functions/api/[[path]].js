export async function onRequest(context) {
  const url = new URL(context.request.url);

  const backendUrl =
    `${context.env.BACKEND_URL}${url.pathname}${url.search}`;

  const request = new Request(backendUrl, context.request);

  return fetch(request);
}