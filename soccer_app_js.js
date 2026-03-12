// Soccer in a Box - Military Ration MVP Core Logic
class SoccerInABox {
    constructor() {
        this.sessionData = null;
        this.feedback = {
            evalCentralPhase: '',
            evalPrinciple: 0,
            targetPlayers: []
        };
        this.init();
    }

    async init() {
        console.log('🚀 Soccer in a Box: Unit Initializing...');
        this.setupDOMReferences();
        this.setupEventListeners();
        
        // Simula ritardo sincronizzazione "Razione"
        setTimeout(async () => {
            await this.loadMethodology();
        }, 1500);
    }

    setupDOMReferences() {
        this.loader = document.getElementById('loader');
        this.header = document.getElementById('mainHeader');
        this.content = document.getElementById('sessionContent');
        this.feedbackModal = document.getElementById('feedbackModal');
        this.sessionTitle = document.getElementById('sessionTitle');
        this.sessionAge = document.getElementById('sessionAge');
        this.sessionDuration = document.getElementById('sessionDuration');
    }

    setupEventListeners() {
        // Gestione Rating Semplificata (1-5)
        document.querySelectorAll('.rating-simple .val-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = e.target.dataset.val;
                const parent = e.target.parentElement;
                const targetInputId = parent.dataset.target;
                
                // UI update
                parent.querySelectorAll('.val-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Data update
                document.getElementById(targetInputId).value = val;
                this.feedback.evalPrinciple = parseInt(val);
            });
        });

        // Form Submission
        document.getElementById('feedbackForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.syncData();
        });
    }

    async loadMethodology() {
        try {
            const response = await fetch('./assets/methodology.json');
            if (!response.ok) throw new Error('Methodology not found');
            
            const data = await response.json();
            this.sessionData = data.session;
            this.renderSession();
            
            // Show UI
            this.loader.classList.add('hidden');
            this.header.classList.remove('hidden');
            this.content.classList.remove('hidden');
        } catch (error) {
            console.error('❌ Sync Error:', error);
            document.querySelector('#loader p').textContent = "Errore Sincronizzazione. Riprova più tardi.";
        }
    }

    renderSession() {
        const s = this.sessionData;
        this.sessionTitle.textContent = s.title;
        this.sessionAge.textContent = `Target: ${s.target_age}`;
        this.sessionDuration.textContent = `Durata: ${s.duration_minutes}m`;

        this.content.innerHTML = ''; // Clear

        s.phases.forEach((phase, index) => {
            const phaseCard = document.createElement('section');
            phaseCard.className = 'card phase-card';
            
            const coachingPointsHtml = phase.coaching_points.map(cp => `<li>${cp}</li>`).join('');
            const variantsHtml = phase.difficulty_variants.easier ? `
                <div class="variants">
                    <div class="variant easier"><span>-</span> ${phase.difficulty_variants.easier}</div>
                    <div class="variant harder"><span>+</span> ${phase.difficulty_variants.harder}</div>
                </div>
            ` : '';

            phaseCard.innerHTML = `
                <div class="phase-header">
                    <span class="phase-num">${index + 1}</span>
                    <h3>${phase.title}</h3>
                    <span class="phase-duration">${phase.duration}'</span>
                </div>
                <div class="phase-body">
                    <div class="diagram-placeholder">
                        <div class="diagram-label">DIAGRAMMA TATTICO</div>
                        <p>${phase.diagram_placeholder}</p>
                    </div>
                    <div class="coaching-points">
                        <h4>PUNTI DI COACHING (PDC):</h4>
                        <ul>${coachingPointsHtml}</ul>
                    </div>
                    ${variantsHtml}
                </div>
            `;
            this.content.appendChild(phaseCard);
        });

        // Add Finish Button
        const finishContainer = document.createElement('div');
        finishContainer.className = 'finish-container';
        finishContainer.innerHTML = `<button class="btn-primary w-100" onclick="soccerApp.showFeedback()">TERMINA SEDUTA E GENERA REPORT</button>`;
        this.content.appendChild(finishContainer);
    }

    showFeedback() {
        window.scrollTo(0, 0);
        this.feedbackModal.classList.remove('hidden');
    }

    addTargetPlayerRow() {
        const container = document.getElementById('extraPlayers');
        const row = document.createElement('div');
        row.className = 'target-player-row';
        row.innerHTML = `
            <input type="text" placeholder="Nome Giocatore" class="player-name-input">
            <select class="player-rating-input">
                <option value="">Voto...</option>
                <option value="A">A (Eccellente)</option>
                <option value="B">B (In Linea)</option>
                <option value="C">C (Da Rivedere)</option>
            </select>
        `;
        container.appendChild(row);
    }

    async syncData() {
        const btn = document.querySelector('#feedbackForm button');
        const originalText = btn.textContent;
        
        btn.disabled = true;
        btn.textContent = '📦 CIFRATURA E SYNC...';

        // Raccogli dati giocatori target
        const playerRows = document.querySelectorAll('.target-player-row');
        this.feedback.targetPlayers = [];
        playerRows.forEach(row => {
            const name = row.querySelector('.player-name-input').value;
            const rating = row.querySelector('.player-rating-input').value;
            if (name || rating) {
                this.feedback.targetPlayers.push({ name, rating });
            }
        });

        this.feedback.evalCentralPhase = document.getElementById('evalCentralPhase').value;

        const payload = {
            sessionId: this.sessionData.id,
            timestamp: new Date().toISOString(),
            feedback: this.feedback
        };

        console.log('📡 Webhook Payload Prepared:', payload);
        
        // Simulazione persistenza offline
        localStorage.setItem(`session_feedback_${payload.sessionId}`, JSON.stringify(payload));

        setTimeout(() => {
            btn.textContent = '✅ SINCRONIZZATO CON SUCCESSO';
            setTimeout(() => {
                alert('Dati inviati al Quartier Generale. Bravo Coach. Riposa.');
                location.reload();
            }, 1000);
        }, 2000);
    }
}

// Inizializzazione rapida
document.addEventListener('DOMContentLoaded', () => {
    window.soccerApp = new SoccerInABox();
});