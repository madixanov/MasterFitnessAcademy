"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ScrollHandler() {
  const params = useSearchParams();
  const scrollTo = params.get("scroll");

  useEffect(() => {
    if (!scrollTo) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [scrollTo]);

  return null;
}
