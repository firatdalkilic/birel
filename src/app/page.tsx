import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-0 px-2 bg-[#FAFAFA]">
      <section className="w-full max-w-2xl mx-auto py-20 px-4 bg-white rounded-2xl shadow-md text-center">
        <h1 className="text-5xl font-bold text-[#1F2937] mb-4 font-sans tracking-wide">Senin yerine, bir el uzanır.</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-sans">Gündelik, karmaşık veya seni zorlayan görevler için artık yanındayız. Görev ver, sistem senin yerine halletsin.</p>
        {/* Placeholder SVG illustration */}
        <div className="flex justify-center mb-8">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="100" rx="40" ry="10" fill="#FFE066" />
            <path d="M60 90C70 80 90 80 90 60C90 40 70 40 60 60C50 40 30 40 30 60C30 80 50 80 60 90Z" fill="#FFC700" stroke="#FFCC00" strokeWidth="2" />
            <circle cx="60" cy="60" r="8" fill="#FFD700" />
          </svg>
        </div>
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
          <a
            href="/gorev-ver"
            className="w-full sm:w-auto min-h-[48px] bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200 text-lg cursor-pointer hover:scale-105 hover:shadow-lg"
          >
            Görev Ver
          </a>
          <a
            href="/gorevli-ol"
            className="w-full sm:w-auto min-h-[48px] border-2 border-yellow-400 text-yellow-500 font-medium py-2 px-6 rounded-xl hover:bg-yellow-100 transition duration-200 text-lg cursor-pointer hover:scale-105 hover:shadow-lg"
          >
            Görevli Ol
          </a>
        </div>
      </section>
    </main>
  );
}
