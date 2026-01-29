import Sidebar from "@/components/layouts/Sidebar";
import Navbar from "@/components/layouts/Navbar";
import { fileTree } from "@/data/mockData";

export const metadata = {
  title: "CodeQuality",
  description: "Code complexity & heatmap",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-screen h-full flex flex-col">
      <div className="flex flex-row flex-1 overflow-hidden">
        <aside className="flex-shrink-0 h-full">
          <Sidebar fileTree={fileTree} />
        </aside>
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </section>
  );
}
