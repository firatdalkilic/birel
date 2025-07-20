export default function Iletisim() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-gray-50">
      <section className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-auto text-center">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4 font-sans">İletişim</h2>
        <p className="text-gray-500 text-lg leading-relaxed mb-4">Sorularınız ve işbirliği için bize ulaşın:</p>
        <a href="mailto:destek@birel.com" className="text-yellow-500 underline font-semibold text-lg">destek@birel.com</a>
        <div className="mt-6 text-base text-gray-400">Instagram: <span className="font-medium text-gray-600">@birelapp</span></div>
      </section>
    </main>
  );
}