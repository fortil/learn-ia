import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { animate, motion, useInView } from 'framer-motion';
import { Zap, Type, BookOpen, PenLine } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

function CountUp({ to, format }: { to: number; format: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [text, setText] = useState(() => format(0));
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (v) => setText(format(v)),
    });
    return () => controls.stop();
  }, [inView, to, format]);
  return <span ref={ref}>{text}</span>;
}

const intFormat = (v: number) => String(Math.round(v));

export default function FactsStrip() {
  const { t } = useLanguage();
  const locale = t('common.locale');

  const facts = [
    {
      icon: Zap,
      rotate: -3,
      body: (
        <>
          {t('home.facts.f1Lead')}
          <strong className="text-coral-deep">
            {t('home.facts.f1StrongLead')}
            <CountUp to={1} format={intFormat} />
            {t('home.facts.f1StrongTail')}
          </strong>
          {t('home.facts.f1Tail')}
        </>
      ),
    },
    {
      icon: Type,
      rotate: 2.5,
      body: (
        <>
          {t('home.facts.f2Lead')}
          <strong className="text-coral-deep">
            <CountUp to={6} format={intFormat} />
            {t('home.facts.f2StrongTail')}
          </strong>
          {t('home.facts.f2Tail')}
        </>
      ),
    },
    {
      icon: BookOpen,
      rotate: -2,
      body: (
        <>
          {t('home.facts.f3Lead')}
          <strong className="text-coral-deep">
            <CountUp
              to={1000000}
              format={(v) => Math.round(v).toLocaleString(locale)}
            />
            {t('home.facts.f3StrongTail')}
          </strong>
          {t('home.facts.f3Tail')}
        </>
      ),
    },
  ];

  return (
    <section className="relative bg-ink py-20 md:py-24">
      {/* decorative dotted cream paths */}
      <svg viewBox="0 0 1200 40" className="absolute left-0 top-4 h-10 w-full" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 20 C 200 5, 400 35, 600 20 S 1000 5, 1200 20" stroke="#FFF6E9" strokeWidth={3.5} strokeLinecap="round" strokeDasharray="10 14" opacity={0.35} />
      </svg>
      <svg viewBox="0 0 1200 40" className="absolute bottom-4 left-0 h-10 w-full" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 20 C 200 35, 400 5, 600 20 S 1000 35, 1200 20" stroke="#FFF6E9" strokeWidth={3.5} strokeLinecap="round" strokeDasharray="10 14" opacity={0.35} />
      </svg>

      <motion.div
        className="mx-auto max-w-6xl px-4 md:px-6"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-30% 0px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2 className="mb-12 text-center font-display text-[clamp(1.8rem,4vw,2.75rem)] font-extrabold text-paper">
          {t('home.facts.title')}
        </h2>
        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {facts.map((f, i) => (
            <motion.div
              key={i}
              className="doodle-card flex flex-col items-center gap-3 px-6 py-7 text-center"
              style={{ rotate: f.rotate }}
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 300, damping: 18 }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-ink bg-sun shadow-doodle-sm">
                <f.icon className="h-6 w-6 text-ink" strokeWidth={2.5} />
              </span>
              <p className="text-[1.02rem] font-semibold leading-snug text-ink">{f.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <motion.div whileHover={{ scale: 1.03, rotate: -1 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-sun px-7 py-3.5 font-display text-lg font-extrabold text-ink shadow-[6px_6px_0_#FFF6E9] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#FFF6E9]"
            >
              <PenLine className="h-5 w-5" strokeWidth={2.75} />
              {t('home.facts.cta')}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
