let brwsr;
let re_url = /https:\/\/.*(com|org)(.*)/;
let open_in;

const FF = 'firefox';
const COLAB_URL = 'https://colab.research.google.com';
const NBVIEWER_URL = 'https://nbviewer.jupyter.org';
const GITHUB_URL = 'https://github.com'
const SLASH_GITHUB = '/github'

$(document).ready(() => {
	console.log('ready');
	brwsr = navigator.sayswho.split(" ")[0].toLowerCase();

})

$('#btn--colab').on('click', () => {
    open_in = COLAB_URL;
    query_curr_tab();
});

$('#btn--nbviewer').on('click', () => {
    open_in = NBVIEWER_URL;
    query_curr_tab();
});

$('#btn--github').on('click', () => {
    open_in = GITHUB_URL;
    query_curr_tab();
});

let query_curr_tab = () => {
    if (brwsr == FF) {
        get_main().tabs.query({
            currentWindow: true,
            active: true
        }).then(open_required_url).catch(on_error);
    } else {
        get_main().tabs.query({
            currentWindow: true,
            active: true
        }, open_required_url);
    }
}

let open_required_url = (tabs) => {
    curr_tab_url = tabs[0].url;

    // Removing in-page header info from URL
    let get_index_of_hash = curr_tab_url.indexOf('#');
    if (get_index_of_hash !== -1)
        curr_tab_url = curr_tab_url.substring(0, curr_tab_url.indexOf('#'));

    if (curr_tab_url.endsWith('.ipynb')) {
        let url_array = curr_tab_url.match(re_url);

        let has_slash_github = url_array[2].startsWith('/github');
        if (!has_slash_github && open_in !== GITHUB_URL)
            open_in += SLASH_GITHUB;
        else if (open_in === GITHUB_URL && has_slash_github) {
            url_array[2] = url_array[2].substring(7);
        }

        new_url = open_in + url_array[2];

        get_main().tabs.create({url: new_url});

    } else {
        alert('Not a Github Hosted NoteBook');
    }
}

let on_error = (err) => {
    console.log(err);
}

function get_main() {
    if (brwsr == FF) return browser;
    else return chrome;
}

/* https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser */
navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();
