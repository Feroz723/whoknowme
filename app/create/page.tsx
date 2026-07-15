import Link from "next/link";
import { CreateQuizFlow } from "@/components/CreateQuizFlow";
import { MyQuizzes } from "@/components/MyQuizzes";

export default function CreatePage() {
  return (
    <>
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-[15px] font-bold text-text tracking-tight hover:opacity-80 transition-opacity">
            WhoKnowsMe
          </Link>
          <MyQuizzes />
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 py-10 sm:py-16">
        <div className="w-full mx-auto">
          <CreateQuizFlow />
        </div>
      </main>
    </>
  );
}
