<div align="center">

<img src="assets/opusdle-banner.svg" alt="Opusdle — klasyka na ucho" width="100%" />

<br />

**Codzienna zagadka muzyczna. Pięć prób. Klasyka na ucho.**

<br />

[**ZAGRAJ W OPUSDLE →**](https://kajton.github.io/Opusdle/)

<br /><br />

[![GitHub Pages deployment](https://github.com/kajton/Opusdle/actions/workflows/deploy.yml/badge.svg)](https://github.com/kajton/Opusdle/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-18-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

</div>

## Jak grać

Odgadnij ukryty utwór, zanim skończą się próby. Każda błędna odpowiedź odsłania kolejny takt, a podpowiedzi porównują kompozytora, epokę, gatunek, tonację i rok.

- **Zagadka dnia** — ta sama kompozycja dla wszystkich, nowa każdego dnia.
- **Tryb treningowy** — ćwicz bez limitu na losowych utworach.
- **Nuty i dźwięk** — zapis oraz odtwarzanie powstają w przeglądarce, bez plików audio.
- **Wyniki** — zachowaj serię i udostępnij rezultat.

## Uruchomienie lokalne

Wymagany Node.js 20.19+ lub 22.12+.

```bash
npm install
npm run dev
```

Build produkcyjny: `npm run build`.

## Publikacja

GitHub Actions buduje aplikację po każdym pushu do gałęzi `main` i publikuje katalog `dist` w GitHub Pages.

Przy pierwszej publikacji ustaw w repozytorium **Settings → Pages → Build and deployment → Source → GitHub Actions**. Po zakończeniu workflow gra będzie dostępna pod adresem [kajton.github.io/Opusdle](https://kajton.github.io/Opusdle/).

## Technologie

React · TypeScript · Vite · abcjs · Web Audio API