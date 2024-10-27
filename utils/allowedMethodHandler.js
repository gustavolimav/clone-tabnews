export default function handleRequest(
  request,
  response,
  allowedMethods,
  methodHandlers,
) {
  const { method } = request;

  response.setHeader("Access-Control-Allow-Methods", [allowedMethods]);

  if (!allowedMethods.includes(method)) {
    return response.status(405).end(`Method ${method} Not Allowed`);
  }

  const handler = methodHandlers[method];
  if (handler) {
    return handler(request, response);
  }

  return response.status(405).end(`No handler for ${method}`);
}
