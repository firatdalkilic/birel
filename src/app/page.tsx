import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-0 px-2 bg-gray-50">
      <section className="w-full max-w-2xl mx-auto py-20 px-4 bg-gray-50 rounded-md shadow-sm text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 font-sans">Senin yerine, bir el uzanır.</h1>
        <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8 font-sans">
          Gündelik, karmaşık veya seni zorlayan görevler için artık yanındayız. Görev ver, sistem senin yerine halletsin.
        </p>
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
          <a
            href="/gorev-ver"
            className="w-full sm:w-auto min-h-[48px] bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200 text-lg"
          >
            Görev Ver
          </a>
          <a
            href="/gorevli-ol"
            className="w-full sm:w-auto min-h-[48px] border-2 border-yellow-400 text-yellow-500 font-medium py-2 px-6 rounded-xl hover:bg-yellow-100 transition duration-200 text-lg"
          >
            Görevli Ol
          </a>
        </div>
      </section>
    </main>
  );
}
