/**
 * Animación de aparición al hacer scroll (compartida entre páginas).
 *
 * Importante: la clase `js-reveal` se añade a <html> desde un script en la
 * cabecera de cada página, no desde aquí. Así el contenido nunca queda
 * invisible si este archivo no llega a cargarse.
 *
 * Además hay una red de seguridad: pasados 3 segundos, todo lo que siga
 * oculto se muestra igualmente.
 */
(function () {
  "use strict";

  var elements = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!elements.length) return;

  function show(el) {
    el.classList.add("in");
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach(show);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });

  // Red de seguridad: nada puede quedarse invisible.
  window.setTimeout(function () {
    elements.forEach(show);
  }, 3000);
})();
