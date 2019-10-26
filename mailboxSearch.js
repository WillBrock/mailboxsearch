import mailbox from "./mailbox";

function mailboxSearch(object) {

    let email = object.email,
        password = object.password,
        title = object.title,
        keyword = object.keyword || '',
        assignee=object.assignee,
        timeout = object.timeout || 10000;

    return new Promise((resolve, reject) => {
       mailbox
        .connect(email, password)
        .search({title: title, keyword: keyword,assignee:assignee, timeout: timeout}, letter => {
            resolve(letter);
        }); 
    });
};

export default mailboxSearch;
