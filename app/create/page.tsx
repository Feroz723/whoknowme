import { CreateQuizFlow } from "@/components/CreateQuizFlow";

export default function CreatePage() {
  return (
    <main className="flex-1 flex flex-col px-6 py-10 sm:py-16">
      <div className="max-w-md w-full mx-auto">
        <CreateQuizFlow />
      </div>
    </main>
  );
}
