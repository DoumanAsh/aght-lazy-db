// @flow
const http = require('https');
const fs = require('fs');
const util = require('util');
const he = require('he');
const path = require('path');

const URL_REFIX = 'https://web.archive.org';

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, function(response) {

            if (response.statusCode >= 300 && response.statusCode < 400) {
                let redirect = util.format('%s%s', URL_REFIX, response.headers['location']);

                if (redirect) reject({redirect: redirect});
                else reject({error: util.format("Couldn't connect to %s. status=%d", url, response.statusCode)});
            }
            else if (response.statusCode !== 200) {
                reject({error: util.format("Couldn't connect to %s. status=%d", url, response.statusCode)});
            }

            let data = '';
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(data);
            });
        }).on("error", function(error) {
            reject({error: error});
        });
    });
}
const EventEmitter = require('events');

class Agg extends EventEmitter {
    /*::
      codes: {[key:string]:Object};
     */
    constructor() {
        super();
        this.codes = {
        };
    }
}

const agg = new Agg();

function parse_details(data) {
    try {
        const data_re = /<div class=\"top-bar\">/;
        const data_end_re = /<\/div>/;
        //const details = data_re.exec(data);
        let details = data.slice(data.search(data_re));
        details = details.slice(0, details.search(data_end_re)).split('\n').filter((elem) => elem);

        const title_idx = 1;
        const kanji_idx = 4;
        const company_idx = 8;
        const code_idx = 12;

        const title = he.decode(details[title_idx].trim().slice(4, -14));
        const kanji = he.decode(details[kanji_idx].trim());
        const company = he.decode(details[company_idx].trim());
        const code = he.decode(details[code_idx].trim());

        agg.emit('code', title, {
            kanji: decodeURI(kanji),
            company: decodeURI(company),
            code: decodeURI(code),
        });
    }
    catch (error) {
        console.log(error);
    }
}

function parse_error(error) {
    if ('error' in error) {
        //console.log(error.error);
    }
    else if ('redirect' in error) {
        get(error.redirect).then(parse_details).catch(parse_error);
    }
}

agg.on('add', (name, details_url) => {
    get(details_url).then(parse_details)
                    .catch(parse_error);
});

agg.on('code', (vn, data) => {
    agg.codes[vn] = data;
});

agg.once('end', () => {
    const json_path = path.join(__dirname, 'agthdb.json');
    console.log("Number of VNs is %d", Object.keys(agg.codes).length);
    fs.writeFileSync(json_path, JSON.stringify(agg.codes, null, 4));
});

process.on('beforeExit', () => {
    agg.emit('end');
});

const url = "https://web.archive.org/web/20150522072137/http://agthdb.bakastyle.com/";
const temp_url = "https://web.archive.org/web/20150427203737/http://agthdb.bakastyle.com/?page=";

function parse_url(url, codes) {
    const url_re = /href=\"(.*)\"/;
    const name_re = />(.*)<\/a>/;

    const name = name_re.exec(url)[1];
    const data_url = URL_REFIX + url_re.exec(url)[1];

    agg.emit('add', name, data_url);

    if (codes) {
        for (let code of codes.map((elem) => elem.slice(1, -6))) {
            agg.emit('code', name, {
                code: decodeURI(code)
            });
        }
    }
}

function parse(data) {
    try {
        const table_start_regex = /<table class=\"listing\"/;
        const table_end_regex = /<\/table>/;
        const regex = /<a href="(.*)\/games\/(.*)">(.*)<\/a>/g;
        const in_code_re = />\/H(.*)<\/td>/mg;

        let table_data = data.slice(data.search(table_start_regex));
        table_data = table_data.slice(0, -data.search(table_end_regex));
        const result = table_data.match(regex);
        const codes = table_data.match(in_code_re);

        if (!result) return;

        for (let idx = 0; idx < result.length; idx += 1) {
            parse_url(result[idx], codes);
        }
    }
    catch (error) {
        console.log(error);
    }
}

function handle_error(error) {
    if ('error' in error) {
        //console.log(error.error);
    }
    else if ('redirect' in error) {
        get(error.redirect).then(parse).catch(handle_error);
    }
}

get(url).then(parse)
        .catch(handle_error);

for (let idx = 2; idx < 40; idx += 1) {
    let next_url = temp_url + idx;
    get(next_url).then(parse)
                 .catch(handle_error);
}
