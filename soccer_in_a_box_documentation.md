# 📦 Soccer in a Box: La "Razione Militare" del Calcio Formativo

---

## 📄 1. One-Pager Esecutivo

**La Visione**
Il limite del calcio formativo globale oggi non è la mancanza di idee, ma l'impossibilità di eseguirle. Le metodologie dei grandi club o delle federazioni nascono centralizzate ma muoiono in periferia. Soccer in a Box è l'infrastruttura che garantisce un'esecuzione metodologica di alto livello ovunque, da San Marino a Lagos, senza richiedere hardware costoso o connettività. 

**Il Problema**
Oggi l'affiliazione ad un'Academy globale (es. le 60+ della Juventus) prevede l'invio di manuali PDF da centinaia di pagine o l'accesso a portali cloud pesanti. Il risultato? L'allenatore rurale è isolato. Legge (forse) il PDF a casa, lo chiude, va al campo e allena come ha sempre fatto. Per controllare la qualità, il club madre è costretto a inviare fisicamente Head Coach italiani in giro per il mondo. È un modello insostenibile e non scalabile.

**La Soluzione: L'Ecosistema Chiuso**
Soccer in a Box non insegna calcio, *distribuisce il tuo*. È un contenitore operativo (PWA offline-first) che l'allenatore apre a bordo campo su un tablet economico. Dentro c'è solo ciò che serve *oggi*: la tua seduta di allenamento, le tue progressioni didattiche, pre-impostate. Niente da inventare, zero distrazioni. È la "razione militare" del tecnico: essenziale, resistente, pronta all'uso. Gira completamente offline e si sincronizza in background quando torna online.

**Mercato e Target**
*   **Academy Globali dei Club Elite**: Necessità di standardizzare tecnicamente poli distanti migliaia di km riducendo i costi di ispezione fisica.
*   **Federazioni e FIFA Forward**: Strumenti operativi per nazioni calcistiche in via di sviluppo (FSGC San Marino usato come PoC).

**La Differenza (Perché non siamo Coach7 o simili)**
I competitor vendono lavagne tattiche o enormi database di esercizi in abbonamento cloud. Noi forniamo un "binario" chiuso e brandizzato (White-label). Non facciamo concorrenza alla vostra metodologia, la rendiamo scalabile, abbattendo a zero i costi marginali di distribuzione.

---

## 🏗️ 2. Architettura del Prodotto

Cosa trova concretamente l'allenatore quando apre la scatola sul campo? L'architettura è disegnata per eliminare il carico cognitivo. 

### Moduli e Logica di Progressione
1. **Il Binario (Microciclo Guidato)**
   L'app non chiede "Cosa vuoi fare oggi?". L'app dice "Oggi è martedì, la seduta è la #14 incentrata sulla transizione positiva". L'allenatore deve solo premere *Inizia*.
2. **Lo Svolgimento (La Seduta Pratica)**
   L'HUD della singola seduta è diviso in tre blocchi (Attivazione, Fase Centrale, Partita). Per ogni esercitazione sono visibili:
   *   Un diagramma tattico fisso ad alto contrasto (visibile sotto il sole).
   *   Esattamente **3 Punti di Coaching (PDC)** focali definiti dal club madre.
   *   Variabili di difficoltà (Cosa fare se è troppo facile/difficile).
3. **Il Ritorno Orizzontale (Valutazione)**
   Fine seduta. Invece di report prolissi, l'allenatore ha **due slider** o check rapidi in 30 secondi:
   *   *L'esercitazione centrale ha funzionato? (Sì/No/Modificata)*
   *   *Il principio tattico è passato? (Rating 1-5)*
4. **Il Ritorno Verticale (Monitoraggio Giocatori Target)**
   Tracciamento asimmetrico: permette valutazioni rapide (con rating) solo sui "giocatori target" o in prova, integrando i dati direttamente con il modulo Talent Intelligence del club senza richiedere compilazioni lunghe.

---

## 🛠️ 3. Specifiche Tecniche MVP

L'infrastruttura è costruita attorno a un dogma: deve costare quasi zero da deployare e deve tollerare zero banda.

*   **Stack:** HTML5, CSS3, ES6 (Vanilla JS). Nessun React. Nessun Node.js in esecuzione. 
*   **Core Tecnologico:** Progressive Web App (PWA) Offline-First.
*   **Persistenza Locale:** `localStorage` o `IndexedDB` utilizzato come unico database operativo sul campo (salva presenze, note e rating).
*   **Strategia di Rete (Background Sync):**
    *   Al primo avvio, il Service Worker scarica via HTTPs tutto l'applicativo e un file JSON statico (`methodology.json`) contenente i testi e le logiche delle sedute fornite dal club. 
    *   Finito il download (pochi secondi), l'app chiude concettualmente i rubinetti di rete. Sul campo non consuma un byte.
    *   I feedback lasciati dall'allenatore si accodano localmente. Al primo rilevamento di un Access Point Wi-Fi o rete cellulare stabile, un webhook *pusha* uno stringone JSON ai server del client europeo (in modalità "fire and forget").

**Struttura Build (Proto):**
```text
/soccer_in_a_box/
├── index.html            (Shell PWA)
├── soccer_css.css        (HUD tattico ad altissimo contrasto per sole/polvere)
├── soccer_app_js.js      (Logica router, timer, localStorage engine)
├── sw.js                 (Service Worker per caching e offline availability)
├── manifest.json         (Config PWA per renderla app nativa su Android)
└── /assets/methodology.json (Il database read-only delle esercitazioni del club)
```
**Deploy Cost:** 0€ (L'infrastruttura client PWA può essere servita da qualsiasi CDN statica gratis. Il club partner paga solo il proprio endpoint di ricezione webhook).

---

## 🎬 4. Pitch Deck Narrativo (6 Slide)

*Da usare come scheletro per la presentazione a direttori tecnici e capi academy (es. Juventus, Inter, FIFA).*

### Slide 1: Il limite dell'espansione non è l'idea. È l'esecuzione.
*   Le grandi accademie hanno metodologie eccellenti (Bologna, Juventus, Atalanta).
*   Queste idee si perdono quando escono dall'hub centrale europeo.
*   Consegnare manuali di 200 pagine tradotti non significa trasmettere competenza. Significa stampare carta.

### Slide 2: L'isolamento logistico e il controllo di qualità
*   Gli allenatori delle filiali internazionali (Lagos, Jakarta, Sudamerica) non hanno banda larga al campo, né tempo di decifrare PDF complessi.
*   Sul campo, finiscono per allenare come hanno sempre fatto.
*   L'unico modo che ha il club europeo per fare *Quality Control* è l'ispezione fisica costante degli Head coach. È un modello verticalizzato insostenibile per la scala geografica.

### Slide 3: Oltre il software. La Razione Militare.
*   Il mercato offre software per allenatori: gestionali cloud lenti o enormi enormi editor di esercitazioni a costo mensile.
*   *Soccer in a Box* non è un ennesimo software cloud. È un contenitore operativo ermetico fornito all'allenatore. La "Razione militare" del calcio formativo.
*   Dentro c'è solo quello che volete voi: le vostre metodologie, pronte all'uso. Senza opzioni dispersive. Un "binario" esecutivo di allenamento.

### Slide 4: Offline-First e Operatività sul campo
*   Si apre su uno smartphone/tablet Android economico.
*   UI / HUD ad alto contrasto: testata per funzionare sotto la luce diretta del sole africano e con schermi polverosi (bottoni "Fat-fingers").
*   Carica tutto al primo pacchetto. Arrivati al campo, consuma esattamente 0 bytes di dati internet e non va mai in crash di connessione.

### Slide 5: Il Ciclo di Ritorno Dati (Silenzioso ed Essenziale)
*   A fine seduta, in 30 secondi esatti, chiede 3 feedback e rating rapidi (es. "La doppia area ha funzionato?").
*   I dati risiedono silenti nel telefono finché l'allenatore non intercetta un wifi pomeridiano.
*   A quel punto, i dati viaggiano compattati in un array al vostro database in Europa. Monitoraggio settimanale globale, senza viaggiare.

### Slide 6: Time-to-Deploy e Proof of Concept
*   Soccer in a Box non competerà mai con un prodotto come Sportscode, funge da estensione operativa "sul terreno" dove Sportscode non arriva.
*   Integrazione White Label (vostri loghi, vostri colori).
*   Dammi un macrociclo settimanale PDF e lo trasformo in una release Soccer in a Box in 10 giorni. Da deployare su 3 academy pilota domattina a costo marginale zero.
