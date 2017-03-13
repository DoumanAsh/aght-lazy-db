"use strict";

import Inferno, {linkEvent} from 'inferno';
import Component from 'inferno-component';

import {Row, TableHeader} from './App/Table.jsx';
import {TitleInfo} from './App/Popup.jsx';

import DB from "data/db.json";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.header = ["Title", "Company"];
        this.state = {
            view: Object.keys(DB),
            filter: /./i,
            popup_key: undefined
        };

        this.event_pop_title = linkEvent(this, this.pop_up);

        this._filter_title = (title) => {
            const kanji = DB[title].kanji;
            return this.state.filter.test(title) || (kanji && this.state.filter.test(kanji));
        };
    }

    pop_up(self, event) {
        const title = event.target.className === "close" ? undefined : event.target.parentElement.children[0].innerHTML;
        self.setState(() => {
            return { popup_key: title };
        });
    }

    on_filter_change(self, event) {
        self.setState(() => {
            return { filter: new RegExp(event.target.value, 'i') };
        });
    }

    render() {
        return (
            <div className="app">
                <form>
                    <input onInput={linkEvent(this, this.on_filter_change)} placeholder="VN Title"/>
                </form>

                {this.state.popup_key &&
                    <TitleInfo title={this.state.popup_key} close_pop={this.event_pop_title} data={DB[this.state.popup_key]}/>
                }

                <table>
                    <TableHeader elements={this.header} />
                    {this.state.view.filter(this._filter_title).map(title =>
                         <Row title={title} company={DB[title].company} popup={this.event_pop_title}/>
                    )}
                </table>
            </div>
        );
    }
}
