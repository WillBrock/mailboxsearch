import inbox from "inbox"
import   {simpleParser} from 'mailparser';
import waitUntil from './waituntil'


let mailbox = function () {

    this.inbox = null;

    this.connect = function (email, password) {
        this.inbox = inbox.createConnection(993, "imap.gmail.com", {
            secureConnection: true,
            auth: {
                user: email,
                pass: password
            }
        });

        this.inbox.connect();

        return this;
    };

    this._search = function (mailbox, title, keyword, assignee,callback) {
        let mailBody = null;
        this.inbox.openMailbox(mailbox, (error, info) => {
            if (error) {console.log(error)}

            this.inbox.listMessages(-10, async (err, messages) => {
                if (err) {console.log(err)}

                for (let i = 0; i < messages.length; i++) {
                    let message = messages[i];
                    if (message.title.includes(title) && message.to[0].address.includes(assignee)) {
                        let stream = this.inbox.createMessageStream(message.UID),
                            parsed = await simpleParser(stream);
                        if (parsed.text.includes(keyword)) {
                            mailBody = parsed.text;
                            break;
                        }
                    }
                }
                callback(mailBody);
            });
        });
    };

    this.search = function (mail, callback) {
        let title = mail.title,
            assignee= mail.assignee || '',
            keyword = mail.keyword || '',
            timeout = mail.timeout || 10000,
            letter = null;

        this.inbox.on("connect", () => {

            let letterIsFound = (callback) => {
                this._search("[Gmail]/All Mail", title, keyword, assignee,result => {
                    if (result) {
                        letter = result;
                        callback(result !== null);
                    } else {
                        this._search("[Gmail]/Spam", title, keyword, assignee,result => {
                            letter = result;
                            callback(result !== null);
                        })
                    }
                })
            };

            waitUntil(letterIsFound, timeout, () => {
                this.inbox.close();
                callback(letter);
            }, 10000);

        });
    }
};

export default new mailbox();

