/* Iconos propios en SVG (trazo, currentColor) — reemplazan emojis y caracteres genéricos
   para que la interfaz tenga un lenguaje visual coherente con el resto de la app. */

const ICONS = {
  search: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="15.3" y1="15.3" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',

  index: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><rect x="3" y="5" width="12" height="3.4" rx="1" fill="currentColor"/><rect x="3" y="10.3" width="17" height="3.4" rx="1" fill="currentColor" opacity="0.75"/><rect x="3" y="15.6" width="9" height="3.4" rx="1" fill="currentColor" opacity="0.55"/></svg>',

  close: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',

  starFilled: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M12 2.5l2.9 6.6 7.1.7-5.3 4.8 1.5 7-6.2-3.6-6.2 3.6 1.5-7-5.3-4.8 7.1-.7z" fill="currentColor"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M12 2.5l2.9 6.6 7.1.7-5.3 4.8 1.5 7-6.2-3.6-6.2 3.6 1.5-7-5.3-4.8 7.1-.7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',

  chevronLeft: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  check: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M5 12.5l4.3 4.3L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  arrowRight: '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M4 12h15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
