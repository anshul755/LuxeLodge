import { useEffect, useState } from "react";

export function Alert({ notice, onClose }) {
  const [isProgressing, setIsProgressing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsProgressing(false);
    setIsVisible(false);
    const frame = requestAnimationFrame(() => {
      setIsProgressing(true);
      setIsVisible(true);
    });
    const timer = setTimeout(onClose, 3500);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [notice, onClose]);

  const type = notice?.type || "success";
  const message = notice?.message || notice;
  const isError = type === "error";
  const tone = isError
    ? {
        border: "border-l-red-500",
        icon: "bg-red-500 text-white shadow-red-200",
        title: "text-red-700",
        progress: "bg-red-500",
      }
    : {
        border: "border-l-emerald-500",
        icon: "bg-emerald-500 text-white shadow-emerald-200",
        title: "text-emerald-700",
        progress: "bg-emerald-500",
      };

  return (
    <div
      className={`fixed right-4 top-24 z-50 flex min-h-[76px] w-[min(390px,calc(100vw-32px))] items-center gap-3 overflow-hidden rounded-lg border border-neutral-200 border-l-4 ${tone.border} bg-white px-4 py-3 pr-11 text-neutral-900 shadow-2xl shadow-black/20 transition duration-300 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
      role="alert"
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone.icon} shadow-lg`}
        aria-hidden="true"
      >
        {isError ? (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 6l8 8M14 6l-8 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 10.5l3.2 3.2L15.5 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <div className="grid flex-1 gap-0.5">
        <strong className={`text-sm font-extrabold leading-tight ${tone.title}`}>
          {isError ? "Error" : "Success"}
        </strong>
        <span className="text-sm font-semibold leading-snug text-neutral-600">{message}</span>
      </div>
      <button
        className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md border-0 bg-transparent text-lg font-black leading-none text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
        aria-label="Close message"
        onClick={onClose}
      >
        x
      </button>
      <span
        className={`absolute bottom-0 left-0 h-1 ${tone.progress} transition-[width] duration-[3500ms] ease-linear ${
          isProgressing ? "w-0" : "w-full"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
