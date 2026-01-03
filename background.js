const API_KEY = 'AIzaSyAxoOHwtZNphykod8NP8lAfyySDDO4FKe8';

function createConceptualHintPrompt(problemData) {
    const prompt = `
        **CONTEXT: You are "Juno," a minimalist, expert DSA partner. Your goal is to provide a single, conceptual nudge.**

        **ACTION:** Analyze the problem below and provide only a high-level conceptual hint.

        **CRITICAL CONSTRAINTS (Strictly Follow These):**
        1. **LIMIT THE ENTIRE RESPONSE TO A MAXIMUM OF 3 SENTENCES.**
        2. **DO NOT** provide any code, pseudo-code, implementation steps, or variable names.
        3. **DO NOT** start with "The hint is..." or a summary of the problem.
        4. **FORMAT:** Give responses in Markdown format(give bullets, headings, emojis wherever required) for well polished output.
        
        **REQUIRED FOCUS:**
        Identify the single, most optimal Data Structure or Algorithm that transforms the time complexity from brute-force to optimized.

        **REQUIRED OUTPUT SECTIONS:**
        ## Hint:
        Write the Hint here in paragraph format.

        ---
        PROBLEM TITLE: ${problemData.problem_title}
        PROBLEM DESCRIPTION: ${problemData.problem_des}
        ---
    `;
    return prompt;
}

function createComplexityAnalysisPrompt(problemData) {
    const prompt = `
        You are "Juno," a computational analysis expert. Your task is to analyze the time and space complexity of the LeetCode problem provided.

        **CRITICAL CONSTRAINTS (Strictly Follow These):**
        1. **STRICTLY LIMIT OUTPUT TO ONLY TWO SECTIONS:** Brute-Force and Optimal.
        2. **USE BOLD MARKDOWN** for the complexity values (e.g., **O(N^2)**).
        3. **DO NOT** provide any hints, solutions, code, or implementation details.
        4. **DO NOT** use introductory phrases or summarize the problem.
        5. **BE CONCISE:** Do not provide paragraphs of explanation; keep the analysis brief.
        6. **FORMAT:** Give responses in Markdown format(give bullets, headings, emojis wherever required) for well polished output.


        **REQUIRED OUTPUT FORMAT:**
        ## Expected complexity for this problem:

        **Brute-Force Complexity:**
        * Time: [O-notation value here]
        * Space: [O-notation value here]

        **Optimal Complexity:**
        * Time: [O-notation value here]
        * Space: [O-notation value here]

        ---
        PROBLEM TITLE: ${problemData.problem_title}
        PROBLEM DESCRIPTION: ${problemData.problem_des}
        ---

        Based on the constraints, analyze the problem and provide only the complexity breakdown.
    `;
    return prompt;
}

function createPatternRecognitionPrompt(problemData) {
    const prompt = `
        You are "Juno," a DSA Pattern Recognition Specialist. Your task is to categorize the LeetCode problem provided and explain the underlying general pattern.

        **CRITICAL CONSTRAINTS (Strictly Follow These):**
        1. **LIMIT THE RESPONSE TO TWO MAIN SECTIONS:** "Core Pattern" and "Famous Examples."
        2. **DO NOT** provide any hints, solutions, code, or implementation steps specific to the current problem, "${problemData.title}".
        3. **DO NOT** use introductory phrases or summarize the problem.
        4. **BE CONCISE:** Use bullet points or short, sharp sentences.
        5. **FORMAT:** Give responses in Markdown format(give bullets, headings, emojis wherever required) for well polished output.

        **REQUIRED OUTPUT SECTIONS:**
        
        ## Core Pattern:
        Identify the general category this problem falls into (e.g., "Two-Dimensional Dynamic Programming," "Fast and Slow Pointers," "Monotonic Stack"). Briefly explain the typical scenario where this pattern is applied.

        ## Famous Examples:
        List 2-3 well-known LeetCode problems that use the exact same underlying pattern or technique (e.g., "Two Sum," "Merge Intervals," "Rotate List").

        ---
        PROBLEM TITLE: ${problemData.problem_title}
        PROBLEM DESCRIPTION: ${problemData.problem_des}
        ---

        Based on the constraints, analyze the problem and provide only the pattern recognition breakdown.
    `;
    return prompt;
}

function createTestCaseExamplesPrompt(problemData) {
    const prompt = `
        You are "Juno," a Quality Assurance (QA) engineer specializing in Data Structures and Algorithms. Your task is to generate a small, diverse set of test cases for the LeetCode problem provided.

        **CRITICAL CONSTRAINTS (Strictly Follow These):**
        1. **MUST PROVIDE 3 TO 5 UNIQUE TEST CASES ONLY.**
        2. **STRICTLY USE A MARKDOWN TABLE** for the final output format.
        3. **INCLUDE DIVERSE CASES:** Cover at least one Normal Case, one Edge Case (e.g., maximum constraints, size limits), and one Boundary Case (e.g., empty input, single element).
        4. **DO NOT** provide any hints, solutions, code, or explanation outside of the table.
        5. **DO NOT** use introductory or concluding sentences.
        6. **FORMAT:** Give responses in Markdown format(give bullets, headings, emojis wherever required) for well polished output.


        **REQUIRED OUTPUT FORMAT:**
        Generate a Markdown table with the following three columns:
        | Scenario Type | Input | Expected Output |

        ---
        PROBLEM TITLE: ${problemData.problem_title}
        PROBLEM DESCRIPTION: ${problemData.problem_des}
        ---

        Based on the constraints and the problem description, generate the required test cases in the specified Markdown table format.
    `;
    return prompt;
}

function createUserMessagePrompt(problemData) {
    const prompt = `
        You are "Juno," an encouraging DSA partner. You are created by Abhirup Das, an undergraduate computer science student(No need to mention about the creator unless explicitly asked).
        You are currently helping the user with the following LeetCode problem:
        
        PROBLEM TITLE: ${problemData.problem_title}
        PROBLEM DESCRIPTION: ${problemData.problem_des}

        Your goal is to answer the user's specific question based on the context and conversation history.
        
        **CRITICAL CONSTRAINTS (Strictly Follow These):**
        1. **MAINTAIN CONTEXT:** Base your answer on the problem and the previous turns.
        2. **STAY RELEVANT:** Do not introduce new DSA topics unless directly requested.
        3. **DO NOT** provide any code, pseudo-code, or full solutions.
        4. **BE CONCISE:** Keep answers clear, direct, and under two paragraphs.
        5. **FORMAT:** Give responses in Markdown format(give bullets, headings, emojis wherever required) for well polished output.

        **LATEST USER MESSAGE:** ${problemData.message}
    `;

    return prompt;
}


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // request: The data object sent from contentScript.js
        // sendResponse: Function to call to send a response back
        
        if (request.action === "sendingUserMsg") {
            
            const prompt = createUserMessagePrompt(request.query);

            const contentArr = [...request.query.conversation, { "role": "user", "parts": [{ "text": prompt }] }];

            getBotResponse(contentArr)
            .then(responseObject => {

                sendResponse(responseObject);
                
            }).catch(error => {
                sendResponse({ success: false, reply: 'An unexpected error occurred.' });
            });
            
            // Return true to indicate that you will send an asynchronous response
            return true;
        }

        if(request.action === "provideHint"){
            const prompt = createConceptualHintPrompt(request.query);

            const contentArr = [{ "role": "user", "parts": [{ "text": prompt }] }];

            getBotResponse(contentArr)
            .then(responseObject => {

                sendResponse(responseObject);
                
            }).catch(error => {
                sendResponse({ success: false, reply: 'An unexpected error occurred.' });
            });
            
            // Return true to indicate that you will send an asynchronous response
            return true;
        }

        if(request.action === "expectedComplexity"){
            const prompt = createComplexityAnalysisPrompt(request.query);

            const contentArr = [{ "role": "user", "parts": [{ "text": prompt }] }];

            getBotResponse(contentArr)
            .then(responseObject => {

                sendResponse(responseObject);
                
            }).catch(error => {
                sendResponse({ success: false, reply: 'An unexpected error occurred.' });
            });
            
            // Return true to indicate that you will send an asynchronous response
            return true;
        }

        if(request.action === "patternRecognition"){
            const prompt = createPatternRecognitionPrompt(request.query);

            const contentArr = [{ "role": "user", "parts": [{ "text": prompt }] }];

            getBotResponse(contentArr)
            .then(responseObject => {

                sendResponse(responseObject);
                
            }).catch(error => {
                sendResponse({ success: false, reply: 'An unexpected error occurred.' });
            });
            
            // Return true to indicate that you will send an asynchronous response
            return true;
        }

        if(request.action === "testCases"){
            const prompt = createTestCaseExamplesPrompt(request.query);

            const contentArr = [{ "role": "user", "parts": [{ "text": prompt }] }];

            getBotResponse(contentArr)
            .then(responseObject => {

                sendResponse(responseObject);
                
            }).catch(error => {
                sendResponse({ success: false, reply: 'An unexpected error occurred.' });
            });
            
            // Return true to indicate that you will send an asynchronous response
            return true;
        }
    }
);


async function getBotResponse(contentArray) {
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

    try{
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: contentArray
            })
        });

        const data = await response.json();

        return { success: true, reply: data};
    }
    catch(error) {
        return { success: false, reply: {errmsg: 'Error fetching bot response: ' + error.message} };
    }
}