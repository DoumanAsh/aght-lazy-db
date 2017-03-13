"use strict";

import Inferno from 'inferno';

export const Row = ({title, company, popup}) =>
    <tr onClick={popup}>
        <td>{title}</td>
        <td>{company}</td>
    </tr>
;

export const TableHeader = ({elements}) =>
    <tr>
    {elements.map((element) => <th>{element}</th>)}
    </tr>
;
