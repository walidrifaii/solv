"use client";

import { useState } from "react";

export function useDashboardPeriod(initial = "7d") {
  const [period, setPeriod] = useState(initial);
  return { period, setPeriod };
}
