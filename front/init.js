"use strict";

import Inferno from 'inferno';
import AghtDbView from './components/AghtDbView.jsx';

import { Provider } from 'inferno-mobx';
import * as Store from './stores/Codes.js';

Inferno.render(<Provider DbStore={Store.db} DbView={Store.view}>
    <AghtDbView />
</Provider>,
document.body.children[0]);
