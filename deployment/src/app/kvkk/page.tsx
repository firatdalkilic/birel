export default function Kvkk() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-[#FAFAFA]">
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mx-auto">
        {/* KVKK Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-yellow-500 mb-4 font-sans tracking-wide text-center">KVKK Bilgilendirme</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında güvenle saklanır ve işlenir. 
          Detaylı bilgilendirme yakında burada yer alacaktır.
        </p>
      </section>
    </main>
  );
} 