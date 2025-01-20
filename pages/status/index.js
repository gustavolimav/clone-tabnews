import useSWR from "swr";

async function fetchStatus() {
  const response = await fetch("/api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("status", fetchStatus, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualizacao: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { data } = useSWR("status", fetchStatus, {
    refreshInterval: 2000,
  });

  const version = data?.dependencies?.database?.version || "Carregando...";
  const maxConnections =
    data?.dependencies?.database?.max_connections || "Carregando...";
  const openedConnections =
    data?.dependencies?.database?.opened_connections || "Carregando...";

  return (
    <>
      <h2>Banco de dados</h2>
      <div>Versão: {version}</div>
      <div>Conexões máximas: {maxConnections}</div>
      <div>Conexões abertas: {openedConnections}</div>
    </>
  );
}
