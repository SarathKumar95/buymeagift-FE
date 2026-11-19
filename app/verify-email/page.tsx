import VerificationResult from "./verification-result";

type VerificationPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerificationPageProps) {
  const { status } = await searchParams;
  return <VerificationResult confirmed={status === "confirmed"} />;
}
