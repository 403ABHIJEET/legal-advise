"use client";

import type { ButtonHTMLAttributes } from "react";

/** Submit button that asks for confirmation first. Use inside a <form action={serverAction}>. */
export function ConfirmButton({ message, ...props }: { message: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    />
  );
}
