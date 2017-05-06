"use strict";

import pop_up from './pop_up.js';
import {debounce, create_filter_row} from './utils.js';

const UI = {
    filter: document.getElementById("vn_filter"),
    main: document.body.children[1],
    table: document.body.children[1].children[0]
};

function on_change(event) {
    const apply_fn = create_filter_row(event.target.value);

    requestAnimationFrame(() => {
        const rows = UI.table.children;
        const len = rows.length;
        let visible_idx = 1;

        for (let idx = 1; idx < len; idx++) {
            const row = rows[idx];
            row.classList.remove("even");
            if (apply_fn(row)) {
                if (visible_idx % 2 === 0) row.classList.add('even');
                visible_idx++;
            }
        }
    });
}

function on_click(event) {
    const row = event.target.parentNode;
    if (row.dataset.code !== undefined) {
        pop_up({
            title: row.children[0].innerHTML,
            company: row.children[1].innerHTML,
            kanji: row.dataset.kanji,
            code: row.dataset.code,
            notes: row.dataset.notes
        });
    }
}

UI.filter.addEventListener("input", debounce(on_change, 250));
UI.table.addEventListener("click", on_click);

if (UI.filter.value) {
    on_change({target: UI.filter});
}
