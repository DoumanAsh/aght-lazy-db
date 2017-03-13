"use strict";

import Inferno from 'inferno';

export const TitleInfo = ({title, close_pop, data}) => {
    return (
        <div className="center_box code_info">
            <header>{title}</header>
            <button className="close" onClick={close_pop}>{"✖"}</button>
            <content>
                <p>Kanji title</p>
                <p>{data.kanji ? data.kanji : "n/a"}</p>

                <p>Company</p>
                <p>{data.company ? data.company : "n/a"}</p>

                <p>AGHT Code</p>
                <p>{data.code ? data.code : "n/a"}</p>

                <p>Notes</p>
                <p>{data.notes ? data.notes : "n/a"}</p>
            </content>
        </div>
    );
};
