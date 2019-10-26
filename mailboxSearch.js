import mailbox from "./mailbox";

function mailboxSearch(object, callback) {

    let email = object.email,
        password = object.password,
        title = object.title,
        keyword = object.keyword || '',
        assignee=object.assignee,
        timeout = object.timeout || 10000;

    mailbox
        .connect(email, password)
        .search({title: title, keyword: keyword,assignee:assignee, timeout: timeout}, letter => {
            callback(letter);
         
        });

    return this;
};

export default mailboxSearch;
