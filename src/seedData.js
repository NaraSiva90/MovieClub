// Seed data for Movie Club
// Run this in browser console or import into app to populate localStorage

const SEED_REVIEWS = {
  // Interstellar (2014)
  "157336": {
    movieId: "157336",
    movieData: {
      id: 157336,
      title: "Interstellar",
      release_date: "2014-11-05",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
    },
    scores: { S: 4, P: 5, A: 3, C: 4, E: 5 },
    text: "Era-defining visuals—Gargantua influenced actual astrophysics papers. McConaughey's video messages scene is devastating. The love-as-a-dimension ending polarizes, but the emotional machinery is precise. Not casual viewing; it's an event.",
    createdAt: "2024-01-15T10:00:00Z"
  },

  // Titanic (1997)
  "597": {
    movieId: "597",
    movieData: {
      id: 597,
      title: "Titanic",
      release_date: "1997-11-18",
      poster_path: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      overview: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic."
    },
    scores: { S: 3, P: 5, A: 3, C: 3, E: 5 },
    text: "Romeo and Juliet on a boat—simple but effective. Cameron built a 90% scale replica; the sinking sequence set a new standard for blockbuster filmmaking. The band playing as the ship sinks. People sobbed in theaters worldwide. Pure mass emotional impact.",
    createdAt: "2024-01-14T10:00:00Z"
  },

  // The Lord of the Rings: The Return of the King (2003)
  "122": {
    movieId: "122",
    movieData: {
      id: 122,
      title: "The Lord of the Rings: The Return of the King",
      release_date: "2003-12-01",
      poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces."
    },
    scores: { S: 4, P: 5, A: 3, C: 4, E: 5 },
    text: "The culmination of a trilogy-spanning epic. Minas Tirith, the Pelennor Fields, the Ride of the Rohirrim—every fantasy blockbuster since lives in its shadow. 'My friends, you bow to no one.' The Grey Havens farewell. Era-defining emotional payoff.",
    createdAt: "2024-01-13T10:00:00Z"
  },

  // Goodfellas (1990)
  "769": {
    movieId: "769",
    movieData: {
      id: 769,
      title: "GoodFellas",
      release_date: "1990-09-12",
      poster_path: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
      overview: "The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age."
    },
    scores: { S: 5, P: 4, A: 5, C: 5, E: 3 },
    text: "Era-defining structure—the voiceover, the non-linear timeline, the casual intimacy with violence. Every mob movie since is responding to Goodfellas. The Copacabana tracking shot. 'Funny how?' Endlessly rewatchable. Liotta, Pesci, De Niro—each iconic. You cannot look away from these people.",
    createdAt: "2024-01-12T10:00:00Z"
  },

  // The Dark Knight (2008)
  "155": {
    movieId: "155",
    movieData: {
      id: 155,
      title: "The Dark Knight",
      release_date: "2008-07-16",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      overview: "Batman raises the stakes in his war on crime, facing the Joker, a criminal mastermind who seeks to plunge Gotham into anarchy."
    },
    scores: { S: 4, P: 4, A: 4, C: 5, E: 4 },
    text: "Ledger's Joker is a singular achievement—you cannot look away. Every scene he's in vibrates with menace and charisma. The interrogation scene. The ferry dilemma. Tight structure, escalating stakes. A film that does everything well, elevated to greatness by one transcendent performance.",
    createdAt: "2024-01-11T10:00:00Z"
  },

  // When Harry Met Sally (1989)
  "639": {
    movieId: "639",
    movieData: {
      id: 639,
      title: "When Harry Met Sally...",
      release_date: "1989-07-21",
      poster_path: "/3Oc6u2sKjRBLupGDkKoyPE4Sk5X.jpg",
      overview: "During their travel from Chicago to New York, Harry and Sally debate whether men and women can be just friends."
    },
    scores: { S: 5, P: 2, A: 5, C: 4, E: 4 },
    text: "Era-defining for romantic comedy. Can men and women be friends? Nora Ephron's script set the template every romcom since has followed. 'I'll have what she's having.' The wagon wheel coffee table. Endlessly quotable, endlessly rewatchable. It invented the modern comfort romcom through wit alone.",
    createdAt: "2024-01-10T10:00:00Z"
  },

  // Avengers: Endgame (2019)
  "299534": {
    movieId: "299534",
    movieData: {
      id: 299534,
      title: "Avengers: Endgame",
      release_date: "2019-04-24",
      poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions."
    },
    scores: { S: 3, P: 3, A: 4, C: 3, E: 3 },
    text: "A satisfying conclusion that happens to be a film. The portals sequence is thrilling. Tony's death lands. But the emotion is borrowed from a decade of films, not earned by this one. No single performance dominates. Compare to ROTK—which devastates even on first viewing.",
    createdAt: "2024-01-09T10:00:00Z"
  },

  // Baahubali 2: The Conclusion (2017)
  "301528": {
    movieId: "301528",
    movieData: {
      id: 301528,
      title: "Baahubali 2: The Conclusion",
      release_date: "2017-04-26",
      poster_path: "/qPfFKy67NQmlusBUvJDxPdiwjUL.jpg",
      overview: "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is revealed."
    },
    scores: { S: 3, P: 5, A: 5, C: 3, E: 4 },
    text: "Era-defining for Indian cinema. Rajamouli proved Indian spectacle could compete with Hollywood on its own aesthetic terms—not imitating, but creating a distinct visual grammar. A clean break from hackneyed storylines and slapstick. Mahishmati feels like a place. Pure cinematic joy.",
    createdAt: "2024-01-08T10:00:00Z"
  },

  // Sholay (1975)
  "19666": {
    movieId: "19666",
    movieData: {
      id: 19666,
      title: "Sholay",
      release_date: "1975-08-15",
      poster_path: "/n9beTIhkhHPVwRWXCTqMqGPnkjy.jpg",
      overview: "A retired police officer recruits two criminals to capture the ruthless bandit who murdered his family."
    },
    scores: { S: 5, P: 3, A: 5, C: 4, E: 3 },
    text: "Salim-Javed's screenplay redefined Indian commercial cinema. The ensemble template, the balance of comedy and tragedy, the pacing across three hours. 'Kitne aadmi the?' Gabbar Singh—one of the great screen villains. Fifty years of rewatchability. The definition of a film that never gets old.",
    createdAt: "2024-01-07T10:00:00Z"
  },

  // Deewar (1975)
  "19665": {
    movieId: "19665",
    movieData: {
      id: 19665,
      title: "Deewar",
      release_date: "1975-01-24",
      poster_path: "/7bNexU9sWCcR4OR7cPnmzAnxSCl.jpg",
      overview: "A man becomes a criminal while his brother becomes a cop. The brothers find themselves on opposite sides of the law."
    },
    scores: { S: 5, P: 2, A: 2, C: 5, E: 4 },
    text: "The angry young man template. The brother dichotomy. 'Mere paas maa hai.' This screenplay defined a decade of Indian cinema. The film that created the Amitabh Bachchan persona—the coiled intensity, the righteous anger. Vijay dying in his mother's arms at the temple he could never enter. Genuine tragedy.",
    createdAt: "2024-01-06T10:00:00Z"
  },

  // Abhimaan (1973)
  "70825": {
    movieId: "70825",
    movieData: {
      id: 70825,
      title: "Abhimaan",
      release_date: "1973-07-20",
      poster_path: "/8LQSkfqVUg9J7vJpXf1hwYPqWhc.jpg",
      overview: "A successful singer marries a village girl with a beautiful voice. When her career takes off, his ego starts to destroy their marriage."
    },
    scores: { S: 3, P: 2, A: 3, C: 3, E: 3 },
    text: "A Star is Born, well executed. Amitabh and Jaya were married during filming—the chemistry is palpable. The scene where she deliberately sings poorly to save his pride is heartbreaking. Hrishikesh Mukherjee understood that domestic tragedy cuts deeper than epic tragedy.",
    createdAt: "2024-01-05T10:00:00Z"
  },

  // Aradhana (1969)
  "70815": {
    movieId: "70815",
    movieData: {
      id: 70815,
      title: "Aradhana",
      release_date: "1969-09-26",
      poster_path: "/vmUGBVwJBdvqFOFCjftasY0xJko.jpg",
      overview: "A woman raises her illegitimate son alone after her lover dies, only to see her son become a pilot like his father."
    },
    scores: { S: 3, P: 2, A: 3, C: 5, E: 4 },
    text: "This film created the Rajesh Khanna phenomenon—the first true 'superstar' in Indian cinema. The charm, the vulnerability, the sideways glance. Sharmila Tagore matches him with dignified suffering. 'Roop tera mastana,' 'Mere sapno ki rani'—the songs are timeless. Era-defining presence.",
    createdAt: "2024-01-04T10:00:00Z"
  },

  // City of God (2002)
  "598": {
    movieId: "598",
    movieData: {
      id: 598,
      title: "City of God",
      release_date: "2002-02-05",
      poster_path: "/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg",
      overview: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin."
    },
    scores: { S: 5, P: 4, A: 4, C: 4, E: 4 },
    text: "Era-defining structure. The sprawling, non-linear narrative across decades, the interweaving of dozens of characters. Meirelles created a template for how to tell a community's story through crime—not one protagonist, but an ecosystem. The favela feels alive. Compulsively watchable despite the brutality.",
    createdAt: "2024-01-03T10:00:00Z"
  },

  // Rebellion (L'Ordre et la Morale) (2011)
  "80281": {
    movieId: "80281",
    movieData: {
      id: 80281,
      title: "Rebellion",
      release_date: "2011-11-16",
      poster_path: "/s9tDYBplyoqDsuLnGe2bvvYwBTL.jpg",
      overview: "The true story of the 1988 Ouvéa cave hostage crisis in New Caledonia."
    },
    scores: { S: 3, P: 3, A: 2, C: 3, E: 4 },
    text: "The Ouvéa hostage crisis, told with procedural precision. Kassovitz structures it as a slow-motion tragedy—good intentions crushed by political machinery. Not entertaining in a conventional sense; the outcome is known and grim. The final act is devastating. The waste, the futility, the political betrayal.",
    createdAt: "2024-01-02T10:00:00Z"
  },

  // Persepolis (2007)
  "4762": {
    movieId: "4762",
    movieData: {
      id: 4762,
      title: "Persepolis",
      release_date: "2007-06-27",
      poster_path: "/pXgT7Dx7dirMhCnqS3SLOXuPtzZ.jpg",
      overview: "A young Iranian girl grows up during the Islamic Revolution and discovers her own identity."
    },
    scores: { S: 3, P: 5, A: 3, C: 3, E: 4 },
    text: "Era-defining visual style. The black-and-white graphic novel aesthetic translated to animation—expressionist, bold, instantly recognizable. Proved animation could be literary, personal, political. The grandmother's advice. The uncle's execution. Coming-of-age against historical upheaval.",
    createdAt: "2024-01-01T10:00:00Z"
  },

  // Troy (2004)
  "652": {
    movieId: "652",
    movieData: {
      id: 652,
      title: "Troy",
      release_date: "2004-05-13",
      poster_path: "/edMlij7nw2NMla32xskDnzMCFBM.jpg",
      overview: "An adaptation of Homer's epic, following the assault on Troy by Greek warriors, led by Achilles."
    },
    scores: { S: 3, P: 3, A: 3, C: 3, E: 3 },
    text: "The Iliad, compressed and secularized. Eric Bana's Hector is more compelling than Pitt's distant Achilles. Peter O'Toole's Priam begging for his son's body is a late-career highlight. Competent everywhere, transcendent nowhere. Once you've seen it, you've seen it.",
    createdAt: "2023-12-31T10:00:00Z"
  },

  // Kingdom of Heaven (2005)
  "1495": {
    movieId: "1495",
    movieData: {
      id: 1495,
      title: "Kingdom of Heaven",
      release_date: "2005-05-03",
      poster_path: "/3PmlHaXMjiCy29Qn5mevn69LKL.jpg",
      overview: "A blacksmith becomes a knight during the Crusades and finds himself defending Jerusalem."
    },
    scores: { S: 3, P: 5, A: 3, C: 3, E: 3 },
    text: "The director's cut is essential. Era-defining medieval spectacle—the siege of Jerusalem is staggering. Ghassan Massoud's Saladin is dignified and intelligent. Orlando Bloom is the weak link—adequate, not magnetic. Scott's eye for period texture is unmatched. The high-water mark for Crusades-era visuals.",
    createdAt: "2023-12-30T10:00:00Z"
  },

  // Thalapathi (1991)
  "57361": {
    movieId: "57361",
    movieData: {
      id: 57361,
      title: "Thalapathi",
      release_date: "1991-06-21",
      poster_path: "/yGihkRWvXfBQi5YmvAVww8LxpHl.jpg",
      overview: "An abandoned child grows up to become a gangster, while his friend becomes a politician. Their friendship is tested."
    },
    scores: { S: 4, P: 3, A: 3, C: 5, E: 4 },
    text: "The Mahabharata's Karna-Duryodhana friendship, transposed to Tamil Nadu gangland. Rajinikanth and Mammootty together—two of South Indian cinema's greatest presences. Their chemistry, their contrasting styles, their final confrontation. Mani Ratnam constructs tragedy through loyalty. The film exists because these two men are in it.",
    createdAt: "2023-12-29T10:00:00Z"
  }
};

// Function to seed localStorage
function seedMovieClub() {
  // Build reviews object
  const reviews = {};
  Object.values(SEED_REVIEWS).forEach(review => {
    reviews[review.movieId] = review;
  });

  // Calculate calibration
  const calibration = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: 0 };
  Object.values(reviews).forEach(review => {
    Object.values(review.scores).forEach(score => {
      calibration[score]++;
      calibration.total++;
    });
  });

  // Save to localStorage
  localStorage.setItem('movieclub_reviews', JSON.stringify(reviews));
  localStorage.setItem('movieclub_calibration', JSON.stringify(calibration));

  console.log('Movie Club seeded with', Object.keys(reviews).length, 'reviews');
  console.log('Calibration:', calibration);
  console.log('Distribution:');
  Object.entries(calibration).forEach(([score, count]) => {
    if (score !== 'total') {
      console.log(`  ${score}: ${((count / calibration.total) * 100).toFixed(1)}%`);
    }
  });

  return { reviews, calibration };
}

// Export for ES modules
export { SEED_REVIEWS, seedMovieClub };

// Auto-run if in browser console (not when imported as module)
if (typeof window !== 'undefined' && typeof import.meta === 'undefined') {
  seedMovieClub();
  console.log('\n✓ Refresh the page to see your seeded reviews!');
}
