"use client";

import { useEffect } from "react";
import { seedMockDataIfEmpty } from "@/features/persistence/lib/mock-data";

export function MockDataSeeder() {
  useEffect(() => {
    seedMockDataIfEmpty();
  }, []);

  return null;
}
