# ⚽ Soccer in a Box - Razione Militare MVP

**La "Razione Militare" del Calcio Formativo.** Una PWA offline-first progettata per eliminare la dispersione metodologica nelle accademie globali.

## 🎯 Il Problema
I manuali PDF da centinaia di pagine o i complessi portali cloud muoiono in periferia. L'allenatore rurale è isolato, la metodologia del club madre si perde e il controllo di qualità diventa impossibile senza ispezioni fisiche costose.

## 🚀 La Soluzione
Soccer in a Box è un **binario operativo** chiuso. Non è un database di esercizi, ma un toolkit esecutivo:
- **Microciclo Guidato**: L'app carica automaticamente la seduta programmata (es. Seduta #14).
- **HUD Tattico**: Interfaccia ad alto contrasto, testata per la polvere e il sole, con Coaching Points (PDC) chiari e fissi.
- **Ritorno Rapido**: Feedback di fine seduta in 30 secondi (3 domande + Talent ID asimmetrico).
- **Offline-First**: Consumo dati 0 bytes al campo. Sincronizzazione automatica via Webhook appena torna il segnale.

## 📁 Struttura del Progetto
- `index.html`: L'interfaccia HUD principale (PWA Shell).
- `soccer_pitch_mobile.html`: Presentazione premium swipeable per WhatsApp/Pitch.
- `assets/methodology.json`: Il database delle sedute fornito dal club.
- `soccer_app_js.js`: Motore logico e gestione feedback.
- `soccer_sw.js`: Service Worker per la persistenza offline totale.
- `soccer_css.css`: Stili HUD "Military Grade".

## 🛠️ Deploy su GitHub Pages

Per rendere l'app subito operativa e installabile sul tuo smartphone:

1. **Inizializza la Repo locale:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Soccer in a Box Military Ration"
   git branch -M main
   ```

2. **Collega a GitHub:**
   (Sostituisci `mtornani` con il tuo username se diverso)
   ```bash
   git remote add origin https://github.com/mtornani/SoccerInABox.git
   git push -u origin main
   ```

3. **Attiva il Hosting:**
   - Su GitHub, vai in **Settings** -> **Pages**.
   - Sotto **Build and deployment**, imposta Source a **"Deploy from a branch"**.
   - Seleziona il branch **main** e la cartella **/(root)**.
   - Clicca **Save**.

4. **Accedi all'app:**
   L'app sarà disponibile tra pochi minuti su `https://mtornani.github.io/SoccerInABox/`.

## 📱 Installazione su Mobile
1. Apri l'URL sul tuo browser Android (Chrome consigliato).
2. Seleziona **"Aggiungi alla schermata Home"** dal menu del browser.
3. L'app apparirà come un'applicazione nativa, pronta per il campo.

---
*Developed for Global Academies & Rural Football Contexts.*
