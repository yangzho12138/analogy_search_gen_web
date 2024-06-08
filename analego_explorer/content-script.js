function Panel() {
    this.create()
    this.bind()
}

Panel.prototype.create = function () {
    let container = document.createElement('div')

    // <header>Analego Search<span class="pin"></span><span class="close">X</span></header>
    let html = `
        <div class="custom-header">
            <button class="pin">Pin</button>
            <header>Analego Search</header>
            <button class="close">X</button>
        </div>
        <main>
            <div class="source">
                <div class="title">
                    <p>Search Key Words</p>
                    <button class="copy-btn">Copy</button>
                </div>
                <!-- dynamic insert -->
                <div class="content"></div>
            </div>
            <div class="dest">
                <div class="title">
                    <p>Analogies</p>
                    <button class="copy-btn">Copy</button>
                </div>
                <!--api call, async -->
                <div class="content">
                    ...   
                </div>
            </div>
        </main>
    `

    container.innerHTML = html
    
    // container.classList.add('translate-panel')
    container.classList.add('search-panel')
    
    document.body.appendChild(container)
    
    this.container = container

    this.pin = container.querySelector('.pin');
    
    this.close = container.querySelector('.close')
    
    this.source = container.querySelector('.source .content')
    
    this.dest = container.querySelector('.dest .content')


    
}


Panel.prototype.show = function () {
    this.container.classList.add('show')
}

Panel.prototype.hide = function () {
    this.container.classList.remove('show')
}


Panel.prototype.bind = function () {
    this.close.onclick = () => {
        this.hide()
    }

    let isPinned = false; 
    let isDragging = false; 
    let start = { x: 0, y: 0 }; 
    let offset = { x: 0, y: 0 }; 

    const onDrag = (e) => {
        if (isDragging) {
            this.container.style.left = (e.clientX - start.x + offset.x) + 'px';
            this.container.style.top = (e.clientY - start.y + offset.y) + 'px';
        }
    };

    this.pin.addEventListener('click', () => {
        isPinned = !isPinned;
        this.pin.classList.toggle('pinned', isPinned);
        if (isPinned) {
            document.removeEventListener('mousemove', onDrag);
        }
    });

    this.container.querySelector('.custom-header').addEventListener('mousedown', (e) => {
        if (!isPinned) {
            isDragging = true;
            start = { x: e.clientX, y: e.clientY };
            offset = { x: this.container.offsetLeft, y: this.container.offsetTop };
            document.addEventListener('mousemove', onDrag);
        }
    });

    // ZL: changed this to container instead of document.
    this.container.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
        }
    });

    


    // let isPinned = false; 
    // let dragOffset = {};
    // const header = this.container.querySelector('header');

    // this.pin.addEventListener('click', () => {
    //     isPinned = !isPinned;
    //     this.pin.classList.toggle('pinned', isPinned);
    // });

    // header.addEventListener('mousedown', (e) => {
    //     if (!isPinned) {
    //         dragOffset.x = e.clientX - this.container.offsetLeft;
    //         dragOffset.y = e.clientY - this.container.offsetTop;
    //         header.classList.add('dragging');
    //     }
    // });

    // document.addEventListener('mousemove', (e) => {
    //     if (header.classList.contains('dragging')) {
    //         this.container.style.left = (e.clientX - dragOffset.x) + 'px';
    //         this.container.style.top = (e.clientY - dragOffset.y) + 'px';
    //     }
    // });

    // document.addEventListener('mouseup', () => {
    //     header.classList.remove('dragging');
    // });

    // this.close.onclick = () => {
    //     this.hide();
    // };
}

//content_aware
Panel.prototype.updateDisplay = function() {
    this.show();  
};


Panel.prototype.search = function(raw){
    this.source.innerText = raw
    this.dest.innerText = '...'

    // const apiUrl = 'https://timan.cs.illinois.edu/analegosearch/api/search';

    // // api call
    // fetch(apiUrl, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         "query": raw
    //     })
    // }).then(res => res.json()).then(res => {
    //     data = res.docs;
    //     console.log(data)
    //     cards = document.createElement('div')
    //     data.forEach(element => {
    //         card = document.createElement('div')
    //         card.innerHTML = `
    //             <div class="title"> ${element.title} </div>
    //             <div class="content"> ${element.content} </div>
    //             <hr/>
    //         `
    //         cards.appendChild(card)
    //     });

    //     this.dest.innerHTML = cards.innerHTML
    // })



    chrome.runtime.sendMessage({
        action: "search",
        // apiUrl: 'https://timan.cs.illinois.edu/analegosearch/api/search',
        apiUrl: 'http://localhost:8001/api/search',
        query: raw
    }, response => {
        if (response.success) {
            const data = response.data.docs;
            console.log(data);
            const cards = document.createElement('div');
            cards.style.width = '100%';
            data.forEach(element => {
                const card = document.createElement('div');
                card.innerHTML = `
                    <div class="title"> Target: ${element.target} </div>
                    <div class="title"> Prompt: ${element.prompt} </div>
                    <div class="content"> ${element.analogy} </div>
                    <hr/>
                `;
                cards.appendChild(card);
            });
            this.dest.innerHTML = cards.innerHTML;
        } else {
            console.error('Error:', response.error);
            this.dest.innerText = 'Error loading data.';
        }
    });    

    

    //content_aware
    let context = this.extractContext();
    let topic = this.extractTopic(context); 

    
    if (contentAwareState === 'on') {
        this.addContentAwareSection(context, topic);
    }

    this.updateDisplay();  
}

Panel.prototype.addContentAwareSection = function(context, topic) {
    let contentAwareSection = this.container.querySelector('.content-aware-section');
    if (!contentAwareSection) {
        contentAwareSection = document.createElement('div');
        contentAwareSection.classList.add('content-aware-section');
        contentAwareSection.innerHTML = `
            <div class="title">
                <p>Context</p>
                <button class="copy-btn">Copy</button>
            </div>
            <div class="content context-content"></div>
            <div class="title">Topic</div>
            <div class="content topic-content"></div>
        `;
        this.container.querySelector('.source').appendChild(contentAwareSection);
    }


    contentAwareSection.querySelector('.context-content').textContent = context;
    contentAwareSection.querySelector('.topic-content').textContent = topic;


    // copy function for content
    var copyBtn = contentAwareSection.querySelector('.copy-btn');

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(context)
    });

};









const stopwords = [
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 
    'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 
    'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 
    'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 
    'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 
    'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 
    'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
];


Panel.prototype.extractTopic = function(text) {
    const words = text.toLowerCase().match(/\w+/g) || [];
    const freqMap = {};
    words.forEach(word => {
        if (!stopwords.includes(word)) {  
            freqMap[word] = (freqMap[word] || 0) + 1;
        }
    });
    const sortedWords = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
    return sortedWords.length > 0 ? sortedWords[0][0] : "No significant words found";
};




Panel.prototype.pos = function (pos) {
    this.container.style.top = pos.y + 'px'
    this.container.style.left = pos.x + 'px'
}


// content_aware
Panel.prototype.extractContext = function() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return "";

    let container = selection.getRangeAt(0).commonAncestorContainer;
    // Ensure we have an element, not a text node
    while (container.nodeType !== 1) {
        container = container.parentNode;
    }

    // Assuming paragraphs are contained in <p> tags
    if (container.tagName.toLowerCase() !== 'p') {
        container = container.closest('p');
    }

    return container ? container.textContent : "";
};


let panel = new Panel()


window.onmouseup = function (e) {
    console.log(selectState)
    if (selectState === 'off') 
        return
    
    let raw = window.getSelection().toString().trim()

    if(contentAwareState === 'on'){
        // advanced content aware function
        console.log('content aware')
    }

    let x = e.pageX
    let y = e.pageY

    if (!raw) {
        return
    } else {
        panel.pos({x: x, y: y})
        // panel.translate(raw)
        console.log(raw)
        panel.search(raw)
        panel.show()
    }
}


let selectState = 'off'

chrome.storage.sync.get(['switch'], function (result) {
    if (result.switch) {
        selectState = result.switch
    }
});

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.switch) {
            selectState = request.switch
        }
});

let contentAwareState = 'off'

chrome.storage.sync.get(['contentAware'], function (result) {
    if (result.contentAware) {
        contentAwareState = result.contentAware
    }
});

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.contentAware) {
            contentAwareState = request.contentAware
        }
});