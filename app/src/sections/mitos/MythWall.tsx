import { motion } from 'framer-motion';
import SectionHeading from '@/components/doodle/SectionHeading';
import { useLanguage } from '@/i18n/useLanguage';
import MythCard from './MythCard';
import { useMyths } from './mythsData';

interface MythWallProps {
  onResolved: (mythId: number, correct: boolean) => void;
}

/** The wall of myths: 6 three-state bet-and-flip cards. */
export default function MythWall({ onResolved }: MythWallProps) {
  const { t } = useLanguage();
  const myths = useMyths();
  return (
    <section className="notebook-dots bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          sticker={t('mitos.wall.sticker')}
          stickerColor="pink"
          title={t('mitos.wall.title')}
          subtitle={t('mitos.wall.subtitle')}
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {myths.map((myth, i) => (
            <motion.div
              key={myth.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.55, ease: 'easeOut' }}
            >
              <MythCard myth={myth} index={i} onResolved={onResolved} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
