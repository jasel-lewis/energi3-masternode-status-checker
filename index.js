import dotenv from 'dotenv';
import investigator from './investigator.js';
import mailer from './mailer.js';

const result = dotenv.config();
const debug = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true';

if (result.error) {
    throw result.error;
}

const cb = data => {
    const email = investigator.generateEmailDataFromInvestigation(data);

    if (email) {
        mailer.send(email, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                debug && console.debug(info);
            }
        });
    }
};

investigator.investigate(cb);
