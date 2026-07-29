"use client";

import { useTranslations } from "next-intl";
import { useState, type InputHTMLAttributes } from "react";
import { EyeOffIcon } from "@/components/icons/EyeOffIcon";
import { EyeOpenIcon } from "@/components/icons/EyeOpenIcon";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className = "", ...props }: PasswordInputProps) {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className} pe-11`.trim()}
      />
      <button
        type="button"
        onClick={() => setVisible((open) => !open)}
        className="absolute end-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-md p-1 text-[#8a7a6c] transition-colors hover:text-[#a5a196]"
        aria-label={visible ? t("hide") : t("show")}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOffIcon className="size-5" />
        ) : (
          <EyeOpenIcon className="size-5" />
        )}
      </button>
    </div>
  );
}
