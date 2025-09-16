export default function Gizlilik() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-[#FAFAFA]">
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mx-auto">
        {/* Privacy Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-yellow-500 mb-4 font-sans tracking-wide text-center">Gizlilik Politikası</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Bu sayfa, Bir El platformunun gizlilik politikası için ayrılmıştır. Kişisel verileriniz KVKK kapsamında korunur. 
          Detaylı bilgi yakında burada yer alacaktır.
        </p>
      </section>
    </main>
  );
} 