function status(request, response) {
  response.status(200).json({ chave: "Página de Status" })
}

export default status;