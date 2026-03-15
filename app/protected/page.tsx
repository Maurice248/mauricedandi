import ProtectedClient from "./ProtectedClient";

type ProtectedPageProps = {
  searchParams: Promise<{ apiKey?: string }>;
};

export default async function ProtectedPage({ searchParams }: ProtectedPageProps) {
  const { apiKey } = await searchParams;
  const submittedKey = apiKey?.trim() || "";

  return <ProtectedClient submittedKey={submittedKey} />;
}
