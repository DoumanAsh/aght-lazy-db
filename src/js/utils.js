"use strict";

/**
 * Creates debouncing callback.
 *
 * @param {Function} callback Callback to wrap.
 * @param {Integer} delay Debouncing delay.
 * @returns {Function} Wrapped callback.
 */
export function debounce(callback, delay) {
    let timeout;

    return function() {
        const ctx = this;
        const args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function() {
            callback.apply(ctx, args);
        }, delay);
    };
}

/**
 * Creates filtering function based on filter text.
 * @param {String|null} filter_text Regexp to match rows that should be visible.
 * @return {Function} Function to apply on row.
 */
export function create_filter_row(filter_text) {
    if (filter_text) {
        const filter = new RegExp(filter_text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
        return function(row) {
            const title = row.children[0].innerHTML;
            const kanji = row.dataset.kanji;
            if (filter.test(title) || (kanji !== undefined && filter.test(kanji))) {
                row.classList.remove("hidden");
                return true;
            }
            else {
                row.classList.add("hidden");
                return false;
            }
        };
    }
    else {
        return function(row) {
            row.classList.remove("hidden");
            return true;
        };
    }
}
