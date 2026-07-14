"use client";

import { useState } from "react";

export function useHomeToggle(initial = false) {
  const [open, setOpen] = useState(initial);
  return { open, toggle: () => setOpen((value) => !value), setOpen };
}
