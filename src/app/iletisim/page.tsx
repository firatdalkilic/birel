export default function Iletisim() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 bg-background">
      <section className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 md:p-10 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">İletişim</h2>
        <p className="text-text/80 mb-2">Sorularınız ve işbirliği için bize ulaşın:</p>
        <a href="mailto:destek@birel.com" className="text-primary underline font-semibold">destek@birel.com</a>
        <div className="mt-4 text-sm text-text/60">Instagram: <span className="font-medium">@birelapp</span></div>
      </section>
    </main>
  );
} 