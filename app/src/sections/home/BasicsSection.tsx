import { motion } from 'framer-motion';
import { BookOpen, HelpCircle, Lightbulb } from 'lucide-react';
import SectionHeading from '@/components/doodle/SectionHeading';
import DoodleArrow from '@/components/doodle/DoodleArrow';
import MythStamp from '@/components/doodle/MythStamp';
import SpeechBubble from '@/components/doodle/SpeechBubble';
import { useLanguage } from '@/i18n/useLanguage';

export default function BasicsSection() {
  const { t } = useLanguage();

  const cards = [
    {
      icon: BookOpen,
      iconBg: 'bg-peach',
      title: t('home.basics.card1Title'),
      text: t('home.basics.card1Text'),
      rotate: -2,
    },
    {
      icon: HelpCircle,
      iconBg: 'bg-mint',
      title: t('home.basics.card2Title'),
      text: t('home.basics.card2Text'),
      rotate: 1.5,
    },
    {
      icon: Lightbulb,
      iconBg: 'bg-sun',
      title: t('home.basics.card3Title'),
      text: t('home.basics.card3Text'),
      rotate: -1,
      stamp: true,
    },
  ];

  return (
    <section id="lo-basico" className="notebook-lines bg-paper-deep py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <SectionHeading
          sticker={t('home.basics.sticker')}
          stickerColor="mint"
          title={t('home.basics.title')}
          underlineWord={t('home.basics.underlineWord')}
          underlineColor="teal"
          subtitle={t('home.basics.subtitle')}
        />

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {cards.map((card, i) => (
            <div key={card.title} className="relative">
              <motion.div
                className="doodle-card doodle-card-hover relative flex h-full flex-col items-center gap-4 px-6 py-8 text-center"
                style={{ rotate: card.rotate }}
                initial={{ y: 50, opacity: 0, rotate: card.rotate * 2 }}
                whileInView={{ y: 0, opacity: 1, rotate: card.rotate }}
                viewport={{ once: true, margin: '-25% 0px' }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
              >
                <span className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink shadow-doodle-sm ${card.iconBg}`}>
                  <card.icon className="h-8 w-8 text-ink" strokeWidth={2.25} />
                </span>
                <h3 className="font-display text-2xl font-bold text-ink">{card.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-ink-soft">{card.text}</p>
                {card.stamp && (
                  <MythStamp variant="mito" rotate={-12} className="absolute -right-3 -top-4 bg-paper" delay={0.6}>
                    {t('home.basics.card3Stamp')}
                  </MythStamp>
                )}
              </motion.div>
              {i < cards.length - 1 && (
                <div className="absolute -right-8 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <DoodleArrow color="ink" bow={i % 2 === 0 ? 'down' : 'up'} delay={0.4 + i * 0.3} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <SpeechBubble mascot="preguntin" tail="bottom-left" delay={0.2}>
            {t('home.basics.bubbleBefore')}
            <strong>{t('home.basics.bubbleStrong')}</strong>
            {t('home.basics.bubbleAfter')}
          </SpeechBubble>
        </div>
      </div>
    </section>
  );
}
