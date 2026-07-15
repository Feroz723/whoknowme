"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";

interface SavedQuiz {
  slug: string;
  editUrl: string;
  creatorName: string;
  createdAt: string;
}

export function MyQuizzes() {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("whoknowsme_my_quizzes");
      if (saved) {
        setQuizzes(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read quizzes from localStorage:", e);
    }
  }, []);

  // Prevent hydration mismatches
  if (!mounted || quizzes.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[13px] font-semibold text-text-muted hover:text-text transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <span>My Quizzes</span>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/20 px-1 text-[11px] font-bold text-accent-soft">
          {quizzes.length}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div 
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-[17px] font-bold text-text">My Quizzes</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text text-[20px] leading-none transition-colors p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.slug}
                  className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-[14px] font-bold text-text truncate">
                        {quiz.creatorName}&apos;s Quiz
                      </h4>
                      <p className="text-[11px] text-text-muted">
                        Created: {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/q/${quiz.slug}`}
                      className="flex-1 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="secondary" className="w-full !min-h-[36px] py-1 text-[12.5px] rounded-lg">
                        Quiz Link
                      </Button>
                    </Link>
                    <Link
                      href={quiz.editUrl}
                      className="flex-1 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full !min-h-[36px] py-1 text-[12.5px] rounded-lg">
                        Manage / Results
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-border pt-4 flex justify-end">
              <Button
                variant="ghost"
                className="!min-h-[36px] py-1 text-[13px]"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
