import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-background">
      <section className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-text mb-2">Senin yerine, bir el uzanır.</h1>
        <p className="text-lg md:text-xl text-text/80 mb-6">
          Gündelik, karmaşık veya seni zorlayan görevler için artık yanındayız. Görev ver, sistem senin yerine halletsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/gorev-ver"
            className="bg-primary hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition text-lg"
          >
            Görev Ver
          </a>
          <a
            href="/gorevli-ol"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-6 rounded-xl shadow-md transition text-lg"
          >
            Görevli Ol
          </a>
        </div>
      </section>
    </main>
  );
}
