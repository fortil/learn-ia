import Sticker from '@/components/doodle/Sticker';
import SpeechBubble from '@/components/doodle/SpeechBubble';

interface PageStubProps {
  title: string;
  sticker: string;
  stickerColor?: 'sun' | 'pink' | 'mint' | 'peach' | 'coral' | 'teal' | 'lilac';
}

/** Temporary placeholder for routes owned by the page agents. */
export default function PageStub({ title, sticker, stickerColor = 'sun' }: PageStubProps) {
  return (
    <section className="notebook-dots flex min-h-[60dvh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <Sticker color={stickerColor} rotate={-3} pop>
        {sticker}
      </Sticker>
      <h1 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.08] text-ink">
        {title}
      </h1>
      <SpeechBubble mascot="preguntin-pensando" tail="bottom-left">
        Esta parada aún se está dibujando. ¡Vuelve en un ratito!
      </SpeechBubble>
    </section>
  );
}
