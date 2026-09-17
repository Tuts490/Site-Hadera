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
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

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

});