import ContactForm from '@/components/ContactForm';

export default function Iletisim() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 bg-[#FAFAFA]">
      <ContactForm />
      
      {/* Sosyal Medya Linkleri */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-4 text-base">
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
      </div>
    </main>
  );
}