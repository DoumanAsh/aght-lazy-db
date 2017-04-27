"use strict";

import Inferno from 'inferno';

export const GameRow = ({title, company, ...props}) =>
    <div className="c-table__row" {...props} >
        <span className="c-table__cell">{title}</span>
        <span className="c-table__cell">{company}</span>
    </div>
;

export const GameInfoElement = ({name, value}) =>
    <div className="c-card__body">
        <span>{name}</span>
        <span>{value || "N/A"}</span>
    </div>
;

export const GameInfo = ({title, info, close_fn}) =>
    <div className="c-overlay c-overlay--fullpage">
        <div className="o-modal">
          <div className="c-card u-high">
            <header className="c-card__header">
              <button onClick={close_fn} type="button" className="c-button c-button--close">×</button>
              <h2 className="c-heading">{title}
                  <a href={`https://vndb.org/v/all?sq=${title}`} className="c-badge c-badge-rounded">vndb</a>
                  <div className="c-heading__sub">{info.kanji || "N/A"}</div>
              </h2>
            </header>
            <GameInfoElement name="Company" value={info.company}/>
            <GameInfoElement name="AGHT Code" value={info.code}/>
            <GameInfoElement name="Notes" value={info.notes}/>
          </div>
        </div>
    </div>
;
