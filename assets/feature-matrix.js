// docs/assets/view-toggle.js
document.addEventListener('DOMContentLoaded', () => {
    const KEY = 'featureViewMode';
    const btnChecks = document.getElementById('view-checks');
    const btnValues = document.getElementById('view-values');
    if (!btnChecks || !btnValues) return;

    const isIcon = el => !!el.querySelector && !!el.querySelector('svg');
    const getVal = el => el.getAttribute('data-value') || '';

    // Annotate cells once
    document.querySelectorAll('.feat').forEach(el => {
        const val = getVal(el);
        el.classList.toggle('has-value', !!val);
        // If a cell uses text glyphs (not Material SVG), remember original
        if (!isIcon(el) && !el.hasAttribute('data-glyph')) {
            el.setAttribute('data-glyph', (el.textContent || '').trim());
        }
    });

    const applyMode = (mode) => {
        document.body.setAttribute('data-view', mode);

        document.querySelectorAll('.feat').forEach(el => {
            const val = getVal(el);
            const icon = isIcon(el);

            if (mode === 'values') {
                if (!val) return; // no value -> leave icon visible
                if (icon) {
                    // inject/update value span
                    let v = el.querySelector('.feat__value');
                    if (!v) {
                        v = document.createElement('span');
                        v.className = 'feat__value';
                        v.style.marginLeft = '.15rem';
                        el.appendChild(v);
                    }
                    v.textContent = val;
                } else {
                    el.textContent = val;
                }
            } else {
                // restore checks/Xs
                if (icon) {
                    const v = el.querySelector('.feat__value');
                    if (v) v.remove();
                } else {
                    const original = el.getAttribute('data-glyph') || '✔️';
                    el.textContent = original;
                }
            }
        });

        // Button state + persist
        const activeBtn = mode === 'values' ? btnValues : btnChecks;
        const inactiveBtn = mode === 'values' ? btnChecks : btnValues;
        activeBtn.classList.add('md-button--primary');
        activeBtn.setAttribute('aria-pressed', 'true');
        inactiveBtn.classList.remove('md-button--primary');
        inactiveBtn.setAttribute('aria-pressed', 'false');
        localStorage.setItem(KEY, mode);
    };

    // Init
    const initial = localStorage.getItem(KEY) || 'checks';
    applyMode(initial);

    // Events
    btnChecks.addEventListener('click', () => applyMode('checks'));
    btnValues.addEventListener('click', () => applyMode('values'));
});
