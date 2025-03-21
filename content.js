(function() {
    let previousSerials = new Set();

    function copyToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        console.log(`Copied to clipboard: ${text}`);
    }

    function scrapeData() {
        const firstAlert = document.querySelector('.alert-success');
        if (!firstAlert) return;

        const modelText = firstAlert.querySelector('.detect-model')?.innerText.trim();
        const boardModelMatch = modelText?.match(/\((.*?)\)/);
        const boardModel = boardModelMatch ? boardModelMatch[1] : 'N/A';

        const serial = firstAlert.querySelector('.serial-input')?.value.trim();
        copyToClipboard(serial);

        if (!serial || previousSerials.has(serial)) return;
        previousSerials.add(serial);

        const data = {
            model: modelText,
            boardModel: boardModel,
            frequency: firstAlert.querySelector('.detect-freq')?.innerText.trim(),
            hashRate: firstAlert.querySelector('.detect-hash')?.innerText.trim(),
            voltage: firstAlert.querySelector('.detect-volt')?.innerText.trim(),
            serial: serial
        };
        
        console.log('Scraped ARC Tester Data:', data);
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
