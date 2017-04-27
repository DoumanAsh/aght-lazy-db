"use strict";

import Inferno, {linkEvent} from 'inferno';
import Component from 'inferno-component';

import { connect } from "inferno-mobx";

const GameInfoElement = ({name, value}) =>
    <div className="c-card__body">
        <span>{name}</span>
        <span>{value || "N/A"}</span>
    </div>
;

const GameInfo = ({title, info, close_fn}) =>
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

const IconInput = ({value, onInput, placeholder}) =>
    <input className="input c-field" type="text" value={value} onInput={onInput} placeholder={placeholder}/>
;

export default connect(['DbStore', 'DbView'], class AghtDbView extends Component {
    constructor(props) {
        super(props);
        this.ui = {
            title: "AGHT DB",
            heading: ['Title', 'Company']
        };

        this.handle_close_game = () => this.props.DbView.set_title(null);
    }

    handle_game_click(self, event) {
        const title = event.target.dataset.title ? event.target.title : event.target.parentNode.dataset.title;
        self.props.DbView.set_title(title);
    }

    handle_filter_input(self, event) {
        self.props.DbView.filter = event.target.value;
    }

    render() {
        const games = this.props.DbStore.filter(this.props.DbView.filter);
        const on_game_click = linkEvent(this, this.handle_game_click);
        return (
            <div>
                {this.props.DbView.title &&
                        <GameInfo title={this.props.DbView.title}
                            info={this.props.DbStore.db.inner[this.props.DbView.title]}
                            close_fn={this.handle_close_game}
                        />
                }
                <div className="c-table c-table--striped c-table--clickable">
                    <heading className="c-table__caption">
                        <div className="title">{this.ui.title}</div>
                        <IconInput value={this.props.DbView.filter_value}
                            onInput={linkEvent(this, this.handle_filter_input)}
                            placeholder="VN Title"
                        />
                    </heading>
                    <div className="c-table__row c-table__row--heading">
                        {this.ui.heading.map((val) =>
                            <h1 className="c-table__cell big">{val}</h1>
                        )}
                    </div>
                    {games.map((game) =>
                        <div key={game.title} className="c-table__row" onClick={on_game_click} data-title={game.title}>
                            <span className="c-table__cell">{game.title}</span>
                            <span className="c-table__cell">{game.company}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
});
