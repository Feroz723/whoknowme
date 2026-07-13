import { TakeQuizFlow } from "@/components/TakeQuizFlow";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TakeQuizPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="flex-1 flex flex-col px-6 py-10 sm:py-16">
      <div className="max-w-md w-full mx-auto">
        <TakeQuizFlow slug={slug} />
      </div>
    </main>
  );
}
