export default {
  hero: {
    sticker: 'Consultorio de rumores',
    // animated word by word: split(' ') in the component
    title: 'Lo que la gente cree sobre la IA',
    underlineWord: 'cree',
    subtitle:
      'Seis ideas que circulan por ahí. Atrévete a adivinar: ¿mito o verdad? Luego gira la tarjeta y compruébalo.',
  },
  score: {
    hits: 'Aciertos:',
    stamps: 'Sellos:',
  },
  wall: {
    sticker: 'El muro de mitos',
    title: 'Atrévete a apostar',
    subtitle: 'Lee cada afirmación, elige MITO o VERDAD… y que empiece el volteo.',
  },
  card: {
    rumor: 'Rumor',
    letsSee: 'Veamos…',
    betMito: 'MITO',
    betVerdad: 'VERDAD',
    betHint: 'Apuesta y descubre',
    verdictMito: '¡Es un mito!',
    verdictVerdad: '¡Es verdad!',
    why: '¿Por qué?',
    betCorrect: '¡Acertaste tu apuesta!',
    // reassembled as betWrongBefore + betMito/betVerdad + betWrongAfter
    betWrongBefore: 'Apostaste ',
    betWrongAfter: '… ¡casi!',
  },
  myths: {
    m1: {
      statement: 'La IA entiende lo que lees y escribes, igual que una persona.',
      explanation: 'Reconoce patrones estadísticos entre palabras, no significados como tú.',
      analogy:
        'Es como un loro estadístico brillante: sabe qué suele ir detrás de qué, sin saber de qué habla.',
      note: '',
    },
    m2: {
      statement: 'La IA aprende de tu conversación y se hace más lista mientras charlas.',
      explanation: 'Durante el chat solo hace inferencia: usa lo que ya aprendió.',
      analogy:
        'Aprender de verdad (entrenamiento) ocurre aparte, en los centros de datos, y lleva meses.',
      note: '',
    },
    m3: {
      statement: 'La IA consulta internet y copia la respuesta de alguna web.',
      explanation:
        'Un modelo no es un buscador: genera la respuesta palabra a palabra desde sus patrones.',
      analogy:
        "Por eso puede equivocarse inventando datos que 'suenan bien' (las famosas alucinaciones).",
      note: '(casi siempre)',
    },
    m4: {
      statement: 'La IA puede equivocarse con total seguridad.',
      explanation:
        'Elige siempre la palabra más probable, no la más verdadera. Probable ≠ correcto.',
      analogy: 'Por eso hay que verificar lo importante.',
      note: '',
    },
    m5: {
      statement: 'Reconocer tu cara o recomendarte una peli también es inferencia.',
      explanation:
        'Es el mismo viaje de 5 paradas: entrada → trocitos → patrones → predicción → respuesta.',
      analogy: 'Solo cambia el tipo de datos.',
      note: '',
    },
    m6: {
      statement: 'La inferencia es lo que más cuesta: cada respuesta quema millones.',
      explanation:
        'Lo carísimo es el entrenamiento (una vez). Cada inferencia cuesta centavos de céntimo… aunque sumando millones de usuarios, la factura total crece.',
      analogy: 'Como las fotocopias: la máquina es cara; cada copia, baratísima.',
      note: '(matizado)',
    },
  },
  golden: {
    sticker: 'La idea que se lleva el oro',
    heading: 'Si solo recuerdas una cosa…',
    // word-by-word scroll reveal: split(' ') in the component
    phrase:
      'La IA no piensa: predice. Predice tan bien, tan rápido y con tantos patrones, que parece magia.',
    // words struck through inside the phrase
    strikeA: 'no',
    strikeB: 'piensa:',
    // word highlighted with the marker inside the phrase
    highlight: 'predice.',
    bubble:
      'Y ahora que sabes el truco… eres oficialmente más difícil de impresionar.',
  },
  cta: {
    // reassembled as titleBefore + <count> titleOf <total> + titleAfter
    titleBefore: 'Has desmontado',
    titleOf: 'de',
    titleAfter: 'mitos.',
    subtitlePending: 'Aún quedan rumores por estampar arriba… o salta directo a la prueba final.',
    subtitleDone: 'Muro completo: ya no te cuela ni una. Hora de la prueba final.',
    button: 'Demostrarlo en el quiz',
    map: 'Repasar el mapa del viaje',
  },
};
