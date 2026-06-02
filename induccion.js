/* 
========================================================================
   INDUCCIÓN HES CONTRATISTAS - SIERRACOL ENERGY
   LÓGICA DE INTERACTIVIDAD, NAVEGACIÓN Y EVALUACIÓN
========================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    // --- Variables de Estado ---
    let currentSlide = 0;
    let maxUnlockedSlide = 0; // Por defecto solo el módulo 1 (índice 0) está desbloqueado
    const totalSlides = 11;

    // --- Datos de la Evaluación (Quiz) ---
    const quizQuestions = [
        {
            question: "¿Cuál es el significado e implicación de la \"Autoridad de Parada\" (SWA - Stop Work Authority) en SierraCol Energy?",
            options: [
                "Es un derecho que solo se puede ejercer si el supervisor del área lo autoriza por escrito de antemano.",
                "Es el derecho, deber y responsabilidad de detener cualquier actividad insegura sin temor a represalias, con el total respaldo de la compañía.",
                "Es una sanción disciplinaria severa que se aplica a los contratistas que cometen actos inseguros."
            ],
            correct: 1,
            feedback: "¡Correcto! En SierraCol Energy, la seguridad es primero. Tienes la autoridad y el deber de detener trabajos que consideres inseguros; serás respaldado sin ninguna consecuencia negativa."
        },
        {
            question: "Antes de intervenir cualquier equipo o maquinaria con potencial de liberación de energía, ¿qué procedimiento de seguridad estándar se debe aplicar obligatoriamente?",
            options: [
                "Usar arnés de seguridad certificado con absorbedor de choque.",
                "Realizar el procedimiento de Aislamiento de Energía, Bloqueo y Etiquetado (LOTO).",
                "Monitorear la velocidad de los vientos y contar con un extintor de incendios a la mano."
            ],
            correct: 1,
            feedback: "¡Correcto! El aislamiento de energía mediante bloqueo y etiquetado (LOTO) previene la energización accidental y protege la vida de quien interviene el equipo."
        },
        {
            question: "Si en tu área de trabajo encuentras un derrame de aceite en el suelo con potencial de causar que una persona se caiga, ¿cuál es el peligro y cuál es el riesgo?",
            options: [
                "El peligro es la fractura o golpe recibido y el riesgo es el aceite en el suelo.",
                "El peligro es el aceite en el suelo (fuente/situación) y el riesgo es la probabilidad de resbalar, caer y sufrir una lesión.",
                "El peligro y el riesgo significan exactamente lo mismo bajo la metodología ART."
            ],
            correct: 1,
            feedback: "¡Excelente! El peligro es la fuente o situación (el derrame de aceite en el suelo) y el riesgo es la probabilidad de que se materialice un accidente (resbalar, caer) y sus consecuencias (lesión)."
        },
        {
            question: "Si escuchas una señal sonora de alarma CONTINUA en la locación de trabajo, ¿cuál debe ser tu acción inmediata?",
            options: [
                "Suspender actividades de forma segura, dirigirte ordenadamente por los senderos peatonales de evacuación hacia el Punto de Encuentro.",
                "Mantener el puesto de trabajo y esperar a que el supervisor confirme por radio si es una emergencia real o un simulacro.",
                "Correr rápidamente y de forma inmediata hacia las oficinas administrativas para saber qué está sucediendo."
            ],
            correct: 0,
            feedback: "¡Correcto! Una alarma continua indica evacuación inmediata. Debes suspender tus labores, conservar la calma y evacuar por las rutas señalizadas hacia el punto de encuentro asignado."
        },
        {
            question: "De acuerdo con el código de colores de clasificación de residuos, ¿en qué recipiente se deben depositar los trapos impregnados de aceite y filtros de aire usados?",
            options: [
                "En el recipiente blanco (Residuos aprovechables).",
                "En el recipiente rojo (Residuos peligrosos e industriales).",
                "En el recipiente negro (Residuos no aprovechables)."
            ],
            correct: 1,
            feedback: "¡Correcto! Los elementos impregnados de hidrocarburos, químicos, pilas o elementos de salud ocupacional contaminados son considerados residuos peligrosos y se disponen en el recipiente de color rojo."
        }
    ];

    let currentQuestionIndex = 0;
    let quizScore = 0;
    let selectedOptionIndex = null;
    let isQuestionAnswered = false;

    // --- Referencias de Elementos HTML ---
    const sidebarMenuItems = document.querySelectorAll("#sidebar-menu .menu-item");
    const slides = document.querySelectorAll(".slide-content");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    
    // Elementos del Quiz
    const quizIntro = document.getElementById("quiz-intro");
    const quizQuestionContainer = document.getElementById("quiz-question-container");
    const quizResults = document.getElementById("quiz-results");
    const quizQuestionTitle = document.getElementById("quiz-question-title");
    const quizOptionsList = document.getElementById("quiz-options-list");
    const quizFeedbackBox = document.getElementById("quiz-feedback-box");
    const btnSubmitAnswer = document.getElementById("btn-submit-answer");
    const quizProgressText = document.getElementById("quiz-progress-text");
    const quizProgressBar = document.getElementById("quiz-progress-bar");
    const resultScoreCircle = document.getElementById("result-score-circle");
    const resultTitle = document.getElementById("result-title");
    const resultMessage = document.getElementById("result-message");
    const successBlock = document.getElementById("success-block");
    const failBlock = document.getElementById("fail-block");
    const studentNameInput = document.getElementById("student-name");
    const certDisplayName = document.getElementById("cert-display-name");
    const certDate = document.getElementById("cert-date");

    // --- Carga Inicial de Progreso (LocalStorage) ---
    function loadProgress() {
        const savedSlide = localStorage.getItem("sierracol_ind_current");
        const savedMaxUnlocked = localStorage.getItem("sierracol_ind_max_unlocked");

        if (savedMaxUnlocked !== null) {
            maxUnlockedSlide = parseInt(savedMaxUnlocked, 10);
        }
        if (savedSlide !== null) {
            currentSlide = parseInt(savedSlide, 10);
            // Evitar desbordamiento
            if (currentSlide >= totalSlides) currentSlide = 0;
            // Asegurar que el slide guardado no exceda el desbloqueado por seguridad
            if (currentSlide > maxUnlockedSlide) {
                currentSlide = maxUnlockedSlide;
            }
        }
    }

    // --- Guardado de Progreso ---
    function saveProgress() {
        localStorage.setItem("sierracol_ind_current", currentSlide);
        localStorage.setItem("sierracol_ind_max_unlocked", maxUnlockedSlide);
    }

    // --- Actualización de la Interfaz General (Navegación e Indicadores) ---
    function updateUI() {
        // 1. Mostrar/Ocultar Diapositivas
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        // 2. Actualizar Barra de Menú Lateral
        sidebarMenuItems.forEach((item, idx) => {
            // Activo
            if (idx === currentSlide) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }

            // Desbloqueado / Bloqueado
            if (idx <= maxUnlockedSlide) {
                item.classList.remove("locked");
            } else {
                item.classList.add("locked");
            }

            // Completado (los anteriores al actual o si ya se pasó el curso)
            if (idx < maxUnlockedSlide || (maxUnlockedSlide === 10 && idx === 10 && localStorage.getItem("sierracol_ind_passed") === "true")) {
                item.classList.add("completed");
            } else {
                item.classList.remove("completed");
            }
        });

        // 3. Actualizar Progreso de Barra Superior
        const progressPercent = Math.round(((currentSlide + 1) / totalSlides) * 100);
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${progressPercent}% completado`;
    }

    // --- Cambiar de Pestaña Secundaria ---
    window.switchSubTab = function(event, tabId) {
        if (event) event.preventDefault();

        // Obtener el slide contenedor actual
        const currentSlideEl = event.currentTarget.closest(".slide-content");
        if (!currentSlideEl) return;

        // Remover clase activa solo de los botones de pestañas dentro de este slide
        const tabButtons = currentSlideEl.querySelectorAll(".slide-tabs .tab-btn");
        tabButtons.forEach(btn => btn.classList.remove("active"));

        // Añadir clase activa al botón pulsado
        event.currentTarget.classList.add("active");

        // Ocultar solo los paneles de pestañas dentro de este slide
        const tabPanels = currentSlideEl.querySelectorAll(".tab-panel");
        tabPanels.forEach(panel => panel.classList.remove("active"));

        // Mostrar el panel de pestañas objetivo
        const targetPanel = currentSlideEl.querySelector(`#${tabId}`);
        if (targetPanel) targetPanel.classList.add("active");
    };

    // --- Control de Acordeón interactivo (Módulo 5) ---
    window.toggleAccordion = function(button) {
        const item = button.parentElement;
        const isActive = item.classList.contains("active");
        
        // Cierra todos los items del acordeón en este slide
        const accordion = item.parentElement;
        const allItems = accordion.querySelectorAll(".accordion-item");
        allItems.forEach(i => {
            i.classList.remove("active");
            const content = i.querySelector(".accordion-content");
            if (content) content.style.display = "none";
        });
        
        // Si no estaba activo, lo abre
        if (!isActive) {
            item.classList.add("active");
            const content = item.querySelector(".accordion-content");
            if (content) content.style.display = "block";
        }
    };

    // --- Cambiar de Diapositiva ---
    window.goToSlide = function(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Impedir saltar a slides bloqueados
        if (index > maxUnlockedSlide) return;

        currentSlide = index;
        saveProgress();
        updateUI();

        // Si entramos al módulo 11 (índice 10) y ya se aprobó previamente, recargar la pantalla del certificado
        if (currentSlide === 10) {
            checkExistingApproval();
        }
    };

    window.nextSlide = function() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            
            // Si avanzamos a un slide no visitado previamente, lo desbloqueamos
            if (currentSlide > maxUnlockedSlide) {
                maxUnlockedSlide = currentSlide;
            }
            
            saveProgress();
            updateUI();
        }
    };

    window.prevSlide = function() {
        if (currentSlide > 0) {
            currentSlide--;
            saveProgress();
            updateUI();
        }
    };

    // Registrar clicks directos en la barra lateral
    sidebarMenuItems.forEach((item, idx) => {
        item.addEventListener("click", () => {
            goToSlide(idx);
        });
    });

    // --- LÓGICA DE LA EVALUACIÓN (QUIZ) ---
    
    window.startQuiz = function() {
        quizIntro.style.display = "none";
        quizQuestionContainer.style.display = "block";
        quizResults.style.display = "none";
        
        currentQuestionIndex = 0;
        quizScore = 0;
        loadQuizQuestion();
    };

    function loadQuizQuestion() {
        isQuestionAnswered = false;
        selectedOptionIndex = null;
        btnSubmitAnswer.disabled = true;
        btnSubmitAnswer.innerHTML = 'Validar Respuesta <i class="fa-solid fa-circle-check"></i>';
        quizFeedbackBox.style.display = "none";

        const q = quizQuestions[currentQuestionIndex];
        
        // Actualizar Cabecera de Progreso del Quiz
        quizProgressText.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
        const qPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        quizProgressBar.style.width = `${qPercent}%`;

        // Renderizar Pregunta
        quizQuestionTitle.textContent = q.question;

        // Renderizar Opciones
        quizOptionsList.innerHTML = "";
        q.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "quiz-opt-btn";
            btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65 + idx)})</span> ${opt}`;
            btn.addEventListener("click", () => {
                if (isQuestionAnswered) return;
                selectOption(idx);
            });
            quizOptionsList.appendChild(btn);
        });
    }

    function selectOption(index) {
        selectedOptionIndex = index;
        
        // Quitar seleccionada de otras opciones
        const btns = quizOptionsList.querySelectorAll(".quiz-opt-btn");
        btns.forEach((btn, idx) => {
            if (idx === index) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });

        // Activar botón de validación
        btnSubmitAnswer.disabled = false;
    }

    window.submitAnswer = function() {
        const q = quizQuestions[currentQuestionIndex];
        const btns = quizOptionsList.querySelectorAll(".quiz-opt-btn");

        if (!isQuestionAnswered) {
            // --- FASE 1: VALIDAR RESPUESTA ---
            isQuestionAnswered = true;

            // Bloquear cambios y hover de opciones
            btns.forEach(btn => btn.classList.add("disabled"));

            if (selectedOptionIndex === q.correct) {
                // Correcta
                btns[selectedOptionIndex].classList.remove("selected");
                btns[selectedOptionIndex].classList.add("correct");
                
                quizFeedbackBox.className = "quiz-feedback correct-feedback";
                quizFeedbackBox.innerHTML = `<strong><i class="fa-solid fa-circle-check"></i> ¡Respuesta Correcta!</strong><br>${q.feedback}`;
                quizScore++;
            } else {
                // Incorrecta
                btns[selectedOptionIndex].classList.remove("selected");
                btns[selectedOptionIndex].classList.add("incorrect");
                btns[q.correct].classList.add("correct"); // Mostrar cuál era la correcta
                
                quizFeedbackBox.className = "quiz-feedback incorrect-feedback";
                quizFeedbackBox.innerHTML = `<strong><i class="fa-solid fa-circle-xmark"></i> Respuesta Incorrecta</strong><br>${q.feedback}`;
            }

            quizFeedbackBox.style.display = "block";

            // Cambiar el botón para pasar de pregunta
            if (currentQuestionIndex === quizQuestions.length - 1) {
                btnSubmitAnswer.innerHTML = 'Ver Resultados <i class="fa-solid fa-chart-simple"></i>';
            } else {
                btnSubmitAnswer.innerHTML = 'Siguiente Pregunta <i class="fa-solid fa-arrow-right"></i>';
            }
        } else {
            // --- FASE 2: AVANZAR A SIGUIENTE PREGUNTA ---
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                loadQuizQuestion();
            } else {
                showQuizResults();
            }
        }
    };

    function showQuizResults() {
        quizQuestionContainer.style.display = "none";
        quizResults.style.display = "block";

        resultScoreCircle.textContent = `${quizScore}/${quizQuestions.length}`;
        const minPassScore = Math.ceil(quizQuestions.length * 0.8); // 80% es 4 de 5

        if (quizScore >= minPassScore) {
            // --- APROBADO ---
            resultScoreCircle.classList.remove("fail");
            resultTitle.textContent = "¡Felicitaciones! Has aprobado";
            resultTitle.style.color = "#2e7d32";
            resultMessage.innerHTML = `Completaste satisfactoriamente la evaluación de inducción HES con una calificación del <strong>${(quizScore/quizQuestions.length)*100}%</strong>.<br>Escribe tu nombre a continuación para expedir tu certificado oficial de inducción.`;
            
            successBlock.style.display = "block";
            failBlock.style.display = "none";

            // Guardar aprobación en local storage
            localStorage.setItem("sierracol_ind_passed", "true");
            localStorage.setItem("sierracol_ind_score", quizScore);
            
            // Establecer fecha actual
            setCertificateDate();
            
            // Agregar checkmark de completado definitivo a la barra lateral
            updateUI();
        } else {
            // --- REPROBADO ---
            resultScoreCircle.classList.add("fail");
            resultTitle.textContent = "Evaluación No Aprobada";
            resultTitle.style.color = "rgb(115, 0, 0)";
            resultMessage.innerHTML = `Tu puntaje fue de <strong>${(quizScore/quizQuestions.length)*100}%</strong>, el cual es inferior al mínimo requerido (80%).<br>Por favor repasa los conceptos de los módulos e inténtalo de nuevo.`;
            
            successBlock.style.display = "none";
            failBlock.style.display = "block";
        }
    }

    function checkExistingApproval() {
        const isPassed = localStorage.getItem("sierracol_ind_passed");
        const savedScore = localStorage.getItem("sierracol_ind_score");
        
        if (isPassed === "true") {
            quizIntro.style.display = "none";
            quizQuestionContainer.style.display = "none";
            quizResults.style.display = "block";
            
            quizScore = parseInt(savedScore, 10) || 5;
            resultScoreCircle.textContent = `${quizScore}/${quizQuestions.length}`;
            resultScoreCircle.classList.remove("fail");
            resultTitle.textContent = "¡Inducción Completada!";
            resultTitle.style.color = "#2e7d32";
            resultMessage.innerHTML = `Ya has aprobado previamente esta evaluación de inducción HES.<br>Puedes reimprimir o actualizar tu certificado a continuación.`;
            
            successBlock.style.display = "block";
            failBlock.style.display = "none";
            
            setCertificateDate();
            
            // Restaurar nombre si estaba guardado en input anteriormente
            const savedName = localStorage.getItem("sierracol_ind_name");
            if (savedName) {
                studentNameInput.value = savedName;
                certDisplayName.textContent = savedName;
            }
        }
    }

    function setCertificateDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        certDate.textContent = today.toLocaleDateString('es-ES', options);
    }

    // --- Actualización de Nombre en Vivo en el Certificado ---
    window.updateCertificateName = function() {
        const nameVal = studentNameInput.value.trim();
        if (nameVal !== "") {
            certDisplayName.textContent = nameVal;
            localStorage.setItem("sierracol_ind_name", nameVal);
        } else {
            certDisplayName.textContent = "TU NOMBRE COMPLETO";
            localStorage.removeItem("sierracol_ind_name");
        }
    };

    // --- Imprimir Certificado ---
    window.printCertificate = function() {
        const nameVal = studentNameInput.value.trim();
        if (nameVal === "") {
            alert("Por favor, ingresa tu nombre completo antes de imprimir o guardar el certificado.");
            studentNameInput.focus();
            return;
        }
        window.print();
    };

    // --- Reintentar el Quiz ---
    window.restartQuiz = function() {
        quizIntro.style.display = "block";
        quizQuestionContainer.style.display = "none";
        quizResults.style.display = "none";
    };

    // --- Inicialización Ejecución ---
    loadProgress();
    updateUI();
});
