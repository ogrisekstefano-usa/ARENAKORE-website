import { ROUTES } from '../config/routes';
// All SEO page data and blog content for ArenaKore

export const LOGO = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/vefp23lc_ArenaKore-logo-dark-bg.png';
export const HERO_BG = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png';

// Unsplash fitness images
export const IMGS = {
  crossfit: 'https://images.unsplash.com/photo-1709315957145-a4bad1feef28?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400',
  competition: 'https://images.pexels.com/photos/16966336/pexels-photo-16966336.jpeg?auto=compress&cs=tinysrgb&w=1400',
  teamTraining: 'https://images.unsplash.com/photo-1649789248266-ef1c7f744f6f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400',
  barbell: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400',
  pullup: 'https://images.unsplash.com/photo-1656774950529-44a6153521ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400',
};

export const NAV_LINKS = [
  { label: 'App', href: ROUTES.fitnessApp },
  { label: 'CrossFit', href: ROUTES.crossfit },
  { label: 'Competizione', href: ROUTES.competition },
  { label: 'AMRAP', href: ROUTES.amrap },
  { label: 'Palestre', href: ROUTES.gyms },
  { label: 'Blog', href: '/blog' },
  { label: 'Support', href: '/support' },
];

export const PAGES = {
  fitnessApp: {
    slug: ROUTES.fitnessApp,
    seo_title: 'Fitness Challenge App | ArenaKore',
    meta_description: 'The fitness challenge app that validates every rep. Track performance, compete globally, prove your strength. Download ArenaKore — free.',
    h1: 'THE FITNESS CHALLENGE APP BUILT FOR REAL ATHLETES',
    badge: 'FITNESS CHALLENGE APP',
    heroImage: IMGS.barbell,
    intro: {
      heading: 'Not just an app. A validation engine.',
      body: 'Every fitness app lets you log a workout. ArenaKore is the only one that tells you if it actually counts. Using NEXUS bio-analysis, every rep is tracked, validated and recorded — permanently. You cannot cheat the system. That\'s the point.',
    },
    problem: {
      heading: 'The problem with every other fitness app.',
      points: [
        'You track workouts, but nobody validates them.',
        'Progress feels invisible — no real benchmark.',
        'Zero accountability. Zero competition.',
        'You quit after 3 months because nothing is at stake.',
      ],
    },
    solution: {
      heading: 'ArenaKore changes what\'s at stake.',
      body: 'When your reps are validated in real-time by an AI bio-analysis engine, everything changes. Suddenly, every session has a score. Every score has a rank. Every rank has a challenger. Welcome to the Arena.',
    },
    howItWorks: [
      { step: '01', title: 'Download the app', desc: 'Create your KORE ID — your permanent athletic identity.' },
      { step: '02', title: 'Pick a challenge', desc: 'Choose from 15+ disciplines. Set your target reps or time.' },
      { step: '03', title: 'NEXUS validates', desc: 'Bio-analysis tracks every movement. Bad form = no rep.' },
      { step: '04', title: 'Get ranked', desc: 'Your K-Rating updates live. Challenge others. Defend your rank.' },
    ],
    benefits: [
      { icon: '⚡', title: 'Real-time validation', desc: 'NEXUS bio-engine validates every single rep. No exceptions.' },
      { icon: '🏆', title: 'Global leaderboards', desc: 'K-Rating ranks you against athletes worldwide.' },
      { icon: '🔥', title: '15+ disciplines', desc: 'CrossFit, AMRAP, strength, sprint — all in one platform.' },
      { icon: '📊', title: 'DNA score', desc: 'Your unique athletic profile across 6 performance attributes.' },
      { icon: '⚔️', title: '1v1 challenges', desc: 'Challenge any athlete directly. The system decides who wins.' },
      { icon: '🛡', title: 'Permanent record', desc: 'Your history never disappears. Every PR is certified.' },
    ],
    faq: [
      { q: 'Is ArenaKore free?', a: 'Yes. The base ArenaKore app is free to download and use. Advanced features are available in premium plans.' },
      { q: 'What disciplines does ArenaKore support?', a: 'ArenaKore supports 15+ disciplines including CrossFit WODs, AMRAP, EMOM, strength lifts, sprint, and more.' },
      { q: 'How does NEXUS validate reps?', a: 'NEXUS uses Puppet Motion Detection — an AI bio-analysis system that tracks joint angles and movement quality in real-time.' },
      { q: 'Can I challenge athletes from other gyms?', a: 'Yes. Challenges can be sent to any user globally, or to specific gyms through the Hub Map.' },
    ],
    keywords: ['fitness challenge app', 'workout challenge app', 'fitness competition app', 'rep tracking app', 'athletic performance app'],
    relatedPages: [
      { label: 'CrossFit Challenge', href: ROUTES.crossfit },
      { label: 'AMRAP Training', href: ROUTES.amrap },
      { label: 'Fitness Gamification', href: ROUTES.gamification },
    ],
  },

  crossfit: {
    slug: ROUTES.crossfit,
    seo_title: 'CrossFit Challenge App | Box vs Box | ArenaKore',
    meta_description: 'Box vs box CrossFit challenges validated by AI. Track WODs, rank athletes in real-time, compete globally. ArenaKore is built for your box.',
    h1: 'BOX VS BOX. NO EXCUSES.',
    badge: 'CROSSFIT CHALLENGE',
    heroImage: IMGS.crossfit,
    intro: {
      heading: 'Your box. Their box. One winner.',
      body: 'ArenaKore transforms CrossFit from individual effort to inter-box competition. Coaches set the WOD. Athletes perform. NEXUS validates every rep. The leaderboard shows who actually did the work.',
    },
    problem: {
      heading: 'CrossFit deserves better than spreadsheets.',
      points: [
        'Athletes self-report results — impossible to verify.',
        'Inter-box competition requires manual coordination.',
        'No real-time leaderboard during a WOD.',
        'Results are forgotten the next week.',
      ],
    },
    solution: {
      heading: 'Built for the intensity of CrossFit.',
      body: 'NEXUS tracks every squat, every pull-up, every kettlebell swing — validating in real-time. Coaches can run synchronized box challenges across multiple locations. The best box wins. No excuses.',
    },
    howItWorks: [
      { step: '01', title: 'Set up your Box', desc: 'Register your CrossFit box as an official ArenaKore Hub.' },
      { step: '02', title: 'Program the WOD', desc: 'Create the challenge using our coach templates.' },
      { step: '03', title: 'Athletes compete', desc: 'NEXUS validates every rep. No cheating. No self-reporting.' },
      { step: '04', title: 'Live leaderboard', desc: 'Rankings update in real-time. Box vs box, athlete vs athlete.' },
    ],
    benefits: [
      { icon: '🥊', title: 'Box vs Box', desc: 'Run synchronized challenges across multiple boxes simultaneously.' },
      { icon: '✅', title: 'Rep validation', desc: 'NEXUS ensures every rep meets standard. Coaches can set depth requirements.' },
      { icon: '📍', title: 'Hub Map', desc: 'Your box is visible to all ArenaKore athletes in the area.' },
      { icon: '🏆', title: 'Box rankings', desc: 'Permanent leaderboards show which box performs best over time.' },
      { icon: '📋', title: 'Coach templates', desc: '50+ pre-built WOD templates. Customize difficulty and rules.' },
      { icon: '📱', title: 'Live tracking', desc: 'Real-time dashboards show every athlete\'s score as they compete.' },
    ],
    faq: [
      { q: 'Do my athletes need individual accounts?', a: 'Yes. Each athlete creates a free KORE ID. Box managers get an admin dashboard.' },
      { q: 'Can I run inter-box competitions?', a: 'Yes. Box vs Box challenges allow synchronized WODs across multiple locations with live rankings.' },
      { q: 'Does NEXUS work with all CrossFit movements?', a: 'NEXUS currently validates 40+ standard CrossFit movements. New movements are added regularly.' },
      { q: 'Is there a cost for boxes?', a: 'Boxes get a 14-day free pilot. After that, Business plans start at a flat monthly rate.' },
    ],
    keywords: ['crossfit challenge app', 'box vs box competition', 'crossfit tracking app', 'wod competition app', 'crossfit box software'],
    relatedPages: [
      { label: 'For Gyms', href: ROUTES.gyms },
      { label: 'Workout Competition', href: ROUTES.competition },
      { label: 'AMRAP Training', href: ROUTES.amrap },
    ],
  },

  workout: {
    slug: ROUTES.competition,
    seo_title: 'Workout Competition Platform | ArenaKore',
    meta_description: 'Compete in real workout competitions. Validated rankings, certified performances, global leaderboards. The platform for athletes who train to win.',
    h1: 'TRAIN TO WIN. COMPETE TO PROVE IT.',
    badge: 'WORKOUT COMPETITION',
    heroImage: IMGS.competition,
    intro: {
      heading: 'Training without competition is just exercise.',
      body: 'ArenaKore converts every training session into a competitive event. Your performance is measured, validated and ranked against real athletes globally. Not likes. Not followers. Rankings based on verified results.',
    },
    problem: {
      heading: 'Why competitive athletes leave mainstream apps.',
      points: [
        'No real competition — just personal best logs.',
        'Rankings are self-reported and unverifiable.',
        'No consequence for poor performance.',
        'Your achievements disappear in an endless feed.',
      ],
    },
    solution: {
      heading: 'The arena where performance is everything.',
      body: 'In ArenaKore, you earn your rank. NEXUS validates every movement. K-Rating tracks your score from 0 to 1000. Every challenge updates your permanent record. Athletes are ranked globally and locally. There is nowhere to hide.',
    },
    howItWorks: [
      { step: '01', title: 'Build your KORE ID', desc: 'Your permanent athletic identity. Stats, history, challenges.' },
      { step: '02', title: 'Enter competition', desc: 'Join open challenges or create a direct 1v1 match.' },
      { step: '03', title: 'Perform and prove', desc: 'NEXUS validates your reps in real-time. Every movement counts.' },
      { step: '04', title: 'Climb the ranks', desc: 'K-Rating updates after every competition. Defend your position.' },
    ],
    benefits: [
      { icon: '📈', title: 'K-Rating system', desc: '0–1000 performance score updated after every validated competition.' },
      { icon: '⚔️', title: 'Direct 1v1', desc: 'Challenge specific athletes. The result is permanent and public.' },
      { icon: '🌍', title: 'Global ranking', desc: 'Compare your K-Rating against athletes worldwide in your discipline.' },
      { icon: '🔒', title: 'Certified results', desc: 'All results are NEXUS-validated. No self-reporting. No cheating.' },
      { icon: '🧬', title: 'DNA profile', desc: 'VEL, FOR, RES, AGI, TEC, POT — your complete athletic profile.' },
      { icon: '🔴', title: 'Live competitions', desc: 'Real-time events where athletes compete simultaneously.' },
    ],
    faq: [
      { q: 'What is K-Rating?', a: 'K-Rating is your competitive performance score, ranging from 0 to 1000. It updates after every validated competition based on performance and opponents.' },
      { q: 'How do I challenge another athlete?', a: 'Find any athlete via their KORE ID, select a discipline, set the rep target and issue the challenge. They accept, you both perform, NEXUS decides.' },
      { q: 'Are competitions monitored in real-time?', a: 'Yes. NEXUS Puppet Motion Detection validates all movements as you perform. There is no post-submission review — the verdict is live.' },
      { q: 'What happens if I lose a challenge?', a: 'Your K-Rating adjusts. Losses are part of your permanent record. Accept, learn, and come back stronger.' },
    ],
    keywords: ['workout competition app', 'fitness competition platform', 'athletic ranking system', 'workout challenge ranking', 'competitive fitness app'],
    relatedPages: [
      { label: 'Fitness Challenge App', href: ROUTES.fitnessApp },
      { label: 'CrossFit Challenge', href: ROUTES.crossfit },
      { label: 'Fitness Gamification', href: ROUTES.gamification },
    ],
  },

  amrap: {
    slug: ROUTES.amrap,
    seo_title: 'AMRAP Training Tracker & Competition | ArenaKore',
    meta_description: 'Track AMRAP workouts with AI rep validation. Compete against athletes, improve every session, see your real AMRAP score. Download ArenaKore free.',
    h1: 'AS MANY REPS AS POSSIBLE. WE\'RE COUNTING.',
    badge: 'AMRAP TRAINING',
    heroImage: IMGS.pullup,
    intro: {
      heading: 'AMRAP is simple. Executing it correctly is not.',
      body: 'As Many Reps As Possible. Three words that define one of the most brutal formats in competitive fitness. ArenaKore\'s NEXUS engine tracks every rep in your AMRAP, validates form in real-time, and gives you a score you can actually compare against other athletes.',
    },
    problem: {
      heading: 'The AMRAP problem nobody talks about.',
      points: [
        'You count your own reps — accuracy varies.',
        'Bad form reps count the same as good ones.',
        'No way to compare results between athletes fairly.',
        'Progress is invisible without validated benchmarks.',
      ],
    },
    solution: {
      heading: 'AMRAP the way it was designed to be done.',
      body: 'NEXUS uses bio-analysis to track every movement during your AMRAP. Partial reps don\'t count. Bad form doesn\'t count. Only full, clean reps are scored. Your final score is certified, comparable and permanent. Now you know your real number.',
    },
    howItWorks: [
      { step: '01', title: 'Set your AMRAP', desc: 'Choose movement, time cap, and difficulty level.' },
      { step: '02', title: 'Execute', desc: 'NEXUS tracks every rep via Puppet Motion Detection.' },
      { step: '03', title: 'Get your score', desc: 'Only validated reps count. No partial credit.' },
      { step: '04', title: 'Compare and compete', desc: 'Your AMRAP score is ranked against athletes in your category.' },
    ],
    benefits: [
      { icon: '⏱', title: 'Time-cap precision', desc: 'NEXUS tracks your exact rep count at the moment time expires.' },
      { icon: '✅', title: 'Form validation', desc: 'Every rep validated in real-time. Partial reps flagged automatically.' },
      { icon: '📊', title: 'Progress tracking', desc: 'See your AMRAP improvement week-over-week with certified data.' },
      { icon: '🏆', title: 'AMRAP leaderboards', desc: 'Compare your score against athletes in your discipline globally.' },
      { icon: '🔁', title: 'Movement library', desc: 'Squats, pull-ups, thrusters, burpees and 40+ validated movements.' },
      { icon: '🧠', title: 'Training insights', desc: 'K-Timeline shows your 7-day consistency and peak performance windows.' },
    ],
    faq: [
      { q: 'What AMRAP movements does ArenaKore support?', a: 'ArenaKore supports 40+ CrossFit and AMRAP movements including thrusters, pull-ups, box jumps, burpees, double-unders, and more.' },
      { q: 'What is the difference between AMRAP and EMOM?', a: 'AMRAP is "As Many Reps As Possible" within a time cap. EMOM is "Every Minute On the Minute" — you complete a task each minute. Both are tracked in ArenaKore.' },
      { q: 'Can I use ArenaKore for AMRAP team competitions?', a: 'Yes. Team AMRAP challenges allow groups to accumulate combined rep counts, with each team member\'s reps validated individually.' },
      { q: 'Is NEXUS accurate enough for competition-level AMRAP?', a: 'NEXUS is calibrated for competition-level validation. It uses joint angle tracking and movement timing to apply the same standards as CrossFit judges.' },
    ],
    keywords: ['amrap training app', 'amrap tracking', 'amrap workout competition', 'amrap rep counter', 'crossfit amrap timer'],
    relatedPages: [
      { label: 'CrossFit Challenge', href: ROUTES.crossfit },
      { label: 'Workout Competition', href: ROUTES.competition },
      { label: 'Fitness Challenge App', href: ROUTES.fitnessApp },
    ],
  },

  gamification: {
    slug: ROUTES.gamification,
    seo_title: 'Fitness Gamification Platform | +40% Retention | ArenaKore',
    meta_description: '+30% engagement. +40% retention. Gamify fitness with challenges, rankings, rewards. ArenaKore uses real behavioral science to keep athletes training.',
    h1: 'GAMIFY FITNESS. DOMINATE RETENTION.',
    badge: 'FITNESS GAMIFICATION',
    heroImage: IMGS.teamTraining,
    intro: {
      heading: 'Gamification is not a gimmick. It\'s behavioral science.',
      body: 'The reason most fitness apps fail isn\'t the features — it\'s the psychology. People stop when there\'s no consequence. ArenaKore applies proven gamification mechanics to fitness: rankings, challenges, streaks, validated progress, and public results. The data proves it works.',
    },
    problem: {
      heading: 'Why 80% of gym members quit within 6 months.',
      points: [
        'No external accountability — only self-motivation.',
        'Progress feels invisible after the initial phase.',
        'No social comparison or competitive element.',
        'Milestones are arbitrary and easy to ignore.',
      ],
    },
    solution: {
      heading: 'The gamification system that actually changes behavior.',
      body: 'ArenaKore\'s NEXUS engine creates real stakes. Your K-Rating is public. Your challenges are permanent. Your DNA score evolves. Every training decision has a visible, measurable consequence. That is why ArenaKore drives +30% engagement and +40% retention versus standard fitness apps.',
    },
    howItWorks: [
      { step: '01', title: 'Points and ranking', desc: 'K-Flux rewards every validated rep. K-Rating ranks you competitively.' },
      { step: '02', title: 'Streaks and timelines', desc: 'K-Timeline tracks 7-day consistency. Streaks matter. Gaps are visible.' },
      { step: '03', title: 'Challenges and rewards', desc: 'Complete challenges to unlock K-Flux bonuses and DNA evolution.' },
      { step: '04', title: 'Social competition', desc: 'KORE Network shows your rank in your gym and globally. Peers see your score.' },
    ],
    benefits: [
      { icon: '📈', title: '+30% engagement', desc: 'Athletes with gamified milestones train 30% more sessions per month on average.' },
      { icon: '🔁', title: '+40% retention', desc: 'Gyms using ArenaKore report 40% higher 6-month retention vs. non-gamified programs.' },
      { icon: '🎯', title: 'Real stakes', desc: 'Rankings, streaks and DNA scores create meaningful, self-reinforcing motivation.' },
      { icon: '🧠', title: 'Behavioral loops', desc: 'Variable reward schedules (challenges, ranks) are scientifically proven to drive habit formation.' },
      { icon: '👥', title: 'Social proof', desc: 'Public rankings trigger social comparison — the most powerful motivational trigger in fitness.' },
      { icon: '🔓', title: 'Progression system', desc: 'DNA evolution, rank upgrades and K-Flux rewards create clear progression paths.' },
    ],
    faq: [
      { q: 'What is K-Flux?', a: 'K-Flux is ArenaKore\'s performance currency. Earned by completing validated challenges, it unlocks progression milestones and tracks your competitive output.' },
      { q: 'How does the streak system work?', a: 'K-Timeline shows your training consistency over 7 days. Consecutive training days build streaks. Breaking a streak is visible to your KORE Network.' },
      { q: 'Is the +40% retention figure verified?', a: 'These figures are based on early platform data and behavioral studies on gamification in fitness contexts. Results vary by implementation.' },
      { q: 'Can gyms customize the gamification elements?', a: 'Yes. Through Arena Business, gyms can set custom challenges, reward tiers, and competition brackets tailored to their member base.' },
    ],
    keywords: ['fitness gamification', 'gamification gym app', 'fitness app retention', 'workout gamification platform', 'gym engagement software'],
    relatedPages: [
      { label: 'For Gyms', href: ROUTES.gyms },
      { label: 'Fitness Challenge App', href: ROUTES.fitnessApp },
      { label: 'Workout Competition', href: ROUTES.competition },
    ],
  },

  gyms: {
    slug: ROUTES.gyms,
    seo_title: 'Fitness App for Gyms & CrossFit Boxes | ArenaKore',
    meta_description: '+40% member retention. Run challenges, track performance, build gym community. 14-day free pilot for gyms and CrossFit boxes. Start today.',
    h1: 'YOUR GYM. YOUR ARENA.',
    badge: 'FOR GYMS & BOXES',
    heroImage: IMGS.gym,
    intro: {
      heading: 'Your gym has great equipment. Now give it great competition.',
      body: 'Member retention is the biggest challenge in the fitness industry. ArenaKore gives your gym the tool it needs: a live competition layer that turns every training session into a ranked event. More engagement. More retention. More revenue.',
    },
    problem: {
      heading: 'The retention problem every gym owner knows.',
      points: [
        '80% of new members quit within 6 months.',
        'Members train alone with no community accountability.',
        'Your gym has no competitive differentiator.',
        'Leaderboards and challenges require manual management.',
      ],
    },
    solution: {
      heading: 'ArenaKore turns your gym into a competitive destination.',
      body: 'With Arena Business, you get a complete gym competition platform. Set challenges, track your members\' performance, run box vs box events, and access analytics that show you who is training hard and who is at risk of leaving. All automated.',
    },
    howItWorks: [
      { step: '01', title: 'Register your Hub', desc: 'Create your official gym profile. Members join your Hub.' },
      { step: '02', title: 'Set your challenges', desc: 'Use coach templates or create custom challenges for your members.' },
      { step: '03', title: 'Members compete', desc: 'NEXUS validates performance. Live leaderboards display results.' },
      { step: '04', title: 'Analytics and growth', desc: 'Monitor retention, engagement and performance data from your dashboard.' },
    ],
    benefits: [
      { icon: '📈', title: '+40% retention', desc: 'Gyms using ArenaKore report significantly higher 6-month member retention.' },
      { icon: '🏟', title: 'Hub profile', desc: 'Your gym appears on the ArenaKore Mappa Hub — visible to nearby athletes searching for training venues.' },
      { icon: '📋', title: 'Coach dashboard', desc: 'Create, manage and track all member challenges from a single admin panel.' },
      { icon: '🏆', title: 'Gym leaderboards', desc: 'Internal and external rankings drive competition between members and rival gyms.' },
      { icon: '📊', title: 'Analytics', desc: 'Track who is training, who is at churn risk, and which challenges drive the most engagement.' },
      { icon: '🆓', title: '14-day free pilot', desc: 'Start your Arena Business pilot for free. No credit card required. Full features unlocked.' },
    ],
    faq: [
      { q: 'Is the 14-day pilot truly free?', a: 'Yes. Full Arena Business access for 14 days at no cost. No credit card required. Cancel anytime.' },
      { q: 'How many members can use ArenaKore at my gym?', a: 'No member limit. Plans are priced per gym, not per user.' },
      { q: 'Can I brand challenges with my gym\'s name?', a: 'Yes. All challenges can be branded with your gym\'s name and logo on the leaderboard and member-facing screens.' },
      { q: 'Does ArenaKore integrate with gym management software?', a: 'API integration is in development. Contact us for current integration options.' },
    ],
    keywords: ['gym app for retention', 'crossfit box app', 'gym gamification software', 'member retention app', 'fitness club challenge platform'],
    relatedPages: [
      { label: 'CrossFit Challenge', href: ROUTES.crossfit },
      { label: 'Fitness Gamification', href: ROUTES.gamification },
      { label: 'Workout Competition', href: ROUTES.competition },
    ],
  },
};

// ─── MULTILINGUAL PAGE TRANSLATIONS ─────────────────────────────────────────
const PAGE_TRANSLATIONS = {
  [ROUTES.fitnessApp]: {
    it: {
      h1: "L'APP FITNESS CHALLENGE PER ATLETI VERI",
      badge: 'APP FITNESS CHALLENGE',
      intro: { heading: "Non solo un'app. Un motore di validazione.", body: "Ogni app fitness ti permette di registrare un allenamento. ArenaKore è l'unica che ti dice se conta davvero. Usando la bio-analisi NEXUS, ogni rep viene tracciata, validata e registrata in modo permanente. Non puoi ingannare il sistema. È il punto." },
      problem: { heading: "Il problema di tutte le altre app fitness.", points: ["Tracci gli allenamenti, ma nessuno li valida.", "I progressi sembrano invisibili — nessun benchmark reale.", "Zero responsabilità. Zero competizione.", "Smetti dopo 3 mesi perché non c'è nulla in gioco."] },
      solution: { heading: "ArenaKore cambia la posta in gioco.", body: "Quando le tue rep vengono validate in tempo reale da un motore di bio-analisi AI, tutto cambia. Di colpo ogni sessione ha un punteggio. Ogni punteggio ha un rank. Ogni rank ha un rivale. Benvenuto nell'Arena." },
      howItWorks: [ { step: '01', title: 'Scarica l\'app', desc: 'Crea il tuo KORE ID — la tua identità atletica permanente.' }, { step: '02', title: 'Scegli una sfida', desc: 'Scegli tra 15+ discipline. Imposta le rep o il tempo target.' }, { step: '03', title: 'NEXUS valida', desc: 'La bio-analisi traccia ogni movimento. Forma scorretta = rep non contata.' }, { step: '04', title: 'Scala il ranking', desc: 'Il tuo K-Rating si aggiorna in tempo reale. Sfida gli altri. Difendi il tuo rank.' } ],
      benefits: [ { icon: '⚡', title: 'Validazione in tempo reale', desc: 'NEXUS valida ogni singola rep. Nessuna eccezione.' }, { icon: '🏆', title: 'Classifiche globali', desc: 'Il K-Rating ti classifica tra atleti in tutto il mondo.' }, { icon: '🔥', title: '15+ discipline', desc: 'CrossFit, AMRAP, forza, sprint — tutto in una piattaforma.' }, { icon: '📊', title: 'Punteggio DNA', desc: 'Il tuo profilo atletico unico su 6 attributi di performance.' }, { icon: '⚔️', title: 'Sfide 1vs1', desc: 'Sfida qualsiasi atleta direttamente. Il sistema decide chi vince.' }, { icon: '🛡', title: 'Record permanente', desc: 'La tua storia non scompare mai. Ogni PR è certificato.' } ],
      faq: [ { q: 'ArenaKore è gratuita?', a: 'Sì. L\'app base è gratuita da scaricare e usare. Funzionalità avanzate sono disponibili nei piani premium.' }, { q: 'Quali discipline supporta ArenaKore?', a: 'ArenaKore supporta 15+ discipline inclusi CrossFit WOD, AMRAP, EMOM, sollevamento pesi, sprint e altro.' }, { q: 'Come funziona la validazione NEXUS?', a: 'NEXUS usa il Puppet Motion Detection — un sistema AI di bio-analisi che traccia angoli articolari e qualità del movimento in tempo reale.' }, { q: 'Posso sfidare atleti di altre palestre?', a: 'Sì. Le sfide possono essere inviate a qualsiasi utente globalmente, o a palestre specifiche tramite la Mappa Hub.' } ],
      relatedPages: [ { label: 'Sfida CrossFit', href: ROUTES.crossfit }, { label: 'Allenamento AMRAP', href: ROUTES.amrap }, { label: 'Gamification Fitness', href: ROUTES.gamification } ],
    },
    es: {
      h1: "LA APP FITNESS CHALLENGE PARA ATLETAS REALES",
      badge: 'APP FITNESS CHALLENGE',
      intro: { heading: "No es solo una app. Es un motor de validación.", body: "Cada app de fitness te permite registrar un entrenamiento. ArenaKore es la única que te dice si realmente cuenta. Usando bio-análisis NEXUS, cada rep se rastrea, valida y registra permanentemente. No puedes hacer trampa. Ese es el punto." },
      problem: { heading: "El problema con todas las demás apps de fitness.", points: ["Registras entrenos, pero nadie los valida.", "El progreso parece invisible — sin benchmark real.", "Cero responsabilidad. Cero competición.", "Abandona a los 3 meses porque no hay nada en juego."] },
      solution: { heading: "ArenaKore cambia lo que está en juego.", body: "Cuando tus reps se validan en tiempo real por un motor de bio-análisis AI, todo cambia. De repente cada sesión tiene una puntuación. Cada puntuación tiene un ranking. Cada ranking tiene un rival. Bienvenido al Arena." },
      howItWorks: [ { step: '01', title: 'Descarga la app', desc: 'Crea tu KORE ID — tu identidad atlética permanente.' }, { step: '02', title: 'Elige un desafío', desc: 'Elige entre 15+ disciplinas. Define tu objetivo de reps o tiempo.' }, { step: '03', title: 'NEXUS valida', desc: 'El bio-análisis rastrea cada movimiento. Mala forma = rep no contada.' }, { step: '04', title: 'Sube el ranking', desc: 'Tu K-Rating se actualiza en tiempo real. Desafía a otros. Defiende tu posición.' } ],
      benefits: [ { icon: '⚡', title: 'Validación en tiempo real', desc: 'NEXUS valida cada rep individual. Sin excepciones.' }, { icon: '🏆', title: 'Rankings globales', desc: 'El K-Rating te clasifica entre atletas de todo el mundo.' }, { icon: '🔥', title: '15+ disciplinas', desc: 'CrossFit, AMRAP, fuerza, sprint — todo en una plataforma.' }, { icon: '📊', title: 'Perfil DNA', desc: 'Tu perfil atlético único en 6 atributos de rendimiento.' }, { icon: '⚔️', title: 'Desafíos 1vs1', desc: 'Desafía a cualquier atleta directamente. El sistema decide quién gana.' }, { icon: '🛡', title: 'Historial permanente', desc: 'Tu historial nunca desaparece. Cada PR está certificado.' } ],
      faq: [ { q: '¿Es gratuita ArenaKore?', a: 'Sí. La app base es gratuita. Las funciones avanzadas están disponibles en planes premium.' }, { q: '¿Qué disciplinas soporta ArenaKore?', a: 'ArenaKore soporta 15+ disciplinas incluyendo CrossFit WOD, AMRAP, EMOM, levantamiento de pesas, sprint y más.' }, { q: '¿Cómo valida NEXUS las reps?', a: 'NEXUS usa Puppet Motion Detection — un sistema AI de bio-análisis que rastrea ángulos articulares y calidad de movimiento en tiempo real.' }, { q: '¿Puedo desafiar atletas de otros gimnasios?', a: 'Sí. Los desafíos pueden enviarse a cualquier usuario globalmente, o a gimnasios específicos a través del Mapa Hub.' } ],
      relatedPages: [ { label: 'Desafío CrossFit', href: ROUTES.crossfit }, { label: 'Entrenamiento AMRAP', href: ROUTES.amrap }, { label: 'Gamificación Fitness', href: ROUTES.gamification } ],
    },
  },
  [ROUTES.crossfit]: {
    it: {
      h1: 'BOX VS BOX. ZERO SCUSE.',
      badge: 'SFIDA CROSSFIT',
      intro: { heading: 'Il tuo box. Il loro box. Un vincitore.', body: 'ArenaKore trasforma il CrossFit da sforzo individuale a competizione inter-box. I coach impostano il WOD. Gli atleti gareggiano. NEXUS valida ogni rep. La classifica mostra chi ha davvero fatto il lavoro.' },
      problem: { heading: 'Il CrossFit merita qualcosa di meglio dei fogli Excel.', points: ["Gli atleti dichiarano i risultati da soli — impossibile verificarli.", "La competizione inter-box richiede coordinazione manuale.", "Nessuna classifica in tempo reale durante un WOD.", "I risultati vengono dimenticati la settimana successiva."] },
      solution: { heading: "Costruito per l'intensità del CrossFit.", body: "NEXUS traccia ogni squat, ogni trazioni, ogni swing con il kettlebell — validando in tempo reale. I coach possono lanciare sfide box sincronizzate su più location. Il box migliore vince. Nessuna scusa." },
      howItWorks: [ { step: '01', title: 'Configura il tuo Box', desc: 'Registra il tuo box CrossFit come Hub ufficiale ArenaKore.' }, { step: '02', title: 'Programma il WOD', desc: 'Crea la sfida usando i template per coach.' }, { step: '03', title: 'Gli atleti gareggiano', desc: 'NEXUS valida ogni rep. Niente imbrogli. Niente auto-dichiarazioni.' }, { step: '04', title: 'Classifica live', desc: 'I ranking si aggiornano in tempo reale. Box vs box, atleta vs atleta.' } ],
      benefits: [ { icon: '🥊', title: 'Box vs Box', desc: 'Lancia sfide sincronizzate tra più box contemporaneamente.' }, { icon: '✅', title: 'Validazione rep', desc: 'NEXUS assicura che ogni rep rispetti lo standard. I coach possono impostare requisiti di profondità.' }, { icon: '📍', title: 'Hub Map', desc: 'Il tuo box è visibile a tutti gli atleti ArenaKore nella zona.' }, { icon: '🏆', title: 'Ranking box', desc: 'Classifiche permanenti mostrano quale box performa meglio nel tempo.' }, { icon: '📋', title: 'Template per coach', desc: '50+ template WOD pre-costruiti. Personalizza difficoltà e regole.' }, { icon: '📱', title: 'Tracciamento live', desc: 'Dashboard in tempo reale mostrano il punteggio di ogni atleta mentre gareggia.' } ],
      faq: [ { q: 'I miei atleti hanno bisogno di account individuali?', a: 'Sì. Ogni atleta crea un KORE ID gratuito. I manager del box hanno una dashboard admin.' }, { q: 'Posso organizzare competizioni inter-box?', a: 'Sì. Le sfide Box vs Box permettono WOD sincronizzati tra più location con ranking live.' }, { q: 'NEXUS funziona con tutti i movimenti CrossFit?', a: 'NEXUS attualmente valida 40+ movimenti CrossFit standard. Nuovi movimenti vengono aggiunti regolarmente.' }, { q: 'C\'è un costo per i box?', a: 'I box ottengono un pilot gratuito di 14 giorni. Dopo, i piani Business partono da una tariffa mensile fissa.' } ],
      relatedPages: [ { label: 'Per Palestre', href: ROUTES.gyms }, { label: 'Competizione Workout', href: ROUTES.competition }, { label: 'Allenamento AMRAP', href: ROUTES.amrap } ],
    },
    es: {
      h1: 'BOX VS BOX. SIN EXCUSAS.',
      badge: 'DESAFÍO CROSSFIT',
      intro: { heading: 'Tu box. Su box. Un ganador.', body: 'ArenaKore transforma CrossFit de esfuerzo individual a competición inter-box. Los coaches programan el WOD. Los atletas compiten. NEXUS valida cada rep. El ranking muestra quién realmente hizo el trabajo.' },
      problem: { heading: 'CrossFit merece algo mejor que hojas de cálculo.', points: ["Los atletas auto-reportan resultados — imposible verificarlos.", "La competición inter-box requiere coordinación manual.", "Sin ranking en tiempo real durante un WOD.", "Los resultados se olvidan la semana siguiente."] },
      solution: { heading: "Construido para la intensidad de CrossFit.", body: "NEXUS rastrea cada sentadilla, cada dominada, cada swing de kettlebell — validando en tiempo real. Los coaches pueden lanzar desafíos de box sincronizados en múltiples ubicaciones. El mejor box gana. Sin excusas." },
      howItWorks: [ { step: '01', title: 'Configura tu Box', desc: 'Registra tu box CrossFit como Hub oficial ArenaKore.' }, { step: '02', title: 'Programa el WOD', desc: 'Crea el desafío usando nuestras plantillas de coach.' }, { step: '03', title: 'Los atletas compiten', desc: 'NEXUS valida cada rep. Sin trampas. Sin auto-declaraciones.' }, { step: '04', title: 'Ranking en vivo', desc: 'Los rankings se actualizan en tiempo real. Box vs box, atleta vs atleta.' } ],
      benefits: [ { icon: '🥊', title: 'Box vs Box', desc: 'Lanza desafíos sincronizados entre múltiples boxes simultáneamente.' }, { icon: '✅', title: 'Validación de reps', desc: 'NEXUS asegura que cada rep cumpla el estándar.' }, { icon: '📍', title: 'Mapa Hub', desc: 'Tu box es visible para todos los atletas ArenaKore de la zona.' }, { icon: '🏆', title: 'Rankings de box', desc: 'Rankings permanentes muestran qué box rinde mejor con el tiempo.' }, { icon: '📋', title: 'Plantillas de coach', desc: '50+ plantillas WOD pre-construidas. Personaliza dificultad y reglas.' }, { icon: '📱', title: 'Seguimiento en vivo', desc: 'Dashboards en tiempo real muestran la puntuación de cada atleta mientras compite.' } ],
      faq: [ { q: '¿Mis atletas necesitan cuentas individuales?', a: 'Sí. Cada atleta crea un KORE ID gratuito. Los managers del box tienen un panel admin.' }, { q: '¿Puedo organizar competiciones inter-box?', a: 'Sí. Los desafíos Box vs Box permiten WODs sincronizados entre múltiples ubicaciones con rankings en vivo.' }, { q: '¿NEXUS funciona con todos los movimientos CrossFit?', a: 'NEXUS valida actualmente 40+ movimientos CrossFit estándar.' }, { q: '¿Hay un coste para los boxes?', a: 'Los boxes obtienen un pilot gratuito de 14 días. Después, los planes Business parten de una tarifa mensual fija.' } ],
      relatedPages: [ { label: 'Para Gimnasios', href: ROUTES.gyms }, { label: 'Competición Workout', href: ROUTES.competition }, { label: 'Entrenamiento AMRAP', href: ROUTES.amrap } ],
    },
  },
  [ROUTES.competition]: {
    it: {
      h1: 'ALLENATI PER VINCERE. GAREGGIA PER DIMOSTRARLO.',
      badge: 'COMPETIZIONE WORKOUT',
      intro: { heading: 'Allenarsi senza competizione è solo esercizio.', body: 'ArenaKore converte ogni sessione di allenamento in un evento competitivo. La tua performance viene misurata, validata e classificata contro atleti reali in tutto il mondo. Non like. Non follower. Ranking basati su risultati verificati.' },
      problem: { heading: 'Perché gli atleti competitivi abbandonano le app mainstream.', points: ["Nessuna vera competizione — solo log dei personal best.", "I ranking sono auto-dichiarati e non verificabili.", "Nessuna conseguenza per le performance scadenti.", "I tuoi risultati spariscono in un feed infinito."] },
      solution: { heading: "L'arena dove la performance è tutto.", body: "In ArenaKore, ti guadagni il rank. NEXUS valida ogni movimento. Il K-Rating traccia il tuo punteggio da 0 a 1000. Ogni sfida aggiorna il tuo record permanente. Gli atleti sono classificati globalmente e localmente. Non c'è posto dove nascondersi." },
      howItWorks: [ { step: '01', title: 'Costruisci il tuo KORE ID', desc: 'La tua identità atletica permanente. Statistiche, storia, sfide.' }, { step: '02', title: 'Entra in competizione', desc: 'Unisciti a sfide aperte o crea un match diretto 1vs1.' }, { step: '03', title: 'Performa e dimostra', desc: 'NEXUS valida le tue rep in tempo reale. Ogni movimento conta.' }, { step: '04', title: 'Scala le classifiche', desc: 'Il K-Rating si aggiorna dopo ogni competizione. Difendi la tua posizione.' } ],
      benefits: [ { icon: '📈', title: 'Sistema K-Rating', desc: 'Punteggio di performance da 0 a 1000 aggiornato dopo ogni competizione validata.' }, { icon: '⚔️', title: 'Diretto 1vs1', desc: 'Sfida atleti specifici. Il risultato è permanente e pubblico.' }, { icon: '🌍', title: 'Ranking globale', desc: 'Confronta il tuo K-Rating con atleti in tutto il mondo nella tua disciplina.' }, { icon: '🔒', title: 'Risultati certificati', desc: 'Tutti i risultati sono validati da NEXUS. Niente auto-dichiarazioni. Niente imbrogli.' }, { icon: '🧬', title: 'Profilo DNA', desc: 'VEL, FOR, RES, AGI, TEC, POT — il tuo profilo atletico completo.' }, { icon: '🔴', title: 'Competizioni live', desc: 'Eventi in tempo reale dove gli atleti gareggiano simultaneamente.' } ],
      faq: [ { q: 'Cos\'è il K-Rating?', a: 'Il K-Rating è il tuo punteggio di performance competitivo, da 0 a 1000. Si aggiorna dopo ogni competizione validata in base alla performance e agli avversari.' }, { q: 'Come sfido un altro atleta?', a: 'Trova qualsiasi atleta tramite il loro KORE ID, seleziona una disciplina, imposta il target di rep e lancia la sfida. Accettano, eseguono entrambi, NEXUS decide.' }, { q: 'Le competizioni sono monitorate in tempo reale?', a: 'Sì. Il Puppet Motion Detection di NEXUS valida tutti i movimenti mentre li esegui. Non c\'è revisione post-invio — il verdetto è live.' }, { q: 'Cosa succede se perdo una sfida?', a: 'Il tuo K-Rating si aggiusta. Le sconfitte fanno parte del tuo record permanente. Accetta, impara e torna più forte.' } ],
      relatedPages: [ { label: 'App Fitness Challenge', href: ROUTES.fitnessApp }, { label: 'Sfida CrossFit', href: ROUTES.crossfit }, { label: 'Gamification Fitness', href: ROUTES.gamification } ],
    },
    es: {
      h1: 'ENTRENA PARA GANAR. COMPITE PARA DEMOSTRARLO.',
      badge: 'COMPETICIÓN WORKOUT',
      intro: { heading: 'Entrenar sin competición es solo ejercicio.', body: 'ArenaKore convierte cada sesión de entrenamiento en un evento competitivo. Tu rendimiento se mide, valida y clasifica contra atletas reales en todo el mundo. No likes. No seguidores. Rankings basados en resultados verificados.' },
      problem: { heading: 'Por qué los atletas competitivos abandonan las apps mainstream.', points: ["Sin competición real — solo registros de récords personales.", "Los rankings son auto-declarados e inverificables.", "Sin consecuencias por bajo rendimiento.", "Tus logros desaparecen en un feed infinito."] },
      solution: { heading: "El arena donde el rendimiento lo es todo.", body: "En ArenaKore, te ganas tu posición. NEXUS valida cada movimiento. El K-Rating rastrea tu puntuación de 0 a 1000. Cada desafío actualiza tu historial permanente. Los atletas se clasifican global y localmente. No hay dónde esconderse." },
      howItWorks: [ { step: '01', title: 'Construye tu KORE ID', desc: 'Tu identidad atlética permanente. Estadísticas, historial, desafíos.' }, { step: '02', title: 'Entra en competición', desc: 'Únete a desafíos abiertos o crea un duelo directo 1vs1.' }, { step: '03', title: 'Actúa y demuéstralo', desc: 'NEXUS valida tus reps en tiempo real. Cada movimiento cuenta.' }, { step: '04', title: 'Sube los rankings', desc: 'El K-Rating se actualiza después de cada competición. Defiende tu posición.' } ],
      benefits: [ { icon: '📈', title: 'Sistema K-Rating', desc: 'Puntuación de rendimiento 0–1000 actualizada tras cada competición validada.' }, { icon: '⚔️', title: 'Directo 1vs1', desc: 'Desafía atletas específicos. El resultado es permanente y público.' }, { icon: '🌍', title: 'Ranking global', desc: 'Compara tu K-Rating con atletas de todo el mundo en tu disciplina.' }, { icon: '🔒', title: 'Resultados certificados', desc: 'Todos los resultados son validados por NEXUS. Sin auto-declaraciones.' }, { icon: '🧬', title: 'Perfil DNA', desc: 'VEL, FOR, RES, AGI, TEC, POT — tu perfil atlético completo.' }, { icon: '🔴', title: 'Competiciones en vivo', desc: 'Eventos en tiempo real donde los atletas compiten simultáneamente.' } ],
      faq: [ { q: '¿Qué es el K-Rating?', a: 'El K-Rating es tu puntuación de rendimiento competitivo, de 0 a 1000. Se actualiza después de cada competición validada.' }, { q: '¿Cómo desafío a otro atleta?', a: 'Encuentra cualquier atleta por su KORE ID, selecciona una disciplina, define el objetivo de reps y lanza el desafío.' }, { q: '¿Las competiciones se monitorizan en tiempo real?', a: 'Sí. El Puppet Motion Detection de NEXUS valida todos los movimientos mientras los ejecutas.' }, { q: '¿Qué pasa si pierdo un desafío?', a: 'Tu K-Rating se ajusta. Las derrotas forman parte de tu historial permanente. Acepta, aprende y vuelve más fuerte.' } ],
      relatedPages: [ { label: 'App Fitness Challenge', href: ROUTES.fitnessApp }, { label: 'Desafío CrossFit', href: ROUTES.crossfit }, { label: 'Gamificación Fitness', href: ROUTES.gamification } ],
    },
  },
  [ROUTES.amrap]: {
    it: {
      h1: 'PIÙ REP POSSIBILI. LE STIAMO CONTANDO.',
      badge: 'ALLENAMENTO AMRAP',
      intro: { heading: 'AMRAP è semplice. Eseguirlo correttamente non lo è.', body: 'Quante Rep Possibili. Tre parole che definiscono uno dei formati più brutali del fitness competitivo. Il motore NEXUS di ArenaKore traccia ogni rep nell\'AMRAP, valida la forma in tempo reale e ti dà un punteggio che puoi davvero confrontare con altri atleti.' },
      problem: { heading: 'Il problema dell\'AMRAP di cui nessuno parla.', points: ["Conti le tue rep da solo — la precisione varia.", "Le rep con forma scorretta contano come quelle corrette.", "Impossibile confrontare i risultati tra atleti in modo equo.", "I progressi sono invisibili senza benchmark validati."] },
      solution: { heading: "AMRAP come è stato progettato per essere fatto.", body: "NEXUS usa la bio-analisi per tracciare ogni movimento durante il tuo AMRAP. Le rep parziali non contano. La forma scorretta non conta. Solo rep complete e pulite vengono contate. Il tuo punteggio finale è certificato, confrontabile e permanente. Ora conosci il tuo vero numero." },
      howItWorks: [ { step: '01', title: 'Imposta il tuo AMRAP', desc: 'Scegli il movimento, il time cap e il livello di difficoltà.' }, { step: '02', title: 'Esegui', desc: 'NEXUS traccia ogni rep tramite Puppet Motion Detection.' }, { step: '03', title: 'Ottieni il punteggio', desc: 'Contano solo le rep validate. Nessun credito parziale.' }, { step: '04', title: 'Confronta e gareggia', desc: 'Il tuo punteggio AMRAP è classificato tra atleti nella tua categoria.' } ],
      benefits: [ { icon: '⏱', title: 'Precisione del time cap', desc: 'NEXUS traccia il numero esatto di rep al momento in cui il tempo scade.' }, { icon: '✅', title: 'Validazione della forma', desc: 'Ogni rep validata in tempo reale. Le rep parziali vengono segnalate automaticamente.' }, { icon: '📊', title: 'Tracciamento progressi', desc: 'Vedi il tuo miglioramento AMRAP settimana dopo settimana con dati certificati.' }, { icon: '🏆', title: 'Classifiche AMRAP', desc: 'Confronta il tuo punteggio con atleti nella tua disciplina in tutto il mondo.' }, { icon: '🔁', title: 'Libreria movimenti', desc: 'Squat, trazioni, thruster, burpees e 40+ movimenti validati.' }, { icon: '🧠', title: 'Insight sull\'allenamento', desc: 'K-Timeline mostra la tua costanza settimanale e le finestre di picco di performance.' } ],
      faq: [ { q: 'Quali movimenti AMRAP supporta ArenaKore?', a: 'ArenaKore supporta 40+ movimenti CrossFit e AMRAP inclusi thruster, trazioni, box jump, burpees, double-under e altro.' }, { q: 'Qual è la differenza tra AMRAP ed EMOM?', a: 'AMRAP è "Quante Rep Possibili" entro un time cap. EMOM è "Ogni Minuto sul Minuto" — completi un compito ogni minuto. Entrambi sono tracciati in ArenaKore.' }, { q: 'Posso usare ArenaKore per competizioni AMRAP a squadre?', a: 'Sì. Le sfide AMRAP di squadra permettono ai gruppi di accumulare conteggi combinati di rep.' }, { q: 'NEXUS è abbastanza preciso per AMRAP a livello competitivo?', a: 'NEXUS è calibrato per la validazione a livello competitivo. Usa il tracciamento degli angoli articolari e il timing del movimento.' } ],
      relatedPages: [ { label: 'Sfida CrossFit', href: ROUTES.crossfit }, { label: 'Competizione Workout', href: ROUTES.competition }, { label: 'App Fitness Challenge', href: ROUTES.fitnessApp } ],
    },
    es: {
      h1: 'MÁS REPS POSIBLES. LAS ESTAMOS CONTANDO.',
      badge: 'ENTRENAMIENTO AMRAP',
      intro: { heading: 'AMRAP es simple. Ejecutarlo correctamente no lo es.', body: 'As Many Reps As Possible. Tres palabras que definen uno de los formatos más brutales del fitness competitivo. El motor NEXUS de ArenaKore rastrea cada rep en tu AMRAP, valida la forma en tiempo real y te da una puntuación que realmente puedes comparar con otros atletas.' },
      problem: { heading: 'El problema del AMRAP del que nadie habla.', points: ["Cuentas tus propias reps — la precisión varía.", "Las reps con mala forma cuentan igual que las buenas.", "Sin forma de comparar resultados entre atletas equitativamente.", "El progreso es invisible sin benchmarks validados."] },
      solution: { heading: "AMRAP como fue diseñado para hacerse.", body: "NEXUS usa bio-análisis para rastrear cada movimiento durante tu AMRAP. Las reps parciales no cuentan. La mala forma no cuenta. Solo se puntúan reps completas y limpias. Tu puntuación final es certificada, comparable y permanente." },
      howItWorks: [ { step: '01', title: 'Configura tu AMRAP', desc: 'Elige movimiento, tiempo límite y nivel de dificultad.' }, { step: '02', title: 'Ejecuta', desc: 'NEXUS rastrea cada rep mediante Puppet Motion Detection.' }, { step: '03', title: 'Obtén tu puntuación', desc: 'Solo cuentan las reps validadas. Sin crédito parcial.' }, { step: '04', title: 'Compara y compite', desc: 'Tu puntuación AMRAP se clasifica entre atletas en tu categoría.' } ],
      benefits: [ { icon: '⏱', title: 'Precisión del límite de tiempo', desc: 'NEXUS rastrea el número exacto de reps cuando expira el tiempo.' }, { icon: '✅', title: 'Validación de forma', desc: 'Cada rep validada en tiempo real. Las reps parciales se señalan automáticamente.' }, { icon: '📊', title: 'Seguimiento de progreso', desc: 'Ve tu mejora AMRAP semana a semana con datos certificados.' }, { icon: '🏆', title: 'Rankings AMRAP', desc: 'Compara tu puntuación con atletas de tu disciplina en todo el mundo.' }, { icon: '🔁', title: 'Biblioteca de movimientos', desc: 'Sentadillas, dominadas, thrusters, burpees y 40+ movimientos validados.' }, { icon: '🧠', title: 'Análisis de entrenamiento', desc: 'K-Timeline muestra tu consistencia semanal y ventanas de máximo rendimiento.' } ],
      faq: [ { q: '¿Qué movimientos AMRAP soporta ArenaKore?', a: 'ArenaKore soporta 40+ movimientos CrossFit y AMRAP incluyendo thrusters, dominadas, box jumps, burpees, double-unders y más.' }, { q: '¿Cuál es la diferencia entre AMRAP y EMOM?', a: 'AMRAP es "As Many Reps As Possible" dentro de un tiempo límite. EMOM es "Every Minute On the Minute".' }, { q: '¿Puedo usar ArenaKore para competiciones AMRAP por equipos?', a: 'Sí. Los desafíos AMRAP de equipo permiten a los grupos acumular conteos combinados de reps.' }, { q: '¿Es NEXUS suficientemente preciso para AMRAP a nivel competitivo?', a: 'NEXUS está calibrado para validación a nivel competitivo. Usa seguimiento de ángulos articulares y temporización del movimiento.' } ],
      relatedPages: [ { label: 'Desafío CrossFit', href: ROUTES.crossfit }, { label: 'Competición Workout', href: ROUTES.competition }, { label: 'App Fitness Challenge', href: ROUTES.fitnessApp } ],
    },
  },
  [ROUTES.gamification]: {
    it: {
      h1: 'GAMIFICA IL FITNESS. DOMINA LA FIDELIZZAZIONE.',
      badge: 'GAMIFICATION FITNESS',
      intro: { heading: "La gamification non è un trucco. È scienza comportamentale.", body: "Il motivo per cui la maggior parte delle app fitness fallisce non sono le funzionalità — è la psicologia. Le persone smettono quando non ci sono conseguenze. ArenaKore applica meccaniche di gamification comprovate al fitness: ranking, sfide, streak, progressi validati e risultati pubblici. I dati dimostrano che funziona." },
      problem: { heading: "Perché l'80% degli iscritti in palestra smette entro 6 mesi.", points: ["Nessuna responsabilità esterna — solo automotivazione.", "I progressi sembrano invisibili dopo la fase iniziale.", "Nessun elemento di confronto sociale o competitivo.", "I traguardi sono arbitrari e facili da ignorare."] },
      solution: { heading: "Il sistema di gamification che cambia davvero il comportamento.", body: "Il motore NEXUS di ArenaKore crea puntate reali. Il tuo K-Rating è pubblico. Le tue sfide sono permanenti. Il tuo punteggio DNA evolve. Ogni decisione di allenamento ha una conseguenza visibile e misurabile. Ecco perché ArenaKore guida +30% di coinvolgimento e +40% di fidelizzazione rispetto alle app fitness standard." },
      howItWorks: [ { step: '01', title: 'Punti e ranking', desc: 'Il K-Flux premia ogni rep validata. Il K-Rating ti classifica competitivamente.' }, { step: '02', title: 'Streak e timeline', desc: 'K-Timeline traccia la costanza su 7 giorni. Le streak contano. I gap sono visibili.' }, { step: '03', title: 'Sfide e premi', desc: 'Completa sfide per sbloccare bonus K-Flux ed evoluzione DNA.' }, { step: '04', title: 'Competizione sociale', desc: 'KORE Network mostra il tuo rank nella tua palestra e globalmente. I colleghi vedono il tuo punteggio.' } ],
      benefits: [ { icon: '📈', title: '+30% coinvolgimento', desc: 'Gli atleti con traguardi gamificati si allenano in media il 30% di sessioni in più al mese.' }, { icon: '🔁', title: '+40% fidelizzazione', desc: 'Le palestre che usano ArenaKore riportano il 40% di fidelizzazione in più a 6 mesi.' }, { icon: '🎯', title: 'Puntate reali', desc: 'Ranking, streak e punteggi DNA creano una motivazione significativa e auto-rinforzante.' }, { icon: '🧠', title: 'Loop comportamentali', desc: 'I programmi di ricompensa variabile (sfide, rank) sono scientificamente provati per guidare la formazione di abitudini.' }, { icon: '👥', title: 'Prova sociale', desc: 'I ranking pubblici innescano il confronto sociale — il trigger motivazionale più potente nel fitness.' }, { icon: '🔓', title: 'Sistema di progressione', desc: "L'evoluzione DNA, i miglioramenti di rank e i premi K-Flux creano percorsi di progressione chiari." } ],
      faq: [ { q: "Cos'è il K-Flux?", a: "Il K-Flux è la valuta di performance di ArenaKore. Guadagnata completando sfide validate, sblocca traguardi di progressione e traccia il tuo output competitivo." }, { q: 'Come funziona il sistema delle streak?', a: 'K-Timeline mostra la tua costanza di allenamento su 7 giorni. I giorni consecutivi di allenamento costruiscono le streak. Rompere una streak è visibile alla tua KORE Network.' }, { q: 'La cifra del +40% di fidelizzazione è verificata?', a: 'Queste cifre si basano sui dati iniziali della piattaforma e su studi comportamentali sulla gamification nel contesto fitness.' }, { q: 'Le palestre possono personalizzare gli elementi di gamification?', a: 'Sì. Tramite Arena Business, le palestre possono impostare sfide personalizzate, livelli di ricompensa e bracket di competizione.' } ],
      relatedPages: [ { label: 'Per Palestre', href: ROUTES.gyms }, { label: 'App Fitness Challenge', href: ROUTES.fitnessApp }, { label: 'Competizione Workout', href: ROUTES.competition } ],
    },
    es: {
      h1: 'GAMIFICA EL FITNESS. DOMINA LA RETENCIÓN.',
      badge: 'GAMIFICACIÓN FITNESS',
      intro: { heading: "La gamificación no es un truco. Es ciencia del comportamiento.", body: "La razón por la que la mayoría de las apps de fitness fracasan no son las funciones — es la psicología. Las personas abandonan cuando no hay consecuencias. ArenaKore aplica mecánicas de gamificación probadas al fitness: rankings, desafíos, rachas, progreso validado y resultados públicos." },
      problem: { heading: "Por qué el 80% de los miembros del gimnasio abandona en 6 meses.", points: ["Sin responsabilidad externa — solo automotivación.", "El progreso parece invisible después de la fase inicial.", "Sin elemento de comparación social o competitivo.", "Los hitos son arbitrarios y fáciles de ignorar."] },
      solution: { heading: "El sistema de gamificación que realmente cambia el comportamiento.", body: "El motor NEXUS de ArenaKore crea apuestas reales. Tu K-Rating es público. Tus desafíos son permanentes. Tu puntuación DNA evoluciona. Cada decisión de entrenamiento tiene una consecuencia visible y medible." },
      howItWorks: [ { step: '01', title: 'Puntos y ranking', desc: 'K-Flux recompensa cada rep validada. K-Rating te clasifica competitivamente.' }, { step: '02', title: 'Rachas y timelines', desc: 'K-Timeline rastrea la consistencia de 7 días. Las rachas importan. Los vacíos son visibles.' }, { step: '03', title: 'Desafíos y recompensas', desc: 'Completa desafíos para desbloquear bonos K-Flux y evolución DNA.' }, { step: '04', title: 'Competición social', desc: 'KORE Network muestra tu ranking en tu gimnasio y globalmente.' } ],
      benefits: [ { icon: '📈', title: '+30% compromiso', desc: 'Los atletas con hitos gamificados entrenan un 30% más de sesiones al mes.' }, { icon: '🔁', title: '+40% retención', desc: 'Los gimnasios que usan ArenaKore reportan un 40% más de retención a 6 meses.' }, { icon: '🎯', title: 'Apuestas reales', desc: 'Rankings, rachas y puntuaciones DNA crean una motivación significativa.' }, { icon: '🧠', title: 'Bucles conductuales', desc: 'Los programas de recompensa variable están científicamente probados para generar hábitos.' }, { icon: '👥', title: 'Prueba social', desc: 'Los rankings públicos desencadenan la comparación social.' }, { icon: '🔓', title: 'Sistema de progresión', desc: 'La evolución DNA, las mejoras de rango y las recompensas K-Flux crean caminos de progresión claros.' } ],
      faq: [ { q: '¿Qué es el K-Flux?', a: 'K-Flux es la moneda de rendimiento de ArenaKore. Se gana completando desafíos validados y desbloquea hitos de progresión.' }, { q: '¿Cómo funciona el sistema de rachas?', a: 'K-Timeline muestra tu consistencia de entrenamiento durante 7 días. Los días consecutivos construyen rachas.' }, { q: '¿Está verificada la cifra del +40% de retención?', a: 'Estas cifras se basan en datos iniciales de la plataforma y estudios conductuales sobre gamificación en fitness.' }, { q: '¿Pueden los gimnasios personalizar los elementos de gamificación?', a: 'Sí. A través de Arena Business, los gimnasios pueden establecer desafíos personalizados y niveles de recompensa.' } ],
      relatedPages: [ { label: 'Para Gimnasios', href: ROUTES.gyms }, { label: 'App Fitness Challenge', href: ROUTES.fitnessApp }, { label: 'Competición Workout', href: ROUTES.competition } ],
    },
  },
};

export function getLocalizedPage(page, lang) {
  if (!lang || lang === 'en' || !page) return page;
  const trans = PAGE_TRANSLATIONS[page.slug]?.[lang];
  if (!trans) return page;
  return {
    ...page,
    h1: trans.h1 || page.h1,
    badge: trans.badge || page.badge,
    intro: trans.intro ? { ...page.intro, ...trans.intro } : page.intro,
    problem: trans.problem ? { ...page.problem, ...trans.problem } : page.problem,
    solution: trans.solution ? { ...page.solution, ...trans.solution } : page.solution,
    howItWorks: trans.howItWorks || page.howItWorks,
    benefits: trans.benefits || page.benefits,
    faq: trans.faq || page.faq,
    relatedPages: trans.relatedPages || page.relatedPages,
  };
}

export const BLOG_POSTS = [
  {
    slug: 'why-people-quit-gym-after-3-months',
    title: 'Why People Quit the Gym After 3 Months (And How to Stop It)',
    seo_title: 'Why People Quit the Gym After 3 Months | ArenaKore Blog',
    meta_description: 'Science explains why 80% of gym members quit at the 3-month mark — and what gym owners can do to stop it. The role of competition and accountability.',
    category: 'Psychology',
    readTime: '6 min read',
    date: 'April 2026',
    coverImage: IMGS.gym,
    excerpt: 'The 3-month drop-off is not a motivation problem. It\'s a design problem. Here\'s what the science says — and how competitive fitness solves it.',
    content: `
## The 3-Month Curse

Walk into any gym in January. It's packed. Walk in again in April. You can hear the echo. The "3-month dropout" isn't a myth — it's one of the most documented patterns in behavioral science, and it affects gyms worldwide regardless of equipment, staff quality or price point.

Understanding why it happens is the first step to stopping it.

## The Real Reason People Quit

Most gym owners blame motivation. "People just aren't committed enough." But that's the wrong diagnosis. Research in behavioral psychology shows that motivation is not the limiting factor in the early stages — it's consequence.

When someone starts a gym routine, early progress is visible and rapid. The body changes. Energy increases. Feedback loops are positive and frequent. This is the neurological equivalent of winning — dopamine fires consistently, reinforcing the behavior.

At around the 12–16 week mark, something shifts. Early gains plateau. The body adapts. Progress becomes invisible to the casual observer. And critically — there is no external consequence for skipping a session. Nobody notices. Nothing changes. The behavior loses its reinforcement mechanism.

**This is not a willpower problem. It's a reinforcement problem.**

## What Keeps Athletes Training

Look at the people who never quit. Not the discipline-obsessed, but ordinary people who consistently show up month after month. What do they have in common?

1. **Social accountability** — Someone expects them to show up. Missing a session has a social consequence.
2. **External competition** — Their progress is visible and comparable to others. Rankings exist.
3. **Clear milestones** — Progress is tracked in a way that makes improvement undeniable.
4. **Stakes** — Something is genuinely at risk when they underperform.

These are not personality traits. They are environmental conditions that can be engineered.

## Competition as a Retention Mechanism

The fitness industry has underinvested in competitive infrastructure. Most apps focus on personal progress — an entirely internal feedback loop. The moment external progress plateaus, the loop collapses.

Competition introduces a persistent external feedback loop. When your performance is ranked against others, there is always something at stake. Improving your rank requires showing up. Losing your position to a rival hurts. These are natural, self-sustaining motivators that don't require willpower or discipline.

Gyms that introduce structured competition programs consistently report 30–40% improvements in 6-month retention. Not because they attracted more motivated people — because they changed the environment.

## How ArenaKore Addresses the 3-Month Cliff

ArenaKore's design is built around this exact problem. The K-Rating system creates an external, competitive score that updates in real-time. K-Timeline tracks 7-day consistency and makes gaps visible. KORE Network shows an athlete's rank in their gym and globally.

When a member considers skipping a session, they're not just skipping exercise — they're risking their rank, losing their streak, and potentially being overtaken by a rival. These are genuine consequences that mainstream fitness apps cannot replicate.

The result: athletes who use ArenaKore train more consistently, re-engage faster after breaks, and stay active on the platform for significantly longer than comparable apps.

## For Gym Owners: What You Can Do Today

1. Introduce monthly challenges with visible leaderboards
2. Publicly recognize top performers
3. Create rivalry between members at similar performance levels
4. Make consistency visible — track and display streaks
5. Use technology that validates performance, not just logs it

The 3-month cliff is not inevitable. It's a symptom of an environment that lacks competition. Build the Arena. The athletes will stay.
    `,
  },
  {
    slug: 'how-fitness-challenges-improve-consistency',
    title: 'How Fitness Challenges Improve Training Consistency by 30%',
    seo_title: 'How Fitness Challenges Improve Consistency | ArenaKore Blog',
    meta_description: 'Data shows structured fitness challenges increase training frequency by 30%. Learn the psychology behind challenge-driven consistency.',
    category: 'Science',
    readTime: '5 min read',
    date: 'March 2026',
    coverImage: IMGS.teamTraining,
    excerpt: 'A challenge is more than a workout format. It\'s a behavioral commitment device. Here\'s the science behind why challenged athletes train more consistently.',
    content: `
## The Psychology of Commitment

When you accept a fitness challenge, something shifts neurologically. You've made a public commitment with a defined endpoint, clear rules, and a measurable outcome. Behavioral economists call this a "commitment device" — a structure that makes it costly to abandon a goal.

Research by Dan Ariely and others in behavioral economics consistently demonstrates that public, structured commitments dramatically increase follow-through rates compared to private intentions. In the fitness context, this translates directly to training frequency.

## Challenge Structure Creates Habit Loops

Habits form through a three-part loop: cue, routine, reward. Most gym routines fail because the reward component is too delayed (visible results take months) or too vague ("I feel healthier").

A fitness challenge compresses this loop:
- **Cue**: The challenge timer is running. Today is your day to train.
- **Routine**: Execute the defined workout, tracked in real-time.
- **Reward**: Immediate score, rank update, streak maintained.

When the reward arrives immediately and specifically, habit formation accelerates. Athletes don't need to wait weeks to see progress — their challenge score updates after every session.

## The Data: 30% More Sessions

Across early ArenaKore platform data, athletes who participate in structured monthly challenges complete on average 30% more training sessions per month than non-challenge users on the platform.

This is not explained by pre-existing motivation levels. Challenge participants and non-participants showed similar baseline training frequencies before challenge activation. The behavioral difference emerged specifically when the challenge structure was applied.

The mechanism is simple: when you're in a challenge, skipping a session is not just "missing a workout." It's losing ground in a competition. That is a meaningfully different psychological context.

## Types of Challenges That Drive Consistency

Not all challenge formats are equally effective. Data points to three key factors:

**1. Fixed duration** — 7-day, 14-day and 30-day challenges outperform open-ended formats. A clear endpoint creates urgency.

**2. Peer comparison** — Challenges with leaderboards showing participants' relative performance drive significantly higher completion rates than solo progress-only formats.

**3. Validated difficulty** — Challenges that use objective validation (like NEXUS bio-analysis) reduce perceived unfairness and maintain competitive integrity.

## What This Means for Your Training

If you're struggling with training consistency, the solution is unlikely to be more willpower. The solution is structure.

Join a challenge with a fixed end date. Make your participation visible to others. Set a specific target that will be objectively validated. These conditions replicate the environmental factors that drive elite athlete consistency — not in terms of talent, but in terms of behavioral engineering.

The competition never ends. Start your first ArenaKore challenge and find out what happens when your training actually has stakes.
    `,
  },
  {
    slug: 'amrap-vs-emom',
    title: 'AMRAP vs EMOM: Which Training Format Is Right for You?',
    seo_title: 'AMRAP vs EMOM Training Guide | ArenaKore Blog',
    meta_description: 'AMRAP vs EMOM: learn the difference, when to use each, and how ArenaKore tracks and validates both formats for competitive fitness.',
    category: 'Training',
    readTime: '7 min read',
    date: 'February 2026',
    coverImage: IMGS.crossfit,
    excerpt: 'Two of the most popular high-intensity training formats explained. How they differ, when to use each, and why validation changes everything.',
    content: `
## Two Formats. One Goal: Push Harder.

AMRAP and EMOM are staples of CrossFit, functional fitness and high-intensity training. Both formats share a core philosophy: structured time pressure creates performance output that steady-state training cannot replicate. But they achieve this in different ways, with different physiological effects and different competitive applications.

Understanding the difference is not just academic — it determines how you program, how you compete, and how you measure progress.

## AMRAP: Maximum Output in Fixed Time

**As Many Reps As Possible.** The format is simple: complete as many reps of a defined movement (or sequence) as you can within a specified time cap.

AMRAP tests:
- Aerobic and anaerobic capacity simultaneously
- Mental resilience under fatigue
- Pacing strategy
- Movement efficiency under accumulated fatigue

A well-programmed AMRAP pushes athletes to make real-time decisions: pace aggressively and risk failure, or conserve energy and sacrifice score. This decision-making element makes AMRAP one of the most revealing formats in competitive fitness.

**Common AMRAP formats:**
- 10-minute AMRAP: thrusters + pull-ups (classic CrossFit Fran format)
- 20-minute AMRAP: rowing + box jumps + kettlebell swings
- 5-minute AMRAP: max reps single movement (squat jumps, burpees, etc.)

## EMOM: Consistent Quality Under Time Pressure

**Every Minute On the Minute.** The format requires completing a defined set of reps before the minute expires. Remaining time in the minute is rest.

EMOM tests:
- Movement efficiency (faster = more rest)
- Sustainable power output
- Lactate management
- Consistency across multiple rounds

Where AMRAP rewards maximum output bursts, EMOM rewards efficiency and consistency. The format is particularly valuable for skill development under fatigue — a key requirement for competitive CrossFit.

**Common EMOM formats:**
- 12-minute EMOM: 3 power cleans on odd minutes, 5 bar muscle-ups on even minutes
- 20-minute EMOM: 5 deadlifts @ 70% 1RM per minute
- 10-minute EMOM: 10 calories assault bike per minute

## When to Use Each Format

| Format | Best For | Training Effect |
|--------|----------|-----------------|
| AMRAP | Max output testing | Peak capacity, competitive benchmarking |
| EMOM | Skill under fatigue | Technical consistency, lactate tolerance |
| Both | Competition prep | Full metabolic conditioning |

For competition-focused athletes, both formats should appear regularly in programming. AMRAP scores benchmark competitive potential. EMOM sessions develop the movement quality that makes AMRAP scores defensible under scrutiny.

## Why Validation Changes the AMRAP/EMOM Equation

The fundamental weakness of self-scored AMRAP and EMOM is obvious: partial reps, shortened range of motion and miscount are all impossible to verify. In a competitive context, this makes comparison meaningless.

ArenaKore's NEXUS engine applies objective validation to both formats. Every rep in an AMRAP is tracked via Puppet Motion Detection. Every EMOM interval is timed and movement quality assessed. A squat that doesn't hit depth doesn't count. A pull-up that doesn't reach chin-over-bar is rejected.

This creates something that has never existed in amateur fitness competition: a genuinely comparable AMRAP and EMOM score. When two athletes post an AMRAP result on ArenaKore, you know both scores represent the same standard. That is the foundation of real competition.

## Which Should You Prioritize?

Both. But if you're building a foundation, start with EMOM. The movement quality developed through consistent EMOM training makes your AMRAP scores more sustainable and defensible.

Then compete. Find athletes at your level on ArenaKore, run an AMRAP challenge, and see who actually does more reps with verified form. That number tells you exactly where you stand.
    `,
  },
  {
    slug: 'how-to-create-competition-in-gym',
    title: 'How to Create a Competition Culture in Your Gym',
    seo_title: 'How to Create Competition Culture in Your Gym | ArenaKore',
    meta_description: 'Practical strategies for gym owners to build a competition culture. Leaderboards, challenges, rivalries — and the technology that makes it scalable.',
    category: 'Gym Management',
    readTime: '8 min read',
    date: 'January 2026',
    coverImage: IMGS.barbell,
    excerpt: 'Competition culture doesn\'t emerge naturally in most gyms. It has to be engineered. Here\'s exactly how to do it.',
    content: `
## Why Your Gym Needs a Competition Culture

The most successful fitness facilities in the world — from elite CrossFit boxes to premium performance gyms — share one common trait: they feel like a team. Not just a place to exercise, but an environment where performance is observed, compared and celebrated.

This is not accidental. It's built. And the gym owners who build it retain more members, attract more serious athletes, and generate more word-of-mouth than their competitors. Competition culture is not a nice-to-have — it's a retention and acquisition strategy.

## Start With the Leaderboard

The most powerful behavioral intervention in a gym is a visible leaderboard. It doesn't need to be digital. A whiteboard with monthly challenge results changes behavior immediately.

When members know their performance is being compared to peers, output increases. This is the Kohler Effect — the documented tendency for individuals to perform better in group comparison contexts than when training alone. Your weakest members perform harder when they can see a peer slightly ahead of them on a ranking.

**Practical implementation:**
- Monthly challenge: pick one movement (max pull-ups, max squat weight, 5km row time)
- Track all member attempts with standardized rules
- Post results publicly in the gym
- Award recognition (not prizes) to top performers

The key is standardization. Every result must represent the same standard or the leaderboard loses credibility.

## Build Rivalries, Not Just Rankings

Global leaderboards are motivating. Peer rivalries are addictive.

Identify members who are at similar performance levels. Introduce them. Note publicly when one overtakes the other in a challenge. Create "brackets" within your gym — intermediate male, advanced female, master 45+ etc. When athletes are competing against relevant peers, motivation is far more sustained than when they're ranked against athletes of very different ability.

**How to engineer rivalries:**
1. Segment your leaderboards by ability bracket
2. Notify athletes when they're overtaken by a peer
3. Schedule head-to-head challenges between evenly matched members
4. Reference rivalries publicly in your coaching (with consent)

## Monthly Challenge Calendar

Consistency of challenge is as important as the challenge itself. A gym with a clearly defined monthly challenge calendar creates anticipation — members plan their training around challenge dates.

**Sample quarterly calendar:**
- **January**: Max AMRAP burpees in 5 minutes
- **February**: Max pull-ups strict form
- **March**: 1-rep max deadlift
- **April**: 2km row time trial
- **May**: AMRAP 15-minute: 10 thrusters + 10 box jumps

Each challenge should have clear standards, a submission window, and results posted publicly by a fixed date.

## The Technology Layer

Manual leaderboard management works at small scale but breaks at 100+ members. This is where technology becomes a competitive advantage.

The key requirements for a gym competition technology system:
1. **Rep validation** — Self-reported results create disputes and perceived unfairness
2. **Real-time updates** — Live leaderboards during challenges dramatically increase engagement
3. **Mobile access** — Members should track their rank from their phone
4. **Multi-gym support** — The ability to compete against other gyms expands motivation beyond your four walls

ArenaKore's Arena Business platform addresses all four. NEXUS validates reps automatically. Leaderboards update live. Members access rankings via the app. And box-vs-box challenges allow your gym to compete against others in your region.

## The Cultural Investment

Technology and programs are infrastructure. Culture requires coaching.

The role of the coach in competition culture is to frame effort publicly. Acknowledge PBs in class. Reference challenge rankings during warm-ups. Create a vocabulary around competition that normalizes comparison without shaming underperformance.

"Where are you on this month's challenge?" asked with genuine interest, not judgment, is one of the most powerful coaching interventions in retention management.

Build the environment. The competition will follow.
    `,
  },
  {
    slug: 'gamification-in-fitness',
    title: 'Gamification in Fitness: The Science Behind Why It Works',
    seo_title: 'Gamification in Fitness | Behavioral Science | ArenaKore',
    meta_description: 'Why gamification works in fitness — behavioral science, real data, and how points, rankings and challenges change training behavior permanently.',
    category: 'Science',
    readTime: '7 min read',
    date: 'December 2025',
    coverImage: IMGS.competition,
    excerpt: 'Points, badges and leaderboards aren\'t gimmicks. They\'re implementations of behavioral loops that cognitive science has studied for decades. Here\'s the evidence.',
    content: `
## Gamification Is Older Than Video Games

The term "gamification" emerged in the tech industry around 2010, but the behavioral mechanics it describes have been studied since the 1950s. B.F. Skinner's work on operant conditioning, Mihaly Csikszentmihalyi's flow theory, and self-determination theory by Deci and Ryan all describe the psychological conditions that gamification attempts to engineer.

The application to fitness is not a marketing trend. It's an evidence-based intervention.

## The Four Behavioral Drivers

Effective fitness gamification works by activating four core motivational drivers:

### 1. Competence (Progress)
Humans are intrinsically motivated by improvement. The challenge is making improvement visible. K-Rating provides an objective number that changes with every validated performance. When that number increases by 5 points, the brain registers achievement — regardless of whether the absolute score is "impressive." Progress is motivating, even when it's incremental.

### 2. Relatedness (Social Comparison)
Social comparison is one of the most powerful motivators in human behavior. Leon Festinger's Social Comparison Theory (1954) established that humans calibrate their self-assessment by comparing to peers. In fitness, this means knowing that a friend has a higher AMRAP score than you is more motivating to train than any abstract personal goal.

Leaderboards harness this mechanism deliberately. They're not about embarrassing underperformers — they're about creating the comparison context that natural human psychology requires to sustain effort.

### 3. Autonomy (Choice)
Effective gamification preserves user agency. Fixed-difficulty challenges with no flexibility remove a critical psychological need. The most effective competition systems allow athletes to choose their challenge level, their discipline, and their opponents. In ArenaKore, every challenge is self-initiated. This preserves the autonomy that makes competitive engagement sustainable.

### 4. Variable Rewards (Unpredictability)
The most addictive behavioral loop is variable reinforcement — the structure used in slot machines, video games and social media. When you don't know exactly what you'll receive for a behavior, but you know the probability of reward is high, behavior frequency maximizes.

In fitness gamification, this translates to: you don't know if today's session will result in a rank increase, a personal best, or a challenge victory — but it might. That possibility drives significantly higher training frequency than predictable, fixed rewards.

## Real Data on Gamification in Fitness

The research is consistent across multiple studies:

- **Stanford Persuasive Technology Lab**: Competition-based features in fitness apps increase daily active use by 24–31% compared to progress-only apps
- **Journal of Sport & Exercise Psychology**: Athletes with external ranking systems train 2.7x more consistently than matched controls with only internal progress tracking
- **Gym retention meta-analysis (2024)**: Facilities with structured challenge programs report 35–42% lower 6-month churn vs. industry average

These are not marginal effects. They represent the difference between a sustainable training habit and the 3-month dropout cycle.

## Why Most Fitness Gamification Fails

Despite the evidence, most fitness app gamification is ineffective. The reason is usually one of three design failures:

1. **Unvalidated progress** — If anyone can claim any score, rankings are meaningless and social comparison collapses
2. **No real stakes** — Badges and virtual trophies that have zero consequence don't activate competitive psychology
3. **No peer comparison** — Progress-only trackers miss the most powerful motivational lever

ArenaKore addresses all three. NEXUS validation ensures every score is real. K-Rating affects competitive standing with genuine implications. KORE Network provides peer visibility that makes comparison automatic and persistent.

## The Practical Implication

If you're training inconsistently, gamification is not beneath you — it's precisely what behavioral science recommends. External structure, validated progress and peer comparison are the conditions under which human motivation sustains.

The athletes who train hardest year-round are not the most disciplined. They're the most immersed in competitive environments that constantly provide stakes, comparison and progress signals.

Build those conditions. ArenaKore is how.
    `,
  },
];
