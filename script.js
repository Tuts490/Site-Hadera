document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ANO AUTOMÁTICO DO FOOTER
    ========================================== */

    const currentYear = document.querySelector("#current-year");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ==========================================
   FUNÇÃO GENÉRICA DE DRAG
   Clique limpo → link abre normal.
   Arraste real  → desliza e suprime clique fantasma.
========================================== */

    function enableDrag({ track, getIndex, setIndex, getStep, getMaxIndex, onChange }) {

        let isDown = false;
        let didDrag = false;
        let startX = 0;
        let startTranslate = 0;
        let lastTranslate = 0;

        function getTranslate() {
            const tr = window.getComputedStyle(track).transform;
            if (!tr || tr === "none") return 0;
            const m = tr.match(/matrix\(([^)]+)\)/);
            return m ? parseFloat(m[1].split(",")[4]) || 0 : 0;
        }

        function onMove(e) {
            if (!isDown) return;

            const diff = e.clientX - startX;

            // Só considera drag depois de 10px
            if (!didDrag) {
                if (Math.abs(diff) < 10) return;
                didDrag = true;
                track.style.transition = "none";
            }

            let next = startTranslate + diff;

            const minT = -getMaxIndex() * getStep();
            const maxT = 0;

            if (next > maxT) {
                next = maxT + (next - maxT) * 0.35;
            } else if (next < minT) {
                next = minT + (next - minT) * 0.35;
            }

            lastTranslate = next;
            track.style.transform = `translateX(${next}px)`;
        }

        function onUp() {
            if (!isDown) return;
            isDown = false;

            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
            document.removeEventListener("pointercancel", onUp);

            // Clique limpo: não faz nada, deixa o link funcionar
            if (!didDrag) {
                didDrag = false;
                return;
            }

            didDrag = false;

            const step = getStep();
            const diff = lastTranslate - startTranslate;
            const steps = Math.round(-diff / step);

            let newIndex = getIndex() + steps;
            newIndex = Math.max(0, Math.min(getMaxIndex(), newIndex));

            setIndex(newIndex);
            track.style.transition = "";
            onChange();

            // Suprime o próximo clique (que o navegador dispara após o arraste)
            const suppressClick = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                ev.stopImmediatePropagation();
            };

            track.addEventListener("click", suppressClick, { capture: true, once: true });

            // Failsafe: se o clique nunca vier, remove o listener depois
            setTimeout(() => {
                track.removeEventListener("click", suppressClick, { capture: true });
            }, 350);
        }

        track.addEventListener("pointerdown", (e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;

            isDown = true;
            didDrag = false;
            startX = e.clientX;
            startTranslate = getTranslate();
            lastTranslate = startTranslate;

            document.addEventListener("pointermove", onMove);
            document.addEventListener("pointerup", onUp);
            document.addEventListener("pointercancel", onUp);
        });

        // Bloqueia o drag nativo do navegador em links/imagens
        track.addEventListener("dragstart", (e) => e.preventDefault());
    }


    /* ==========================================
       CARROSSEL DE SEGUROS
    ========================================== */

    const insuranceTrack = document.querySelector(".insurance-track");
    const insuranceCards = document.querySelectorAll(".insurance-card");
    const insuranceDots = document.querySelector(".carousel-dots");

    if (insuranceTrack && insuranceCards.length > 0 && insuranceDots) {

        let currentPage = 0;

        const getCardsPerPage = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        };

        const getTotalPages = () => Math.ceil(insuranceCards.length / getCardsPerPage());

        const getGap = () => {
            const st = window.getComputedStyle(insuranceTrack);
            return parseFloat(st.columnGap || st.gap) || 22;
        };

        const getStep = () => {
            const w = insuranceCards[0].getBoundingClientRect().width;
            return (w + getGap()) * getCardsPerPage();
        };

        const getMaxIndex = () => Math.max(0, getTotalPages() - 1);

        function createDots() {
            insuranceDots.innerHTML = "";
            const total = getTotalPages();

            for (let i = 0; i < total; i++) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.classList.add("carousel-dot");
                dot.setAttribute("aria-label", `Ir para página ${i + 1}`);
                if (i === currentPage) dot.classList.add("active");

                dot.addEventListener("click", () => {
                    currentPage = i;
                    updateInsuranceCarousel();
                });

                insuranceDots.appendChild(dot);
            }
        }

        function updateInsuranceCarousel() {
            insuranceTrack.style.transition = "";
            insuranceTrack.style.transform = `translateX(-${currentPage * getStep()}px)`;

            insuranceDots.querySelectorAll(".carousel-dot").forEach((dot, idx) => {
                dot.classList.toggle("active", idx === currentPage);
            });
        }

        enableDrag({
            track: insuranceTrack,
            getIndex: () => currentPage,
            setIndex: (i) => { currentPage = i; },
            getStep,
            getMaxIndex,
            onChange: updateInsuranceCarousel
        });

        createDots();
        updateInsuranceCarousel();

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentPage = Math.min(currentPage, getMaxIndex());
                createDots();
                updateInsuranceCarousel();
            }, 150);
        });
    }


    /* ==========================================
       CARROSSEL DE AVALIAÇÕES
    ========================================== */

    const reviewsTrack = document.getElementById("reviews-track");

    if (reviewsTrack) {

        let currentIndex = 0;

        const getVisibleCount = () => {
            const w = window.innerWidth;
            if (w <= 600) return 1;
            if (w <= 1000) return 2;
            return 3;
        };

        const getStep = () => {
            const card = reviewsTrack.querySelector(".review-card");
            if (!card) return 0;
            const st = window.getComputedStyle(reviewsTrack);
            const gap = parseFloat(st.columnGap || st.gap) || 24;
            return card.offsetWidth + gap;
        };

        const getMaxIndex = () =>
            Math.max(0, reviewsTrack.children.length - getVisibleCount());

        function updateReviewsCarousel() {
            const max = getMaxIndex();
            if (currentIndex > max) currentIndex = max;
            if (currentIndex < 0) currentIndex = 0;

            reviewsTrack.style.transition = "";
            reviewsTrack.style.transform = `translateX(-${currentIndex * getStep()}px)`;
        }

        enableDrag({
            track: reviewsTrack,
            getIndex: () => currentIndex,
            setIndex: (i) => { currentIndex = i; },
            getStep,
            getMaxIndex,
            onChange: updateReviewsCarousel
        });

        updateReviewsCarousel();

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = Math.min(currentIndex, getMaxIndex());
                updateReviewsCarousel();
            }, 150);
        });
    }


    /* ==========================================
       FORMULÁRIO DE CONTATO
    ========================================== */

    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {

        const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpbqgpo";
        const CORRETOR_EMAIL = "vendas@hadera.com.br";

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const submitBtnOriginalHTML = submitBtn ? submitBtn.innerHTML : "";

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
                        nome, email, mensagem,
                        _subject: `Nova mensagem do site — ${nome}`
                    })
                });

                if (response.ok) {
                    showFeedback("Mensagem enviada! Entraremos em contato em breve.", "success");
                    contactForm.reset();
                } else {
                    const data = await response.json().catch(() => ({}));
                    const msg = data?.errors?.[0]?.message
                        || "Não foi possível enviar. Tente novamente.";
                    showFeedback(msg, "error");
                }

            } catch (error) {
                const subject = encodeURIComponent(`Contato pelo site — ${nome}`);
                const body = encodeURIComponent(
                    `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`
                );

                showFeedback("Sem conexão. Abrindo seu e-mail...", "error");
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
       LINKS DE WHATSAPP
    ========================================== */

    const whatsappNumber = "5511959400172";
    const defaultMessage = "Olá! Gostaria de falar com um consultor da Hadera.";

    document.querySelectorAll(".whatsapp-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
            window.open(url, "_blank");
        });
    });


    /* ==========================================
       CARROSSEL DE OPERADORAS (pausa no hover)
    ========================================== */

    const operadorasTrack = document.querySelector(".carousel-track-operadoras");

    if (operadorasTrack) {
        operadorasTrack.addEventListener("mouseenter", () => {
            operadorasTrack.style.animationPlayState = "paused";
        });
        operadorasTrack.addEventListener("mouseleave", () => {
            operadorasTrack.style.animationPlayState = "running";
        });
    }


    /* ==========================================
       SELEÇÃO AUTOMÁTICA DO TEXTO DO TEXTAREA
    ========================================== */

    const mensagemField = document.querySelector("#mensagem");

    if (mensagemField) {
        const textoPadrao = mensagemField.value.trim();

        mensagemField.addEventListener("focus", () => {
            if (mensagemField.value.trim() === textoPadrao) {
                mensagemField.select();
            }
        });
    }

});