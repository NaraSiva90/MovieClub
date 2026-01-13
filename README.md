# Movie Club — SPACE Reviews

A film review app that replaces simplistic star ratings with SPACE—a five-axis framework measuring Story, Pageantry, Amusement, Captivation, and Emotion.

## The SPACE Framework

Instead of a single score, each film gets a **shape**:

- **S**tory — Is the narrative compelling? Pacing, stakes, payoff.
- **P**ageantry — How good does it look? Spectacle, beauty, visual coherence.
- **A**musement — Is it fun? Would you watch again? Pure enjoyment.
- **C**aptivation — Do the performers hold your attention? Presence, magnetism.
- **E**motion — Does it make you feel something? Joy, dread, tears, warmth.

## The Scale

| Score | Meaning | Percentile |
|-------|---------|------------|
| 5 | Era-Defining | Top ~1% (1-2 per decade) |
| 4 | Superlative | Top 5% |
| 3 | Above Average | 75-95% |
| 2 | Average | 40-75% |
| 1 | Below Par | Bottom 40% |

Most films are 2s. That's not an insult—it's the definition of average.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload the `dist` folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

## Features

- 🎬 Search films via TMDB API
- 📊 Five-axis SPACE review with radar chart visualization
- 📈 Calibration tracking with distribution nudges
- 💾 Local storage persistence (no account needed)
- 📱 Responsive design

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts (radar charts)
- TMDB API

## Credits

- Film data from [The Movie Database (TMDB)](https://www.themoviedb.org/)
- SPACE framework developed through conversation
