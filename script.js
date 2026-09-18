document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ANO AUTOMÁTICO DO FOOTER
    // ==========================================

    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ==========================================
    // FORMULÁRIO DE CONTATO
    // ==========================================

    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();


            // ==========================================
            // PEGAR VALORES DOS CAMPOS
            // ==========================================

            const nome = document.querySelector("#nome").value.trim();
            const email = document.querySelector("#email").value.trim();
            const telefone = document.querySelector("#telefone").value.trim();
            const seguro = document.querySelector("#seguro").value;
            const mensagem = document.querySelector("#mensagem").value.trim();


            // ==========================================
            // VALIDAÇÃO DOS CAMPOS
            // ==========================================

            if (!nome || !email || !telefone || !seguro || !mensagem) {
                alert("Por favor, preencha todos os campos.");
                return;
            }


            // ==========================================
            // VALIDAÇÃO DO E-MAIL
            // ==========================================

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                alert("Digite um e-mail válido.");
                return;
            }


            // ==========================================
            // VALIDAÇÃO DO TELEFONE
            // ==========================================

            const telefoneNumeros = telefone.replace(/\D/g, "");

            if (
                telefoneNumeros.length !== 10 &&
                telefoneNumeros.length !== 11
            ) {
                alert("Digite um telefone válido.");
                return;
            }


            // ==========================================
            // TEXTO DO WHATSAPP
            // ==========================================

            const seguroNome = {
                saude: "Plano de Saúde",
                odonto: "Odonto",
                auto: "Auto",
                vida: "Vida",
                outro: "Outro"
            };

            const tipoSeguro = seguroNome[seguro];


            const whatsappMessage =
                `Olá! Gostaria de solicitar uma cotação pela Hadera.

Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Tipo de seguro: ${tipoSeguro}

Mensagem:
${mensagem}`;


            // ==========================================
            // ABRIR WHATSAPP
            // ==========================================

            const whatsappNumber = "5511959400172";

            const whatsappURL =
                'https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}';

            window.open(whatsappURL, "_blank");

        });

    }

    // ==========================================
    // LINKS DO WHATSAPP
    // ==========================================

    const whatsappLinks = document.querySelectorAll(".whatsapp-link");

    const whatsappNumber = "5511959400172";

    const defaultMessage =
        "Olá! Gostaria de falar com um consultor da Hadera.";

    whatsappLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

            window.open(whatsappURL, "_blank");

        });

    });
/* ========================================
   CARROSSEL DE AVALIAÇÕES (com link nos cards)
======================================== */

(function () {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function getVisibleCount() {
        const w = window.innerWidth;
        if (w <= 600) return 1;
        if (w <= 1000) return 2;
        return 3;
    }

    function getCardStep() {
        const card = track.querySelector('.review-card');
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

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        update();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        update();
    });

    // Impede que o clique abra o link caso o usuário esteja arrastando
    let isDown = false;
    let startX = 0;
    let moved = false;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.clientX;
        moved = false;
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        if (Math.abs(e.clientX - startX) > 6) moved = true;
    });

    document.addEventListener('mouseup', () => {
        isDown = false;
    });

    track.addEventListener('click', (e) => {
        if (moved) {
            e.preventDefault();
            moved = false;
        }
    });

    window.addEventListener('resize', () => {
        currentIndex = Math.min(currentIndex, getMaxIndex());
        update();
    });

    update();
})();




});
