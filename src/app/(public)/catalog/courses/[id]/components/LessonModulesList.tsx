"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/accordion";

export interface Lesson {
  title: string;
  desc: string; // исправлено на desc
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

interface ModulesAccordionProps {
  modules: Module[];
}

export default function LessonModules({ modules }: ModulesAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border border-[#2A2A2A] rounded-md bg-[#1a1a1a] p-5"
    >
      {modules.map((module, moduleIndex) => (
        <AccordionItem
          key={moduleIndex}
          value={`module-${moduleIndex}`}
          className="mb-3 px-4 border-b-[#2A2A2A]"
        >
          <AccordionTrigger className="text-white text-left text-xl py-4 font-medium">
            Модуль {moduleIndex + 1}
          </AccordionTrigger>

          <AccordionContent className="pb-4">
            <div className="flex flex-col gap-6 mt-2">
              {module.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="flex items-center pl-4 gap-4 border-l border-l-[#FF7A00]/15"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[#FF7A00]/15 text-[#FF7A00] rounded-full text-sm">
                    {lessonIndex + 1}
                  </div>

                  <div>
                    <p className="text-white text-lg font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {lesson.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
