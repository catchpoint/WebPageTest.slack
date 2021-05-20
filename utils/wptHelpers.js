exports.runTest = (wpt, url, options) => {

    const tempOptions = JSON.parse(JSON.stringify(options));
    return new Promise((resolve, reject) => {
        console.info(`Submitting test for ${url}...`);
        wpt.runTest(url, tempOptions, async(err, result) => {
            try {
                if (result) {
                    return resolve({'result':result,'err':err});
                } else {
                    return reject(err);
                }
            } catch (e) {
                console.info(e);
            }
        })
    });
}

exports.getLocations = (wpt,options) => {

    const tempOptions = JSON.parse(JSON.stringify(options));
    return new Promise((resolve, reject) => {
        console.info(`Getting Locations...`);
        wpt.getLocations(tempOptions, async(err, result) => {
            try {
                if (result) {
                    return resolve({'result':result,'err':err});
                } else {
                    return reject(err);
                }
            } catch (e) {
                console.info(e);
            }
        })
    });
}

