# Hadera Corretora de Seguros — Landing Page

Site institucional da Hadera Corretora de Seguros, com foco em planos de saúde e consultoria para pessoa física, MEI e pequenas empresas.

🌐 [hadera.com.br](https://hadera.com.br)

---

## Stack

- HTML5 + CSS3 + JavaScript vanilla
- Google Fonts (Space Grotesk, Inter, Instrument Serif)
- Lucide Icons
- Formspree (formulário de contato)
- Apache (`.htaccess` para URLs amigáveis e HTTPS)

---

## Estrutura
├── index.html
├── politica-de-privacidade.html
├── style.css
├── script.js
├── .htaccess
└── imagens/
├── logo.png
├── icon.png
├── og-image.jpg
└── operadoras/

---

Formulário — em script.js:

js
const FORMSPREE_ENDPOINT = "https://formspree.io/f/SEU_ID_AQUI";
const CORRETOR_EMAIL = "vendas@hadera.com.br";
WhatsApp — em script.js e nos links do HTML:

js
const whatsappNumber = "5511959400172";
Cores da marca — em style.css:

css
:root {
    --red: #C0272D;
    --ink: #14110F;
    --cream: #F7F4F0;
}
Deploy
Site estático hospedado na HostGator. Funciona em qualquer hospedagem.

O .htaccess cuida de URLs sem .html, HTTPS forçado, cache e tipos MIME.

Desenvolvido por Pedro Pires
📧 pedroop1301@hotmail.com

Licença
Projeto proprietário da Hadera Corretora de Seguros. Todos os direitos reservados.