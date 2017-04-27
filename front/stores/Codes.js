"use strict";

import DB from "../../data/db.json";
import { useStrict, extendObservable, action} from 'mobx';

useStrict(true);

/**
 * AGHT Codes Store.
 */
class AghtCodes {
    constructor() {
        this.db = {
            inner: DB,
            keys: Object.keys(DB)
        };
    }

    /**
     * @returns {Object} Game information.
     * @param {String} title Game's title.
     */
    game(title) {
        return this.db.inner[title];
    }

    /**
     * @returns {Array} Filtered elements of DB.
     * @param {RegExp|null} regex Filter as RegExp. Return the whole DB on null.
     */
    filter(regex) {
        const result = [];
        let assigner;

        if (regex) {
            assigner = (title) => {
                const kanji = this.db.inner[title].kanji;
                if (regex.test(title) || (kanji && regex.test(kanji))) {
                    const game = {title: title};

                    Object.keys(this.db.inner[title]).forEach((key) => {
                        game[key] = this.db.inner[title][key];
                    });

                    result.push(game);
                }
            };
        }
        else {
            assigner = (title) => {
                const game = {title: title};
                Object.keys(this.db.inner[title]).forEach((key) => {
                    game[key] = this.db.inner[title][key];
                });

                result.push(game);
            };
        }

        this.db.keys.forEach(assigner);

        return result;
    }
}

/**
 * AGHT Codes View.
 */
class View {
    constructor() {
        extendObservable(this, {
            title: null,
            filter_value: '',

            set_title: action(function(val) {
                this.title = val;
            }),

            get filter() {
                if (this.filter_value) {
                    return new RegExp(this.filter_value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
                }
                else return null;
            },
            set filter(val) {
                this.filter_value = val;
            },
        });
    }
}

export const db = new AghtCodes();
export const view = new View();
