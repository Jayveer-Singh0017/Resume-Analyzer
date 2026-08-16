   // GET ELEMENTS
const fileInput =
    document.getElementById("resumeFile");

const filePlaceholder =
    document.getElementById("filePlaceholder");

const fileName =
    document.getElementById("fileName");

const fileType =
    document.getElementById("fileType");

const analyzeButton =
    document.getElementById("analyzeButton");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const welcome =
    document.getElementById("welcome");

   // FILE SELECTION
fileInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (!file) {

            filePlaceholder.style.display = "block";

            fileName.style.display = "none";

            fileType.style.display = "none";

            return;
        }

        /* Check PDF */
        if (
            file.type !== "application/pdf" &&
            !file.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {
            alert("Please select a PDF file.");
            fileInput.value = "";
            return;
        }

        /* Display filename */
        filePlaceholder.style.display = "none";
        fileName.style.display = "block";
        fileType.style.display = "block";
        fileName.textContent = file.name;
        fileType.textContent = "PDF document";
    }
);

   // ANALYZE BUTTON
analyzeButton.addEventListener(
    "click",
    analyzeResume
);

   // ANALYZE RESUME
async function analyzeResume() {
    console.log("Analyze Resume clicked");

       // CHECK FILE
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Please select a PDF file first.");
        return;
    }

    const file =
        fileInput.files[0];

       // CHECK PDF
    if (
        file.type !== "application/pdf" &&
        !file.name
            .toLowerCase()
            .endsWith(".pdf")
    ) {
        alert("Please select a PDF file.");
        return;
    }

    console.log(
        "Selected file:",
        file.name
    );

       // CREATE FORM DATA
    const formData =
        new FormData();
    formData.append(
        "file",
        file
    );

       // SHOW LOADING
    loading.style.display = "flex";
    analyzeButton.disabled = true;
    analyzeButton.querySelector(
        "span:first-child"
    ).textContent = "Analyzing...";

    /* Clear old result */
    result.innerHTML = "";

    try {
           // BACKEND REQUEST
           // DO NOT CHANGE THIS ENDPOINT
        const response =
            await fetch(
                "/api/resume/analyze-pdf",
                {
                    method: "POST",
                    body: formData
                }
            );

        console.log(
            "Response status:",
            response.status
        );

           // READ RESPONSE
        const responseText =
            await response.text();

        console.log(
            "Backend response:",
            responseText
        );

           // CHECK HTTP STATUS
        if (!response.ok) {
            throw new Error(
                "Server returned HTTP " +
                response.status +
                "\n\n" +
                responseText
            );
        }
           // PARSE JSON
        let data;
        try {
            data =
                JSON.parse(responseText);
        }
        catch (error) {
            console.error(
                "JSON parsing error:",
                error
            );
            throw new Error(
                "Backend returned an invalid JSON response.\n\n" +
                responseText
            );
        }

        console.log(
            "Parsed response:",
            data
        );

           // DISPLAY RESULT
        displayResult(data);
           // HIDE WELCOME
        welcome.style.display = "none";
        result.style.display = "block";

           // SCROLL TO RESULT
        setTimeout(
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            },
            100
        );


    }


    catch (error) {

        console.error(
            "Resume analysis failed:",
            error
        );

        welcome.style.display = "none";
        result.style.display = "block";
        result.innerHTML = `
            <div class="error-card">
                <h2>
                    ⚠ Analysis Failed
                </h2>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>

        `;

    }
    finally {

        loading.style.display = "none";
        analyzeButton.disabled = false;
        analyzeButton.querySelector(
            "span:first-child"
        ).textContent = "Analyze Resume";

    }

}

   // DISPLAY RESULT
function displayResult(data) {
    const skills =
        normalizeArray(data.skills);

    const strengths =
        normalizeArray(data.strengths);

    const weaknesses =
        normalizeArray(data.weaknesses);

    const recommendedSkills =
        normalizeArray(data.recommendedSkills);

    const jobRoles =
        normalizeArray(data.suitableJobRoles);


    const suggestions =
        normalizeArray(data.suggestions);

    const overallAssessment =
        data.overallAssessment
            ? data.overallAssessment
            : "No overall assessment available.";

    result.innerHTML = `

        <div class="chat-response">

            <!-- AI AVATAR -->
            <div class="ai-avatar">
                AI
            </div>

            <!-- RESPONSE -->
            <div class="response-content">
                <!-- HEADER -->
                <div class="response-header">
                    <span class="response-name">
                        Resume AI
                    </span>
                    <span class="response-status">
                        Analysis complete
                    </span>
                </div>
                <!-- TITLE -->
                <div class="analysis-heading">
                    <h1>
                        Resume Analysis
                    </h1>
                    <p>
                        Here's a detailed analysis of your
                        resume and career profile.
                    </p>
                </div>

                <!-- SUCCESS -->
                <div class="success-message">
                    <span class="success-dot"></span>
                    Resume analyzed successfully
                </div>

<!--                     OVERALL ASSESSMENT-->
                <div class="assessment-card">

                    <div class="assessment-title">
                        <div class="assessment-icon">
                            ✦
                        </div>

                        <h2>
                            Overall Assessment
                        </h2>

                    </div>


                    <p class="assessment-text">

                        ${escapeHtml(
        overallAssessment
    )}
                    </p>

                </div>

<!--                     RESULT GRID-->
                <div class="result-grid">
                    <!-- SKILLS -->
                    <div class="analysis-card full-width">
                        <div class="card-heading">
                            <div class="card-icon">
                                ⚡
                            </div>
                            <h3>
                                Skills
                            </h3>
                            <span class="card-count">
                                ${skills.length}
                            </span>

                        </div>


                        <div class="skill-container">

                            ${createSkillTags(
        skills
    )}
                        </div>
                    </div>
                    <!-- STRENGTHS -->
                    <div class="
                        analysis-card
                        strength-card
                    ">
                        <div class="card-heading">

                            <div class="card-icon">
                                ✓
                            </div>

                            <h3>
                                Strengths
                            </h3>

                            <span class="card-count">
                                ${strengths.length}
                            </span>

                        </div>

                        <ul class="analysis-list">

                            ${createList(
        strengths
    )}
                        </ul>
                    </div>

                    <!-- WEAKNESSES -->
                    <div class="
                        analysis-card
                        weakness-card
                    ">

                        <div class="card-heading">
                            <div class="card-icon">
                                !
                            </div>

                            <h3>
                                Areas to Improve
                            </h3>

                            <span class="card-count">
                                ${weaknesses.length}
                            </span>

                        </div>


                        <ul class="analysis-list">

                            ${createList(
        weaknesses
    )}

                        </ul>


                    </div>


                    <!-- RECOMMENDED SKILLS -->

                    <div class="analysis-card full-width">


                        <div class="card-heading">

                            <div class="card-icon">
                                ✦
                            </div>

                            <h3>
                                Recommended Skills
                            </h3>

                            <span class="card-count">
                                ${recommendedSkills.length}
                            </span>

                        </div>


                        <div class="skill-container">

                            ${createSkillTags(
        recommendedSkills
    )}

                        </div>


                    </div>


                    <!-- JOB ROLES -->

                    <div class="analysis-card full-width">


                        <div class="card-heading">

                            <div class="card-icon">
                                🎯
                            </div>

                            <h3>
                                Suitable Job Roles
                            </h3>

                            <span class="card-count">
                                ${jobRoles.length}
                            </span>

                        </div>


                        <div class="job-container">

                            ${createJobTags(
        jobRoles
    )}

                        </div>


                    </div>


                    <!-- SUGGESTIONS -->

                    <div class="analysis-card full-width">


                        <div class="card-heading">

                            <div class="card-icon">
                                💡
                            </div>

                            <h3>
                                Suggestions
                            </h3>

                            <span class="card-count">
                                ${suggestions.length}
                            </span>

                        </div>


                        <ul class="analysis-list">

                            ${createList(
        suggestions
    )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    `;

}
   // NORMALIZE ARRAY
function normalizeArray(value) {

    if (Array.isArray(value)) {
        return value;
    }

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return [];
    }
    return [String(value)];
}

   // CREATE LIST
   function createList(items) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <li>
                No information available
            </li>
        `;

    }

    return items
        .map(
            item => `
                <li>
                    ${escapeHtml(item)}
                </li>
            `
        )
        .join("");

}

   // CREATE SKILL TAGS
   function createSkillTags(items) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <span class="skill-tag">
                No skills available
            </span>
        `;

    }


    return items
        .map(
            item => `
                <span class="skill-tag">
                    ${escapeHtml(item)}
                </span>
            `
        )
        .join("");

}


   // CREATE JOB TAGS
function createJobTags(items) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <span class="job-tag">
                No suitable roles found
            </span>
        `;

    }


    return items
        .map(
            item => `
                <span class="job-tag">
                    ${escapeHtml(item)}
                </span>
            `
        )
        .join("");

}


   // ESCAPE HTML
function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }
    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}