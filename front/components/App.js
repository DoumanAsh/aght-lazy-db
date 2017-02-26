"use strict";

import Inferno, {linkEvent} from 'inferno';
import Component from 'inferno-component';

import {DB} from "./data.js";

const Row = ({title, company, popup}) =>
    <tr>
        <td onClick={popup}>{title}</td>
        <td>{company}</td>
    </tr>
;

const TableHeader = ({elements}) =>
    <tr>
    {elements.map((element) => <th>{element}</th>)}
    </tr>
;

const TitleInfo = ({title, close_pop}) => {
    const data = DB[title];
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
    }

    pop_up(self, event) {
        const title = event.target.className === "close" ? undefined : event.target.innerHTML;
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
                    <TitleInfo title={this.state.popup_key} close_pop={this.event_pop_title} />
                }

                <table>
                    <TableHeader elements={this.header} />
                    {this.state.view.filter(title => this.state.filter.test(title)).map(title =>
                         <Row title={title} company={DB[title].company} popup={this.event_pop_title}/>
                    )}
                </table>
            </div>
        );
    }
}
