(function() {
    let previousCombinations = new Map();
    let previousCopy = "";

    
    function scrapeData() {
        function copyToClipboard(text) {
            if (text == "undefined" || text == "") return;
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            console.log(`Copied to clipboard: ${text}`);
        }

        const firstAlert = document.querySelector('.alert-success');
        if (!firstAlert) return;

        const modelText = firstAlert.querySelector('.detect-model')?.innerText.trim();
        const boardModelMatch = modelText?.match(/\((.*?)\)/);
        const boardModel = boardModelMatch ? boardModelMatch[1] : 'N/A';

        const serial = firstAlert.querySelector('.serial-input')?.value.trim();
        if (serial && serial != previousCopy){
            previousCopy = serial;
            copyToClipboard(serial);
        }

        if (!serial || previousCombinations.has(serial) && previousCombinations.get(serial) === boardModel) {
            return;
        }
        previousCombinations.set(serial, boardModel);

        const data = {
            model: modelText,
            boardModel: boardModel,
            frequency: firstAlert.querySelector('.detect-freq')?.innerText.trim(),
            hashRate: firstAlert.querySelector('.detect-hash')?.innerText.trim(),
            serial: serial
        };
        
        console.clear();
        console.log('Scraped ARC Tester Data:', data);
        sendBoardDataToFlask(data);
    }

    const FLASK_HOST = 'http://10.2.250.52:80';

    function sendBoardDataToFlask(data) {
        fetch(`${FLASK_HOST}/update_board`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (res.ok) {
                console.log('Board data sent successfully!');
            } else {
                console.warn('Failed to send board data:', res.status);
            }
        })
        .catch(err => {
            console.error('Error sending board data:', err);
        });
    }


    function observeChanges() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(scrapeData);
        observer.observe(targetNode, config);
    }

    scrapeData();
    observeChanges();
})();
