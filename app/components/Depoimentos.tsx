import { DEPOIMENTOS_TITLE, REVIEW_SOURCE, REVIEWS } from "../lib/constants";

export default function Depoimentos() {
  return (
    <section className="bg-brand/5 py-24 px-6 border-y border-brand/15">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-playfair text-4xl italic text-ink text-center mb-16">
          {DEPOIMENTOS_TITLE}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.author}
              className="bg-white p-8 border border-brand/20"
            >
              <p className="text-brand text-base mb-4">★★★★★</p>
              <p className="font-poppins text-[15px] italic text-ink leading-relaxed mb-6">
                &ldquo;{review.quote}&rdquo;
              </p>
              <p className="font-poppins text-[13px] uppercase tracking-widest text-brand">
                {review.author}
              </p>
              <p className="font-poppins text-[10px] text-gray-400 mt-1">
                {REVIEW_SOURCE}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
