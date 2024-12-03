import { unstable_setRequestLocale } from 'next-intl/server';
import Intro from '@/components/Intro/Intro';
import HowCanBeUsed from '@/components/HowCanBeUsed/HowCanBeUsed';
import About from '@/components/About/About';
import Solution from '@/components/Solution/Solution';
import Mission from '@/components/Mission/Mission';
import Faq from '@/components/Faq/Faq';

export default function HomePage({ params: { lang } }: any) {
  unstable_setRequestLocale(lang);
  return (
    <main>
      <Intro />
      <HowCanBeUsed />
      <About />
      <Solution />
      <Mission />
      <Faq />
    </main>
  );
}
