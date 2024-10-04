export default function handleRequest(
  request,
  response,
  allowedMethods,
  methodHandlers,
) {
  const { method } = request;

  if (!allowedMethods.includes(method)) {
    response.setHeader("Allow", allowedMethods);
    return response.status(405).end(`Method ${method} Not Allowed`);
  }

  const handler = methodHandlers[method];
  if (handler) {
    return handler(request, response);
  }

  return response.status(405).end(`No handler for ${method}`);
}
