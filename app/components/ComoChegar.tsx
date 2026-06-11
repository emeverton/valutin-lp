import { ADDRESS, COMO_CHEGAR_COPY, MAPS_DIR_URL, MAPS_EMBED_SRC, WHATSAPP_URL } from "../lib/constants";

export default function ComoChegar() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="font-poppins text-[11px] uppercase tracking-[0.2em] text-brand mb-6">
            {COMO_CHEGAR_COPY.label}
          </p>
          <h2 className="font-playfair text-[32px] text-ink mb-6">Nossa Loja</h2>

          <div className="font-poppins text-sm text-ink/70 space-y-1 mb-8">
            <p>{ADDRESS.street}</p>
            <p>{ADDRESS.neighborhood}</p>
            <p className="pt-4 text-xs uppercase tracking-widest text-ink/40">Horários</p>
            <p>{ADDRESS.hoursWeekdays}</p>
            <p>{ADDRESS.hoursSaturday}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-white font-poppins text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.522 5.843L.057 23.143a.75.75 0 0 0 .928.908l5.406-1.435A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.715 9.715 0 0 1-4.96-1.36l-.356-.213-3.707.984.993-3.617-.232-.373A9.714 9.714 0 0 1 2.25 12C2.25 6.61 6.61 2.25 12 2.25S21.75 6.61 21.75 12 17.39 21.75 12 21.75z" />
              </svg>
              Falar no WhatsApp
            </a>

            <a
              href={MAPS_DIR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-brand text-brand font-poppins text-sm font-medium hover:bg-brand hover:text-white transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Como chegar
            </a>
          </div>
          <p className="mt-4 font-poppins text-[13px] text-gray-500">
            {COMO_CHEGAR_COPY.online}
          </p>
        </div>

        <div className="w-full h-72 md:h-80 overflow-hidden rounded-none shadow-md">
          <iframe
            title="Localização Valutin"
            src={MAPS_EMBED_SRC}
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
