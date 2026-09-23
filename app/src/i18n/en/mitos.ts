export default {
  hero: {
    sticker: 'The rumor clinic',
    // animated word by word: split(' ') in the component
    title: 'What people believe about AI',
    underlineWord: 'believe',
    subtitle:
      'Six ideas floating around out there. Dare to guess: myth or truth? Then flip the card and find out.',
  },
  score: {
    hits: 'Hits:',
    stamps: 'Stamps:',
  },
  wall: {
    sticker: 'The wall of myths',
    title: 'Dare to bet',
    subtitle: 'Read each claim, pick MYTH or TRUE… and let the flipping begin.',
  },
  card: {
    rumor: 'Rumor',
    letsSee: "Let's see…",
    betMito: 'MYTH',
    betVerdad: 'TRUE',
    betHint: 'Place your bet and find out',
    verdictMito: "It's a myth!",
    verdictVerdad: "It's true!",
    why: 'Why?',
    betCorrect: 'Your bet was right!',
    // reassembled as betWrongBefore + betMito/betVerdad + betWrongAfter
    betWrongBefore: 'You bet ',
    betWrongAfter: '… so close!',
  },
  myths: {
    m1: {
      statement: 'AI understands what you read and write, just like a person.',
      explanation: 'It spots statistical patterns between words, not meanings like you do.',
      analogy:
        "It's like a brilliant statistical parrot: it knows what usually comes after what, without knowing what it's talking about.",
      note: '',
    },
    m2: {
      statement: 'AI learns from your conversation and gets smarter while you chat.',
      explanation: 'During the chat it only does inference: it uses what it already learned.',
      analogy:
        'Real learning (training) happens separately, in data centers, and takes months.',
      note: '',
    },
    m3: {
      statement: 'AI looks things up on the internet and copies the answer from some website.',
      explanation:
        "A model isn't a search engine: it generates the answer word by word from its patterns.",
      analogy:
        "That's why it can get things wrong by making up data that 'sounds right' (the famous hallucinations).",
      note: '(almost always)',
    },
    m4: {
      statement: 'AI can be wrong with total confidence.',
      explanation: 'It always picks the most likely word, not the truest one. Likely ≠ correct.',
      analogy: 'Which is why you should always verify what matters.',
      note: '',
    },
    m5: {
      statement: 'Recognizing your face or recommending a movie is inference too.',
      explanation:
        "It's the same 5-stop journey: input → chunks → patterns → prediction → answer.",
      analogy: 'Only the type of data changes.',
      note: '',
    },
    m6: {
      statement: 'Inference is the expensive part: every answer burns millions.',
      explanation:
        'The really pricey part is training (done once). Each inference costs fractions of a cent… though with millions of users, the total bill adds up.',
      analogy: 'Like photocopies: the machine is expensive; each copy, dirt cheap.',
      note: '(nuanced)',
    },
  },
  golden: {
    sticker: 'The idea that takes the gold',
    heading: 'If you only remember one thing…',
    // word-by-word scroll reveal: split(' ') in the component
    phrase:
      "AI doesn't think: it predicts. It predicts so well, so fast, and with so many patterns, that it feels like magic.",
    // words struck through inside the phrase
    strikeA: "doesn't",
    strikeB: 'think:',
    // word highlighted with the marker inside the phrase
    highlight: 'predicts.',
    bubble: "And now that you know the trick… you're officially harder to impress.",
  },
  cta: {
    // reassembled as titleBefore + <count> titleOf <total> + titleAfter
    titleBefore: "You've debunked",
    titleOf: 'of',
    titleAfter: 'myths.',
    subtitlePending: 'There are still rumors to stamp up there… or jump straight to the final test.',
    subtitleDone: 'Wall complete: nothing gets past you now. Time for the final test.',
    button: 'Prove it in the quiz',
    map: 'Review the journey map',
  },
};
