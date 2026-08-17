import LogoDefs from './components/LogoDefs';
import Watermark from './components/Watermark';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Genius from './components/Genius/Genius';
import Proof from './components/sections/Proof';
import HowItWorks from './components/sections/HowItWorks';
import WhyUs from './components/sections/WhyUs';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import MarqueeRow from './components/polish/MarqueeRow';
import ScrollReveal from './components/polish/ScrollReveal';

// 5 representative industries (condensed from the original 12-pill list) + tail.
const INDUSTRIES = [
  'College Athletics',
  'Sports Management',
  'Event & Ticketing',
  'Real Estate',
  'Revenue Operations',
  'and more',
];

export default function App() {
  return (
    <>
      <LogoDefs />
      <Watermark />
      <Nav />

      <Hero>
        <Genius />
      </Hero>

      <ScrollReveal><Proof /></ScrollReveal>

      <ScrollReveal>
        <section style={{ padding: '3.5rem 0', background: 'var(--obsidian3)' }}>
          <MarqueeRow industries={INDUSTRIES} />
        </section>
      </ScrollReveal>

      <ScrollReveal><HowItWorks /></ScrollReveal>
      <ScrollReveal><WhyUs /></ScrollReveal>
      <ScrollReveal><Contact /></ScrollReveal>

      <Footer />
    </>
  );
}
