/* Chrome Extension Content Script */
(function() {
    function createTestOutputBox() {
        const box = document.createElement('div');
        box.id = 'arc-tester-output';
        box.style.position = 'fixed';
        box.style.top = '10px';
        box.style.left = '10px';
        box.style.width = '400px';
        box.style.backgroundColor = 'white';
        box.style.border = '4px solid red';
        box.style.padding = '10px';
        box.style.zIndex = '10000';
        box.style.fontSize = '16px';
        box.style.fontFamily = 'monospace';
        box.style.overflow = 'auto';
        box.innerHTML = '<strong>ARC Tester Data:</strong><br>Waiting for data...';
        document.body.appendChild(box);
    }

    function updateTestOutput(data) {
        const box = document.getElementById('arc-tester-output');
        if (box) {
            box.innerHTML = `<strong>ARC Tester Data:</strong><br>
                Model: ${data.model || 'N/A'}<br>
                Board Model: ${data.boardModel || 'N/A'}<br>
                Frequency: ${data.frequency || 'N/A'}<br>
                Hash Rate: ${data.hashRate || 'N/A'}<br>
                Voltage: ${data.voltage || 'N/A'}<br>
                Serial: ${data.serial || 'N/A'}`;
        }
    }

    function scrapeData() {
        const modelText = document.querySelectorAll('.detect-model')[0]?.innerText.trim();
        const boardModelMatch = modelText?.match(/\((.*?)\)/);
        const boardModel = boardModelMatch ? boardModelMatch[1] : 'N/A';

        const data = {
            model: modelText,
            boardModel: boardModel,
            frequency: document.querySelectorAll('.detect-freq')[0]?.innerText.trim(),
            hashRate: document.querySelectorAll('.detect-hash')[0]?.innerText.trim(),
            voltage: document.querySelectorAll('.detect-volt')[0]?.innerText.trim(),
            serial: document.querySelectorAll('.serial-input')[0]?.value.trim()
        };
        console.log('Scraped ARC Tester Data:', data);
        updateTestOutput(data);
    }

    function observeChanges() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(scrapeData);
        observer.observe(targetNode, config);
    }

    createTestOutputBox();
    scrapeData();
    observeChanges();
})();
