export default function Iletisim() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-[#FAFAFA]">
      <section className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 mx-auto text-center">
        {/* Contact Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-yellow-500 mb-3 font-sans tracking-wide">İletişim</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">Sorularınız ve işbirliği için bize ulaşın:</p>
        
        <a 
          href="mailto:destek@birel.com" 
          className="text-yellow-500 text-xl font-semibold hover:text-yellow-600 hover:underline transition-all duration-200"
        >
          destek@birel.com
        </a>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-base">
          <span className="text-gray-400">Instagram:</span>
          <a 
            href="https://instagram.com/birelapp" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-medium text-gray-600 hover:text-yellow-500 hover:underline transition-all duration-200"
          >
            @birelapp
          </a>
        </div>

        <p className="mt-8 text-gray-500 text-sm">Destek ekibimiz en kısa sürede size dönüş yapacaktır.</p>
      </section>
    </main>
  );
}