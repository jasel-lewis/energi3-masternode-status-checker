import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

/**
 * @callback sendCallback
 * @param {Object} error - The error object if the mail transport mechanism failed.
 * @param {Object} info - The result from the mail transport mechanism.
 */

const mailer = {
    /**
     * Sends an email configured using `config`. @see {@link // https://nodemailer.com/transports/sendmail/}.
     * 
     * @param {Object} config The Nodemailer message configuration (@see {@link https://nodemailer.com/message/}).
     * @param {string|Object} config.from The name and/or address the email is sent from. Defaults to using the
     * `MAIL_FROM_NAME` and `MAIL_FROM_ADDRESS` values configured in `.env` for the name
     * and address, respectively. (@see {@link https://nodemailer.com/message/addresses/}).
     * @param {string|Array} config.to The email addresses to which the email should be sent. Defaults to using the
     * `MAIL_TO_ADDRESS` value configured in `.env`.
     * @param {string} config.subject The subject line of the email.
     * @param {string} config.html The HTML body of the email.
     * @param {sendCallback} cb - The callback.
     */
    send: (config, cb) => {
        if (!(config.from && config.from.length) || !(config.from.address && config.from.address.length)) {
            config.from = {
                address: process.env.MAIL_FROM_ADDRESS,
                name: process.env.MAIL_FROM_NAME
            };
        }

        if (!(config.to && config.to.length)) {
            config.to = process.env.MAIL_TO_ADDRESS
        }

        config.secure = true;
        config.debug = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true';

        const transporter = nodemailer.createTransport({
            sendmail: true,
            newline: 'unix',
            path: '/usr/lib/sendmail'
        });

        transporter.sendMail(config, cb);
    }
};

export default mailer;
