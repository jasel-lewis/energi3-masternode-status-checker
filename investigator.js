import dotenv from 'dotenv';
import https  from 'https';
import { prettyPrintJson } from 'pretty-print-json';

const investigator = (() => {
    dotenv.config();

    const debug = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true';
    let currentDts = new Date(-8640000000000000);
    
    const investigate = cb => {
        currentDts = new Date().toUTCString();

        const data = {
            jsonrpc: '2.0',
            id: 7,
            method: 'masternode_masternodeInfo',
            params: [ process.env.ENERGI3_MASTERNODE_ID ]
        };

        const payload = JSON.stringify(data);

        const options = {
            hostname: 'nodeapi.energi.network',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        const req = https.request(options, res => {
            debug && console.debug('statusCode: ', res.statusCode);
        
            res.on('data', cb);
        });
        
        req.on('error', error => {
            console.error(error);
        });
        
        req.write(payload);
        req.end();
    };

    const generateEmailDataFromInvestigation = data => {
        const email = { subject: 'Masternode Check Failed', html: '' };
        const { result } = JSON.parse(data);
            
        const attemptedVerbiage =
            'Attempted to query the energi.network to check the status of the Energi3 Masternode running on miner.jasel.com';
        const reportedVerbiage = 'The energi.network reported that the Energi3 Masternode running on miner.jasel.com';
        const takeActionHtml =
            '<br /><br />Please log into the masternode to find out if it is on a side chain or if something else is amiss.' +
            `<br /><br />${prettyPrintJson.toHtml(result)}`;

        if (!result) {
            email.html = `${attemptedVerbiage} but got no result from their API server.`;
        } else if (!('IsActive' in result && 'IsAlive' in result)) {
            email.html =
                `${attemptedVerbiage} and got a result, but the result object was missing one or both of the IsActive and IsAlive ` +
                'properties.';
        } else if (!result.IsActive && !result.IsAlive) {
            email.html = `${reportedVerbiage} <strong>is not alive</strong> and <strong>is not active</strong> ${takeActionHtml}`;
        } else if (!result.IsActive) {
            email.html = `${reportedVerbiage} is alive, but <strong>is not active</strong> ${takeActionHtml}`;
        } else if (!result.IsAlive) {
            email.html = `${reportedVerbiage} is active, but <strong>is not alive</strong> ${takeActionHtml}`;
        } else {
            // All is well, no email to send
            return null;
        }
    
        email.html += `<br /><br /><i style="font-size: .75rem;">The energi.network was queried ${currentDts}</i>`;
    
        return email;
    };

    return { investigate, generateEmailDataFromInvestigation };
})();

export default investigator;
