"use strict";

import Inferno from 'inferno';

export const Input = ({type, ...props}) => <input className="input c-field" type={type || "text"} {...props} />;

export const TableHeading = ({fields}) =>
    <div className="c-table__row c-table__row--heading">
        {fields.map((val) =>
            <h1 className="c-table__cell big">{val}</h1>
        )}
    </div>
;

export const TableCaption = ({title, input}) =>
    <heading className="c-table__caption">
        <div className="title">{title}</div>
        <Input value={input.filter_value}
            onInput={input.cb}
            placeholder={input.placeholder}
        />
    </heading>
;

