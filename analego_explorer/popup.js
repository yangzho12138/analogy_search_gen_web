
let selectNode = document.getElementById('select');

chrome.storage.sync.get(['switch'], function (result) {
    if (result.switch) {
            selectNode.value = result.switch; 
    }
});

selectNode.onchange = function () {
    console.log("selectNode", this.value);
    chrome.storage.sync.set({switch: this.value});

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {switch: this.value});
    });
};

let selectContentAwareNode = document.getElementById('select-content');

chrome.storage.sync.get(['contentAware'], function (result) {
    if (result.contentAware) {
        selectContentAwareNode.value = result.contentAware;
    }
});

selectContentAwareNode.onchange = function () {
    console.log("selectContentAwareNode", this.value);
    chrome.storage.sync.set({contentAware: this.value});

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {contentAware: this.value});
    });
}

