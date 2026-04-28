// Prepara títulos com efeito typing: quebra em palavras (e mantém elementos
// aninhados como <span class="italic"> ou <em> intactos, animando o bloco
// inteiro como uma "palavra"). <br> é preservado sem virar palavra.
document.querySelectorAll('[data-animate-type="typing"]').forEach((el) => {
  let wordIndex = 0;
  const wrap = (html: string) =>
    `<span class="word" style="--word-delay: ${wordIndex++ * 80}ms">${html}</span>`;

  const out: string[] = [];
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? '').split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          out.push(part);
        } else {
          out.push(wrap(part));
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const elNode = node as Element;
      if (elNode.tagName === 'BR') {
        out.push(elNode.outerHTML);
      } else {
        out.push(wrap(elNode.outerHTML));
      }
    }
  });

  el.innerHTML = out.join('');
});

// IntersectionObserver para revelar elementos ao entrar no viewport (uma vez)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '100px 0px -50px 0px',
  },
);

document.querySelectorAll('[data-animate]').forEach((el) => {
  observer.observe(el);
});
