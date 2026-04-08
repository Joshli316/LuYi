import { tl } from '../i18n';

/** Shared disclaimer bar for result screens */
export function renderDisclaimer(): string {
  return `<div class="disclaimer-bar">
    <i data-lucide="shield" style="width:18px;height:18px;flex-shrink:0"></i>
    <span>${tl({ en: 'This is for educational purposes only. This is not legal advice. Consult a qualified immigration attorney.', zh: '本工具仅供教育参考，不构成法律建议。请咨询合格的移民律师。' })}</span>
    <button onclick="this.parentElement.remove()" aria-label="Dismiss"><i data-lucide="x" style="width:16px;height:16px"></i></button>
  </div>`;
}

/** Activate Lucide icons in the DOM */
export function activateIcons(): void {
  (window as any).lucide?.createIcons();
}
