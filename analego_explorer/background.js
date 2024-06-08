chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "search") {
        fetch(request.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "query": request.query
            })
        })
        .then(response => response.json())
        .then(data => sendResponse({success: true, data: data}))
        .catch(error => sendResponse({success: false, error: error.message}));
        return true;  // Indicates to Chrome that the response will be asynchronous.
    }
});
