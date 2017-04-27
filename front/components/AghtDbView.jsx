"use strict";

import Inferno, {linkEvent} from 'inferno';
import Component from 'inferno-component';

import {connect} from "inferno-mobx";

import {GameInfo, GameRow} from './AghtDbView/GameInfo.jsx';
import {TableHeading, TableCaption} from './common.jsx';

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
        const input = {
            filter_value: this.props.DbView.filter_value,
            cb: linkEvent(this, this.handle_filter_input),
            placeholder: "VN Title"
        };
        return (
            <div>
                {this.props.DbView.title &&
                        <GameInfo title={this.props.DbView.title}
                            info={this.props.DbStore.db.inner[this.props.DbView.title]}
                            close_fn={this.handle_close_game}
                        />
                }
                <div className="c-table c-table--striped c-table--clickable">
                    <TableCaption title={this.ui.title} input={input}/>
                    <TableHeading fields={this.ui.heading}/>
                    {games.map((game) =>
                        <GameRow key={game.title} title={game.title} company={game.company} onClick={on_game_click} data-title={game.title}/>
                    )}
                </div>
            </div>
        );
    }
});
