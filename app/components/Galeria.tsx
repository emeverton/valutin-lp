import Image from "next/image";
import { GALERIA_HEADER, GALLERY_IMAGES } from "../lib/constants";

export default function Galeria() {
  const [large, ...stacked] = GALLERY_IMAGES;

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="font-poppins text-[11px] uppercase tracking-[0.2em] text-brand mb-2">
            {GALERIA_HEADER.label}
          </p>
          <h2 className="font-playfair text-4xl italic text-ink">
            {GALERIA_HEADER.title}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 relative aspect-[4/5] overflow-hidden">
            <Image
              src={large.src}
              alt={large.alt}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 px-4 py-3">
              <span className="font-poppins text-[11px] uppercase tracking-widest text-brand">
                {large.caption}
              </span>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-3">
            {stacked.map((img) => (
              <div key={img.src} className="flex-1 relative min-h-0 overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 px-3 py-2">
                  <span className="font-poppins text-[11px] uppercase tracking-widest text-brand">
                    {img.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
