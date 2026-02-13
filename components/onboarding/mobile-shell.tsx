"use client";

import { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  showStatusBar?: boolean;
  statusBarTime?: string;
}

export function MobileShell({
  children,
  showStatusBar = true,
  statusBarTime = "9:41",
}: MobileShellProps) {
  return (
    <div className="min-h-screen-safe bg-[var(--burg-deep)] flex flex-col">
      {/* iOS Status Bar */}
      {showStatusBar && (
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-sm font-semibold text-[var(--cream)]">
            {statusBarTime}
          </span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-sm bg-[var(--cream)]"
                  style={{ height: `${6 + i * 2}px` }}
                />
              ))}
            </div>
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="currentColor"
              className="text-[var(--cream)] ml-1"
            >
              <path d="M8 3.6c1.8 0 3.4.7 4.6 1.9l1.1-1.1C12.2 2.9 10.2 2 8 2s-4.2.9-5.7 2.4l1.1 1.1C4.6 4.3 6.2 3.6 8 3.6zM2 4.1l-1.1 1.1C2.5 3.6 5.1 2.5 8 2.5s5.5 1.1 7.1 2.7L14 4.1" />
            </svg>
            <div className="w-6 h-3 rounded-sm border border-[var(--cream)] relative ml-1">
              <div className="absolute inset-[1px] right-[2px] rounded-[1px] bg-[var(--cream)]" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
