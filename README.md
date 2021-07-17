# Energi3 Masternode Status Checker

This NodeJS utility application queries the [Energi Nexus](https://nexus.energi.network/) for the alive/active
statuses of an Energi masternode. If there is an issue with the masternode, the application sends an email to
alert of the problem.

Each run of the application queries Energi Nexus to get the status of the masternode. A future version of
the app _may_ include a service which manages scheduled runs of the status polling. For now, individual runs 
of the app should be managed by a scheduler such as crontab. It is _not_ recommended to poll with high
frequency as you risk being rate-limited (or banned) from reaching the Energi Nexus. A ten minute interval
achieves a good balance which will keep you off the naughty list yet alert you early enough before your
masternode is denounced (two hours after its heartbeat is lost).

## Setup/Configuration
In the root folder (where `index.js` resides), ensure you have a `.env` file with the following configurations:
- `MAIL_FROM_ADDRESS` - The address the email should appear to be from.
- `MAIL_FROM_NAME` - The name to use as the sender of the email. Defaults to "Energi3 Masternode Checker."
- `MAIL_TO_ADDRESS` - The address which should receive the email.
- `ENERGI3_MASTERNODE_ID` - The id of the masternode.
- `DEBUG` - Set to `true` or `false`. Optional.

An example configuration:
```txt
MAIL_FROM_ADDRESS=no-reply@my-vps-miner.com
MAIL_FROM_NAME=Energi3 Masternode Checker
MAIL_TO_ADDRESS=my-personal-email@gmail.com
ENERGI3_MASTERNODE_ID=0x0e4e3e55b97723e8ef2e8721f4c5177cda244744
```

Note: The `ENERGI3_MASTERNODE_ID` config is not your enode address nor is it your Energi account id. To find your
masternode id, launch the JavaScript console of Energi Core Node (commonly `energi3 attach`) and run
`masternode.masternodeInfo('{your_account_id}')`. In the returned key:value pairs, the id of your masternode is the
value for the key `masternode`. If you have trouble remembering your account id, while in the JavaScript console, run
`personal.listAccounts`.

## Running the Application
It's as simple as `npm start`.

The following is a sample crontab expression which runs the application every 10 minutes using the `nrgstaker` user
account.

`*/10 * * * * nrgstaker cd /home/nrgstaker/energi3-masternode-status-checker && npm start`

## Email Subsystem
The application uses [Nodemailer](https://nodemailer.com/) as its emailer. Nodemailer allows for differing SMTP
transports, but as of the current version of Energi3 Masternode Status Checker, Nodemailer is hard-coded to use
[Postfix `sendmail`](http://www.postfix.org/sendmail.1.html). A future version of Energi3 Masternode Status Checker will
allow for pass-through configuration of Nodemailer in order to customize the SMTP transport.

## Caveat
When the application sends an email, `sendmail` may rewrite the from address. This can be corrected by configuring
`sendmail` to masquerade the sender address. The implementation of this is outside the scope of this application, but be
sure to Google "sendmail masquerade domaintable" and you're sure to find a few tutorials to attempt.
