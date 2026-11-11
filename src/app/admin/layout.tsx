import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e9]">{children}</div>;
}
