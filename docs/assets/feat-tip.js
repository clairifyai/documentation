class FeatTip extends HTMLElement {
    connectedCallback() {
        // read tooltip text from the hidden snippet
        const id = this.getAttribute('id');
        const src = id && document.getElementById(`tip-src-${id}`);
        const text = src ? (src.textContent || '').replace(/\s+/g, ' ').trim() : '';

        if (text) {
            // put tooltip on the custom element host; Material will style it if content.tooltips is on
            this.setAttribute('title', text);
            this.setAttribute('aria-label', text);
        }

        // make it keyboard focusable
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    }
}
customElements.define('feat-tip', FeatTip);
