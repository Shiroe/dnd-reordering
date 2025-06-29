import PageNavigation from "@/components/PageNavigation";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-stretch min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex justify-center items-center h-full flex-1">
        <PageNavigation></PageNavigation>
      </main>
    </div>
  );
}
