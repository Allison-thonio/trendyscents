import Link from 'next/link'
import { ArrowDown, ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { CartDrawer, DripMark, Footer, SiteNav } from '@/components/site-shell'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'
import { getCarouselSlides, ownerDetails, shopImage } from '@/lib/catalog'
import { OwnerShowcase } from '@/components/owner-showcase'
import { StoreLocationSection } from '@/components/store-location-section'
import { ShopGalleryShowcase } from '@/components/shop-gallery-showcase'
import { StickyScrollCarouselSection } from '@/components/sticky-scroll-carousel-section'
import { IntroAnimation } from '@/components/intro-animation'

export default function Page() {
  const slides = getCarouselSlides()

  return (
    <>
      <IntroAnimation />
      <SiteNav />
      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">A fragrance bar in Yenagoa</span>
            <h1>
              Fragrance,
              <br />
              <em>poured</em> to the
              <br />
              millilitre.
            </h1>
            <p className="section-intro font-medium" style={{ color: '#FFFFFF', opacity: 1, textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
              Your signature scent, decanted with care. Amber oils, honest advice, and a little room to find yourself.
            </p>
            <Link href="/shop" className="button button-amber">
              Explore the bar <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-foot">
            <p>Every bottle is filled by hand at our bar on Isaac Boro Expressway.</p>
            <span className="scroll-cue">
              Scroll to explore <ArrowDown size={15} />
            </span>
          </div>
        </section>

        <div className="marquee">
          <span>Wear what feels like you · 40+ oils · poured in Yenagoa · Wear what feels like you · 40+ oils · poured in Yenagoa · </span>
        </div>

        <section className="section">
          <div className="section-head">
            <div>
              <span className="eyebrow">The measure of a good scent</span>
              <h2>
                Small bottle.
                <br />
                Big presence.
              </h2>
            </div>
            <p className="section-intro">
              Not a department store. Not a guess. A considered way to discover fragrance, one millilitre at a time.
            </p>
          </div>
          <div className="stats">
            <div className="stat">
              <strong>40+</strong>
              <span>Oils on the bar</span>
            </div>
            <div className="stat">
              <strong>1ml</strong>
              <span>Accuracy, every pour</span>
            </div>
            <div className="stat">
              <strong>100%</strong>
              <span>Authentic fragrance</span>
            </div>
          </div>
        </section>

        <section id="bar" className="section section-dark">
          <div className="section-head">
            <div>
              <span className="eyebrow">The ritual</span>
              <h2>
                How the bar
                <br />
                works.
              </h2>
            </div>
          </div>
          <div className="steps">
            {[
              ['01', 'Choose your mood', 'Fresh, floral, woody, gourmand — start with a feeling.'],
              ['02', 'Smell something new', 'Our bar is a conversation, not a sales pitch.'],
              ['03', 'We pour it precisely', 'Your chosen fragrance, measured to the millilitre.'],
              ['04', 'Take it with you', 'A pocket-sized ritual, ready for wherever you go.'],
            ].map(([n, t, p]) => (
              <div className="step" key={n}>
                <b>{n}</b>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3D Coverflow Carousel Section (Scroll-Tied Horizontal Gallery) */}
        <StickyScrollCarouselSection />

        <section className="section py-16 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <ShopGalleryShowcase />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <span className="eyebrow">Made for the curious</span>
              <h2 className="text-3xl sm:text-4xl font-serif">
                Come for the scent.
                <br />
                <em className="text-amber-300 font-normal italic">Stay for the feeling.</em>
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed">
                There is something extraordinary about choosing a fragrance in person. The golden glow on custom glass dispensers. The pause between pours. The small certainty when you discover your scent signature.
              </p>
              <div className="pt-2">
                <Link href="/about" className="button button-amber inline-flex items-center gap-2">
                  Meet the full story <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <StoreLocationSection />

        <section className="section owner py-16">
          <div className="owner-layout grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-6xl mx-auto px-4">
            <div className="md:col-span-6 w-full">
              <OwnerShowcase />
            </div>
            <div className="owner-copy md:col-span-6 space-y-4">
              <DripMark />
              <span className="eyebrow">Behind the bar</span>
              <h2 className="text-3xl md:text-4xl font-serif">
                Meet the
                <br />
                owner.
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                {ownerDetails.bio}
              </p>
              <blockquote className="border-l-2 border-amber-500/60 pl-4 py-1 italic text-amber-200/90 text-sm">
                "{ownerDetails.quote}"
              </blockquote>
              <div className="pt-2">
                <Link href="/about" className="text-link inline-flex items-center gap-2">
                  Read the full story <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}

