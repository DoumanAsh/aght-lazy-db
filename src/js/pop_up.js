"use strict";

import crel from 'crel';

let pop = undefined;

export default function create_pop_up({title, company, kanji, code, notes}) {
    if (pop !== undefined) {
        pop.children[0].children[0].click();
    }

    pop = crel('div', {class: 'pop-up'});
    const header = crel('header',
        crel('button', {class: 'close'}, '×'),
        crel('h2', title,
            crel('a', {class: 'link', href: `https://vndb.org/v/all?sq=${title}`}, 'vndb'),
            crel('div', {class: 'sub'}, kanji || 'N/A' )
        )
    );

    header.children[0].addEventListener('click', function() {
        const pop_parent = pop.parentNode;
        pop_parent.removeChild(pop);
        pop = undefined;
    });

    const children = [
        header,
        crel('content',
            crel('span', 'Company'),
            crel('span', company || 'N/A')
        ),
        crel('content',
            crel('span', 'AGHT Code'),
            crel('span', code || 'N/A')
        ),
        crel('content',
            crel('span', 'Notes'),
            crel('span', notes || 'N/A')
        )
    ];

    children.forEach((elem) => {
        pop.appendChild(elem);
    });

    document.body.children[1].appendChild(pop);
}

