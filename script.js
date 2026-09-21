document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       CARROSSEL DE SEGUROS
    ========================================== */

    const insuranceCarousel = document.querySelector(".insurance-carousel");
    const insuranceTrack = document.querySelector(".insurance-track");
    const insuranceCards = document.querySelectorAll(".insurance-card");
    const insuranceDots = document.querySelector(".carousel-dots");
    const insurancePrev = document.querySelector(".carousel-prev");
    const insuranceNext = document.querySelector(".carousel-next");

    if (
        insuranceCarousel &&
        insuranceTrack &&
        insuranceCards.length > 0 &&
        insuranceDots &&
        insurancePrev &&
        insuranceNext
    ) {

        let currentPage = 0;

        function getCardsPerPage() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        }

        function getTotalPages() {
            return Math.ceil(insuranceCards.length / getCardsPerPage());
        }

        function createDots() {

            insuranceDots.innerHTML = "";

            const totalPages = getTotalPages();

            for (let i = 0; i < totalPages; i++) {

                const dot = document.createElement("button");

                dot.type = "button";
                dot.classList.add("carousel-dot");

                dot.setAttribute("aria-label", `Ir para página ${i + 1}`);

                if (i === currentPage) {
                    dot.classList.add("active");
                }

                dot.addEventListener("click", () => {
                    currentPage = i;
                    updateInsuranceCarousel();
                });

                insuranceDots.appendChild(dot);
            }
        }

        function updateInsuranceCarousel() {

            const cardsPerPage = getCardsPerPage();

            if (insuranceCards.length === 0) return;

            const cardWidth = insuranceCards[0].getBoundingClientRect().width;

            const trackStyle = window.getComputedStyle(insuranceTrack);
            const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 22;

            const moveAmount = (cardWidth + gap) * cardsPerPage * currentPage;

            insuranceTrack.style.transform = `translateX(-${moveAmount}px)`;

            insurancePrev.disabled = currentPage === 0;
            insuranceNext.disabled = currentPage >= getTotalPages() - 1;

            const dots = insuranceDots.querySelectorAll(".carousel-dot");

            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentPage);
            });
        }

        // Event listeners adicionados UMA vez
        insurancePrev.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                updateInsuranceCarousel();
            }
        });

        insuranceNext.addEventListener("click", () => {
            if (currentPage < getTotalPages() - 1) {
                currentPage++;
                updateInsuranceCarousel();
            }
        });

        // Inicializa
        createDots();
        updateInsuranceCarousel();

        // Redimensionamento
        window.addEventListener("resize", () => {

            const totalPages = getTotalPages();

            if (currentPage >= totalPages) {
                currentPage = Math.max(0, totalPages - 1);
            }

            createDots();
            updateInsuranceCarousel();
        });
    }


    /* ==========================================
       ANO AUTOMÁTICO DO FOOTER
    ========================================== */

    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ==========================================
   FORMULÁRIO DE CONTATO
   Envia nome, e-mail e mensagem para o e-mail
   do corretor via Formspree.
========================================== */

    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {

        // ⚠️ SUBSTITUA pelo seu endpoint do Formspree
        // Exemplo: "https://formspree.io/f/xabcdefg"
        const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpbqgpo";

        // Para onde enviar (usado apenas como fallback via mailto)
        const CORRETOR_EMAIL = "vendas@hadera.com.br";

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const submitBtnOriginalHTML = submitBtn ? submitBtn.innerHTML : "";

        // Cria elemento de feedback (sucesso/erro) se não existir
        let feedback = contactForm.querySelector(".form-feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "form-feedback";
            contactForm.appendChild(feedback);
        }

        function showFeedback(message, type) {
            feedback.textContent = message;
            feedback.classList.remove("success", "error");
            feedback.classList.add("visible", type);
        }

        function hideFeedback() {
            feedback.classList.remove("visible", "success", "error");
        }

        contactForm.addEventListener("submit", async (event) => {

            event.preventDefault();
            hideFeedback();

            const nomeInput = contactForm.querySelector("#nome");
            const emailInput = contactForm.querySelector("#email");
            const mensagemInput = contactForm.querySelector("#mensagem");

            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const mensagem = mensagemInput.value.trim();

            // Validações
            if (!nome || !email || !mensagem) {
                showFeedback("Por favor, preencha todos os campos.", "error");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback("Digite um e-mail válido.", "error");
                emailInput.focus();
                return;
            }

            // Estado de carregamento
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = "Enviando...";
            }

            try {

                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome: nome,
                        email: email,
                        mensagem: mensagem,
                        _subject: `Nova mensagem do site — ${nome}`
                    })
                });

                if (response.ok) {
                    showFeedback(
                        "Mensagem enviada! Entraremos em contato em breve.",
                        "success"
                    );
                    contactForm.reset();
                } else {
                    const data = await response.json().catch(() => ({}));
                    const msg = data?.errors?.[0]?.message
                        || "Não foi possível enviar. Tente novamente.";
                    showFeedback(msg, "error");
                }

            } catch (error) {
                // Fallback: abre o cliente de e-mail com tudo preenchido
                const subject = encodeURIComponent(`Contato pelo site — ${nome}`);
                const body = encodeURIComponent(
                    `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`
                );

                showFeedback(
                    "Sem conexão. Abrindo seu e-mail para enviar a mensagem...",
                    "error"
                );

                window.location.href = `mailto:${CORRETOR_EMAIL}?subject=${subject}&body=${body}`;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtnOriginalHTML;
                }
            }

        });
    }

    /* ==========================================
       LINKS DE WHATSAPP GENÉRICOS
    ========================================== */

    const whatsappLinks = document.querySelectorAll(".whatsapp-link");
    const whatsappNumber = "5511959400172";
    const defaultMessage = "Olá! Gostaria de falar com um consultor da Hadera.";

    whatsappLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

            window.open(whatsappURL, "_blank");
        });
    });


    /* ==========================================
       CARROSSEL DE AVALIAÇÕES
    ========================================== */

    (function () {

        const track = document.getElementById("reviews-track");
        const prevBtn = document.getElementById("reviews-prev");
        const nextBtn = document.getElementById("reviews-next");

        if (!track || !prevBtn || !nextBtn) return;

        let currentIndex = 0;

        function getVisibleCount() {
            const w = window.innerWidth;
            if (w <= 600) return 1;
            if (w <= 1000) return 2;
            return 3;
        }

        function getCardStep() {
            const card = track.querySelector(".review-card");
            if (!card) return 0;

            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.columnGap || style.gap) || 24;

            return card.offsetWidth + gap;
        }

        function getMaxIndex() {
            const total = track.children.length;
            const visible = getVisibleCount();

            return Math.max(0, total - visible);
        }

        function update() {

            const maxIndex = getMaxIndex();

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const step = getCardStep();

            track.style.transform = `translateX(-${currentIndex * step}px)`;

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }

        prevBtn.addEventListener("click", () => {
            currentIndex--;
            update();
        });

        nextBtn.addEventListener("click", () => {
            currentIndex++;
            update();
        });

        // Impede que o clique abra o link caso o usuário esteja arrastando
        let isDown = false;
        let startX = 0;
        let moved = false;

        track.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.clientX;
            moved = false;
        });

        track.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            if (Math.abs(e.clientX - startX) > 6) moved = true;
        });

        document.addEventListener("mouseup", () => {
            isDown = false;
        });

        track.addEventListener("click", (e) => {
            if (moved) {
                e.preventDefault();
                moved = false;
            }
        });

        window.addEventListener("resize", () => {
            currentIndex = Math.min(currentIndex, getMaxIndex());
            update();
        });

        update();

    })();


    /* ==========================================
       CARROSSEL DE OPERADORAS
       (o loop infinito é feito via CSS,
        mas garantimos a pausa no hover
        caso o navegador não suporte)
    ========================================== */

    const operadorasTrack = document.querySelector(".carousel-track-operadoras");

    if (operadorasTrack) {

        // Pausa ao passar o mouse (fallback caso o CSS não aplique)
        operadorasTrack.addEventListener("mouseenter", () => {
            operadorasTrack.style.animationPlayState = "paused";
        });

        operadorasTrack.addEventListener("mouseleave", () => {
            operadorasTrack.style.animationPlayState = "running";
        });

        // Suporte a toque (mobile)
        operadorasTrack.addEventListener("touchstart", () => {
            operadorasTrack.style.animationPlayState = "paused";
        }, { passive: true });

        operadorasTrack.addEventListener("touchend", () => {
            operadorasTrack.style.animationPlayState = "running";
        }, { passive: true });
    }

});

/* ==========================================
   SELEÇÃO AUTOMÁTICA DO TEXTO PADRÃO
   (ao focar, o texto pré-preenchido fica selecionado)
========================================== */

const mensagemField = document.querySelector("#mensagem");

if (mensagemField) {

    // Texto padrão que serve de "modelo"
    const textoPadrao = mensagemField.value.trim();

    mensagemField.addEventListener("focus", () => {
        // Só seleciona se o usuário ainda não tiver mexido no texto
        if (mensagemField.value.trim() === textoPadrao) {
            mensagemField.select();
        }
    });
}