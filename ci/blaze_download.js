"use strict";

const http = require('https');
const fs = require('fs');
const path = require('path');

function download(name, result_dir) {
    const file_name = path.join(result_dir, name);
    const file = fs.createWriteStream(file_name);
    const url = `https://unpkg.com/blaze/dist/${name}`;
    console.log(">>>Download '%s'", url);
    const request = http.get(url, function(response) {
        const status = response.statusCode;

        if (status === 200) response.pipe(file);
        else if (status >= 300 && status < 400) {
            console.log("Redirect to '%s'", response.headers.location);
            const redirect_url = `https://unpkg.com${response.headers.location}`;
            http.get(redirect_url, function(response) {
                response.pipe(file);
            });
        }
        else console.log("Cannot download from '%s", url);
    });
}

module.exports = function(files, result_dir) {
    files.forEach((file) => {
        download(file, result_dir);
    });
}
