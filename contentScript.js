const SIDEBAR_ID = 'juno-sidebar';
const TOGGLE_BTN_ID = 'juno-toggle-btn';
const title_container = document.querySelector('.text-title-large.font-semibold.text-text-primary');
const problem_title = title_container.querySelector('a.no-underline').innerText;
const description_container = document.querySelector('[data-track-load="description_content"]');
const problem_des = description_container.querySelector('p').innerText;

var conversation = [];

function initializeJuno() {
    
    // Inject the button
    injectToggleButton(problem_title);
}

function injectToggleButton(problem_title) {
    const toggleBtn = document.createElement('div');
    toggleBtn.id = TOGGLE_BTN_ID;
    toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1a1a2e" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
        Ask Juno`;
    toggleBtn.className = 'juno-toggle-btn';

    //applying styles
    toggleBtn.style.display = 'inline-flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.style.padding = '6px 10px';
    toggleBtn.style.gap = '6px';
    toggleBtn.style.borderRadius = '9999px';
    toggleBtn.style.background = '#fec467ff';
    toggleBtn.style.color = '#1a1a2e';
    toggleBtn.style.cursor = 'pointer';

    const parentContainer = document.querySelector('.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5');
    const juno_btn_container = parentContainer.querySelector('[class="flex gap-1"]');

    juno_btn_container.appendChild(toggleBtn);
    
    // Attach the main function to the click event
    toggleBtn.addEventListener('click', 
        () => {
            activateJunoSidebar(problem_title);
        }
    );
}

async function activateJunoSidebar(problem_title) {
    // Check if sidebar already exists
    if (document.getElementById(SIDEBAR_ID)) {
        // Sidebar already exists, just toggle visibility
        const sidebar = document.getElementById(SIDEBAR_ID);
        sidebar.style.display = (sidebar.style.display === 'block') ? 'none' : 'block';
        return;
    }

    // create sidebar div
    const sidebar = document.createElement('div');
    sidebar.id = SIDEBAR_ID;
    sidebar.innerHTML = `
        <style>
            * {
                margin: 0;
                padding: 0;
            }

            #juno-sidebar {
                position: fixed;
                top: 0;
                right: 0;
                width: 30rem;
                height: 100vh;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #1a1a1a;
                color: #e4e4e7;
                display: block;
                overflow: hidden;
                z-index: 10000;
                border-left: 1px solid #fec467ff;
            }

            .header {
                background: #282828;
                padding: 16px;
                border-bottom: 1px solid #595959;
            }

            .problem-title {
                font-size: 16px;
                font-weight: 600;
                color: white;
                text-align: left;
                line-height: 1.4;
            }

            .content-area {
                padding: 16px;
                overflow-y: auto;
                max-height: 80vh;
                background: #1a1a1a;
            }

            .content-area::-webkit-scrollbar {
                width: 8px;
            }

            .content-area::-webkit-scrollbar-track {
                background: #2c2c2c;
            }

            .content-area::-webkit-scrollbar-thumb {
                background: #9f9f9f;
                border-radius: 4px;
            }

            .content-area::-webkit-scrollbar-thumb:hover {
                background: #b8b8b8;
            }

            .welcome-message {
                text-align: center;
                color: #a1a1aa;
                padding: 40px 20px;
                font-size: 14px;
            }

            .tab-container {
                background: #1a1a1a;
                padding: 12px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                position: absolute;
                bottom: 100px;
                width: 100%;
            }

            .tab-btn {
                min-width: fit-content;
                padding: 8px 16px 8px 16px;
                background: #373737;
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .tab-btn:hover {
                background: #626262;
                transform: translateY(-2px);
            }

            .input-container {
                background: #1e1f20;
                border-top: 2px solid #595959;
                padding-bottom: 12px;
                display: flex;
                gap: 8px;
                position: absolute;
                bottom: 0;
                width: 100%;
                border-radius: 12px 12px 0 0;
            }

            .input-box {
                flex: 1;
                padding: 15px;
                background: #1e1f20;
                border-radius: 8px;
                color: #e4e4e7;
                font-size: 14px;
                font-family: inherit;
                transition: all 0.3s ease;
                resize: none;
                max-height: 80px;
                overflow-y: auto;
            }
            .input-box:focus {
                outline: none;
            }

            .input-box::placeholder {
                color: #929295ff;
            }

            .myMessage-content {
                background: #4c4c4cff;
                color: white;
                padding: 8px 16px 8px 16px;
                border-radius: 20px 0px 20px 20px;
                margin-bottom: 12px;
                font-size: 14px;
                line-height: 1.6;
                width: fit-content;
                max-width: 80%;
                word-break: wrap;
                margin-left: auto;
                margin-right: 0;
            }
            .response-content {
                color: white;
                padding: 12px;
                margin-bottom: 12px;
                font-size: 14px;
                line-height: 1.6;
                opacity: 0;
                visibility: hidden;
                transition: all 1s ease;
            }
            .response-content.is-visible{
                opacity: 1;
                visibility: visible;
            }
            #loader {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: fit-content;
                height: fit-content;
                border-radius: 50px;
            }
            #loader .lucide.lucide-sparkles-icon{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                fill: white;
                color: white;
            }
            #loader .lucide.lucide-loader-circle-icon {
                animation: spin 0.8s linear infinite;
                color: #fec467ff;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        <div class="header">
            <div class="problem-title" id="problemTitle">${problem_title}</div>
        </div>

        <div class="content-area" id="contentArea">
            <div class="welcome-message">
                Select a tab or ask a question to get started with AI assistance for this problem.
            </div>
        </div>

        <div class="tab-container">
            <button class="tab-btn" data-tab="hint">Provide Hint</button>
            <button class="tab-btn" data-tab="pattern">Pattern Recognition</button>
            <button class="tab-btn" data-tab="complexity">Expected Complexity</button>
            <button class="tab-btn" data-tab="testcase">Give Examples</button>
        </div>

        <div class="input-container">
            <textarea class="input-box" id="inputBox" placeholder="Ask for help..." rows="5"></textarea>
        </div>`;

    document.body.appendChild(sidebar);

    attachSidebarListeners();
}

// Sidebar functionality (Attach sidebar listeners)
function attachSidebarListeners() {
    document.getElementById('inputBox').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    document.querySelector('[data-tab="hint"]').addEventListener('click', () => {
        getHint();
    });

    document.querySelector('[data-tab="complexity"]').addEventListener('click', ()=>{
        getComplexity();
    })

    document.querySelector('[data-tab="pattern"]').addEventListener('click', ()=>{
        getPattern();
    })

    document.querySelector('[data-tab="testcase"]').addEventListener('click', ()=>{
        getTestcases();
    })
}

function getTestcases(){
    const inputbox = document.getElementById('inputBox');
    inputbox.value = '';
    inputbox.disabled = true;
    displayMessage("Give Examples");

    chrome.runtime.sendMessage(
        { action: "testCases", query: {problem_title, problem_des} },
        (response) => {
            // This callback handles the response from background.js
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
                return;
            }

            if (response && response.success === true) {

                const textResponse = response?.reply?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response text found.';
                console.log(response.reply);

                displayResponse(textResponse);
                inputbox.disabled = false;

                conversation.push({ "role": "user", "parts": [{ "text": "Provide some useful testcases"}] });
                conversation.push({ "role": "model", "parts": [{ "text": textResponse}] });
                console.log(conversation);

            } else if (response && response.success === false) {

                console.error("API Error:", response.reply.errmsg);
                // displayResponse(`Bot Error: ${response.reply}`);

            } else {

                console.error("Unexpected response format:", response);
                // displayResponse("Error: Received an invalid response from the bot.");
            }
        }
    );
}

function getPattern(){
    const inputbox = document.getElementById('inputBox');
    inputbox.value = '';
    inputbox.disabled = true;
    displayMessage("Pattern Recognition");

    chrome.runtime.sendMessage(
        { action: "patternRecognition", query: {problem_title, problem_des} }, 
        (response) => {
            // This callback handles the response from background.js
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
                return;
            }

            if (response && response.success === true) {

                const textResponse = response?.reply?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response text found.';
                console.log(response.reply);

                displayResponse(textResponse);
                inputbox.disabled = false;

                conversation.push({ "role": "user", "parts": [{ "text": "Insightful pattern recognition for the leetcode problem"}] });
                conversation.push({ "role": "model", "parts": [{ "text": textResponse}] });
                console.log(conversation);

            } else if (response && response.success === false) {

                console.error("API Error:", response.reply.errmsg);
                // displayResponse(`Bot Error: ${response.reply}`);

            } else {

                console.error("Unexpected response format:", response);
                // displayResponse("Error: Received an invalid response from the bot.");
            }
        }
    );
}

function getComplexity(){
    const inputbox = document.getElementById('inputBox');
    inputbox.value = '';
    inputbox.disabled = true;
    displayMessage("Expected Complexity");

    chrome.runtime.sendMessage(
        { action: "expectedComplexity", query: {problem_title, problem_des} }, 
        (response) => {
            // This callback handles the response from background.js
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
                return;
            }

            if (response && response.success === true) {

                const textResponse = response?.reply?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response text found.';
                console.log(response.reply);

                displayResponse(textResponse);
                inputbox.disabled = false;

                conversation.push({ "role": "user", "parts": [{ "text": "Expected complexity for the problem"}] });
                conversation.push({ "role": "model", "parts": [{ "text": textResponse}] });
                console.log(conversation);

            } else if (response && response.success === false) {

                console.error("API Error:", response.reply.errmsg);
                // displayResponse(`Bot Error: ${response.reply}`);

            } else {

                console.error("Unexpected response format:", response);
                // displayResponse("Error: Received an invalid response from the bot.");
            }
        }
    );
}

function getHint(){
    const inputbox = document.getElementById('inputBox');
    inputbox.value = '';
    inputbox.disabled = true;

    displayMessage("Provide Hint");

    chrome.runtime.sendMessage(
        { action: "provideHint", query: {problem_title, problem_des} }, 
        (response) => {
            // This callback handles the response from background.js
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
                return;
            }

            if (response && response.success === true) {

                const textResponse = response?.reply?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response text found.';
                console.log(response.reply);

                displayResponse(textResponse);
                inputbox.disabled = false;

                conversation.push({ "role": "user", "parts": [{ "text": "Provide a conceptual hint"}] });
                conversation.push({ "role": "model", "parts": [{ "text": textResponse}] });
                console.log(conversation);

            } else if (response && response.success === false) {

                console.error("API Error:", response.reply.errmsg);
                // displayResponse(`Bot Error: ${response.reply}`);

            } else {

                console.error("Unexpected response format:", response);
                // displayResponse("Error: Received an invalid response from the bot.");
            }
        }
    );
}

function sendMessage() {
    const input = document.getElementById('inputBox');
    const message = input.value.trim();
    input.disabled = true;
    
    if (message) {
        displayMessage(message);
        input.value = '';
        
        //Send Message to Background Script ---
        chrome.runtime.sendMessage(
            { action: "sendingUserMsg", query: {problem_title, problem_des, conversation, message} },
            (response) => {
                // This callback handles the response from background.js
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError.message);
                    return;
                }

                if (response && response.success === true) {

                    const textResponse = response?.reply?.candidates?.[0]?.content?.parts?.[0]?.text ?? response.reply.error.message;
                    console.log(response.reply);

                    displayResponse(textResponse);
                    input.disabled = false;

                    conversation.push({ "role": "user", "parts": [{ "text": message}] });
                    conversation.push({ "role": "model", "parts": [{ "text": textResponse}] });
                    console.log(conversation);

                } else if (response && response.success === false) {

                    console.error("API Error:", response.reply.errmsg);
                    // displayResponse(`Bot Error: ${response.reply}`);

                } else {

                    console.error("Unexpected response format:", response);
                    // displayResponse("Error: Received an invalid response from the bot.");
                }
            }
        );
    }
}

function displayMessage(message) {
    const contentArea = document.getElementById('contentArea');
    const welcomeMsg = contentArea.querySelector('.welcome-message');
    const tabs = document.querySelector('.tab-container');
    if (tabs) tabs.style.display = 'none';
    if (welcomeMsg) welcomeMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'myMessage-content';
    msgDiv.textContent = message;

    contentArea.appendChild(msgDiv);

    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'loader';
    loaderDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
    `;
    contentArea.appendChild(loaderDiv);

    contentArea.scrollTop = contentArea.scrollHeight;
}

function displayResponse(response) {
    const contentArea = document.getElementById('contentArea');

    //parse the markdown text into clean html
    const cleanHtml = marked.parse(response);

    const respDiv = document.createElement('div');
    respDiv.className = 'response-content';
    respDiv.innerHTML = cleanHtml;

    const loaderDiv = contentArea.querySelector('#loader');
    if (loaderDiv) loaderDiv.remove();
    contentArea.appendChild(respDiv);
    setTimeout(() => {
        respDiv.classList.add('is-visible');
    }, 50);
    contentArea.scrollTop = contentArea.scrollHeight;
}

initializeJuno();