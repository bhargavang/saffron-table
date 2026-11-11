import { whatsappLink } from "@/lib/site";

/** Floating "chat on WhatsApp" button, bottom right on every public page. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25d366] p-3.5 text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:bottom-6 sm:right-6 sm:pr-5"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M16.04 4C9.4 4 4.02 9.37 4.02 16c0 2.12.55 4.18 1.6 6L4 28l6.18-1.6a12 12 0 0 0 5.85 1.5h.01C22.66 27.9 28 22.53 28 15.9 28 12.7 26.76 9.7 24.5 7.46A11.9 11.9 0 0 0 16.04 4zm0 21.88h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.67.95.98-3.57-.24-.37a9.86 9.86 0 0 1-1.52-5.3c0-5.47 4.45-9.92 9.93-9.92a9.86 9.86 0 0 1 9.91 9.93c0 5.47-4.45 9.87-9.97 9.87zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}
