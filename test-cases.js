import dotenv from 'dotenv';
import investigator from './investigator.js';
import mailer from './mailer.js';

dotenv.config();

const testcases = {
    testCase01: () =>
        new Promise(resolve => {
            console.log('Test Case 01: Dumping environment variables from `.env`...');
            console.log('MAIL_FROM_ADDRESS', process.env.MAIL_FROM_ADDRESS);
            console.log('MAIL_FROM_NAME', process.env.MAIL_FROM_NAME);
            console.log('MAIL_TO_ADDRESS', process.env.MAIL_TO_ADDRESS);
            console.log('ENERGI3_MASTERNODE_ID', process.env.ENERGI3_MASTERNODE_ID);
            resolve({});
        }),
    
    testCase02: async () =>
        new Promise((resolve, reject) => {
            console.log(
                `Test Case 02: Query the data for the Energi3 masternode with Id ${process.env.ENERGI3_MASTERNODE_ID} (the Id ` + 
                'configured as the `ENERGI3_MASTERNODE_ID` environment variable in `.env`)...');

            let intervalCount = 0;
            let abandoned = false;

            const cb = data => {
                if (!abandoned) {
                    clear();
                    resolve({ objPreface: 'Received:', obj: JSON.parse(data) });
                }
            };

            const intervalId = setInterval(() => {
                if (++intervalCount >= 10) {
                    abandoned = true;
                    clear();
                    reject({ msg: 'Abandoning. Web API call to Energi3 network took more than 10 seconds.' });
                }
                console.log(intervalCount);
            }, 1000);

            const clear = () => {
                clearInterval(intervalId);
            };
            
            investigator.investigate(cb);
        }),
    
    testCase03: () =>
        new Promise(resolve => {
            console.log('Test Case 03: Email object when no reponse received from the Energi3 Web API...');

            const obj = { result: undefined };
            resolve({
                objPreface: 'Received:',
                obj: investigator.generateEmailDataFromInvestigation(JSON.stringify(obj)),
                msg: 'Potentially succeeded.',
            });
        }),
    
    testCase04: () =>
        new Promise(resolve => {
            console.log(
                'Test Case 04: Email object when IsActive and IsAlive are both missing in the response from the Energi3 Web API...');

            const obj = { result: {} };
            resolve({
                objPreface: 'Received:',
                obj: investigator.generateEmailDataFromInvestigation(JSON.stringify(obj)),
                msg: 'Potentially succeeded.'
            });
        }),
    
    testCase05: () =>
        new Promise(resolve => {
            console.log(
                'Test Case 05: Email object when IsActive and IsAlive are both false in the response from the Energi3 Web API...');

            const obj = { result: { IsActive: false, IsAlive: false } };
            resolve({
                objPreface: 'Received:',
                obj: investigator.generateEmailDataFromInvestigation(JSON.stringify(obj)),
                msg: 'Potentially succeeded.'
            });
        }),
    
    testCase06: () =>
        new Promise(resolve => {
            console.log(
                'Test Case 06: Email object when IsActive is false and IsAlive is true in the response from the Energi3 Web API...');

            const obj = { result: { IsActive: false, IsAlive: true } };
            resolve({
                objPreface: 'Received:',
                obj: investigator.generateEmailDataFromInvestigation(JSON.stringify(obj)),
                msg: 'Potentially succeeded.'
            });
        }),
    
    testCase07: () =>
        new Promise(resolve => {
            console.log(
                'Test Case 07: Email object when IsActive is true and IsAlive is false in the response from the Energi3 Web API...');

            const obj = { result: { IsActive: true, IsAlive: false } };
            resolve({
                objPreface: 'Received:',
                obj: investigator.generateEmailDataFromInvestigation(JSON.stringify(obj)),
                msg: 'Potentially succeeded.'
            });
        }),
    
    testCase08: () =>
        new Promise((resolve, reject) => {
            console.log(
                'Test Case 08: Email object when IsActive and IsAlive are both true in the response from the Energi3 Web API...');

            const obj = { result: { IsActive: true, IsAlive: true } };
            const emailObj = investigator.generateEmailDataFromInvestigation(JSON.stringify(obj));

            if (emailObj == null) {
                resolve({ msg: 'Email object returned as `null`/`undefined`.\nSucceeded.' })
            } else {
                reject({
                    objPreface: 'Received:',
                    obj: emailObj,
                    msg: 'Email object should have been `null`.'
                });
            }
        }),
    
    testCase09: () =>
        new Promise((resolve, reject) => {
            console.log('Test Case 09: Testing the mailer...');

            const objPreface = 'The mailer subsystem returned:';

            mailer.send({
                subject: 'Test Email',
                html:
                    'This email was sent as a test of the <strong>Energi3 Masternode Status Checker\'s</strong> mailer subsystem.' +
                    `<br /><br /><i style="font-size: .75em;">Email created ${new Date().toUTCString()}</i>`
            }, (error, info) => {
                if (error) {
                    reject({ objPreface, obj: error });
                } else {
                    resolve({
                        objPreface,
                        obj: info,
                        msg:
                            `Potentially succeeded. You should soon receive a test email sent to ${process.env.MAIL_TO_ADDRESS} (the ` +
                            'address set as the environment variable `MAIL_TO_ADDRESS` in `.env`).'
                    });
                }
            });
        })
};

export default testcases;
