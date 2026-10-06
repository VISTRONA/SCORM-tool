import {
    initializeScorm,
    setLocation,
    setSuspendData,
    getLocation,
    getSuspendData
} from "./scorm-adapter.js";

let course = null;
let currentSlideIndex = 0;
let visitedSlides = new Set();

const STORAGE_KEY = "scorm-player-state";

const courseTitle = document.getElementById("course-title");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const slideList = document.getElementById("slide-list");
const slideContainer = document.getElementById("slide-container");
const slideProgress = document.getElementById("slide-progress");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");


// --------------------------------------------------
// INITIALIZE PLAYER
// --------------------------------------------------

async function startPlayer() {
    initializeScorm();
    await loadCourse();
}

startPlayer();


// --------------------------------------------------
// LOAD COURSE
// --------------------------------------------------

async function loadCourse() {
    try {
        const response = await fetch("../course.json");

        if (!response.ok) {
            throw new Error(
                `Could not load course.json: ${response.status}`
            );
        }

        course = await response.json();

        courseTitle.textContent = course.course.title;

        createSlideList();

        restorePlayerState();

        renderSlide();

    } catch (error) {
        console.error("Failed to load course:", error);

        slideContainer.innerHTML = `
            <div class="error-message">
                <h2>Unable to load course</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}


// --------------------------------------------------
// ASSET PATH
// --------------------------------------------------

function getAssetPath(path) {
    if (!path) {
        return "";
    }

    // Course JSON stores assets as:
    // assets/example.png
    //
    // Player is inside:
    // player/
    //
    // Therefore:
    // ../assets/example.png

    return `../${path}`;
}


// --------------------------------------------------
// CREATE SIDEBAR
// --------------------------------------------------

function createSlideList() {
    slideList.innerHTML = "";

    course.course.slides.forEach((slide, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "slide-item";

        button.textContent =
            `${index + 1}. ${slide.title}`;

        button.addEventListener("click", () => {
            goToSlide(index);
        });

        slideList.appendChild(button);
    });
}


// --------------------------------------------------
// RENDER CURRENT SLIDE
// --------------------------------------------------

function renderSlide() {

    const slide =
        course.course.slides[currentSlideIndex];

    if (!slide) {
        console.error(
            "Slide not found:",
            currentSlideIndex
        );
        return;
    }

    visitedSlides.add(currentSlideIndex);

    slideContainer.innerHTML = "";

    const title = document.createElement("h2");

    title.textContent = slide.title;

    slideContainer.appendChild(title);


    // -----------------------------------------------
    // CONTENT
    // -----------------------------------------------

    if (slide.type === "content") {

        const content = document.createElement("p");

        content.textContent =
            slide.content || "";

        slideContainer.appendChild(content);
    }


    // -----------------------------------------------
    // IMAGE
    // -----------------------------------------------

    else if (slide.type === "image") {

        if (slide.content) {

            const content =
                document.createElement("p");

            content.textContent =
                slide.content;

            slideContainer.appendChild(content);
        }

        const image =
            document.createElement("img");

        image.src =
            getAssetPath(slide.asset.path);

        image.alt =
            slide.asset.alt || slide.title;

        image.className =
            "slide-image";

        image.onerror = () => {

            console.error(
                "Could not load image:",
                image.src
            );

            image.alt =
                "Image could not be loaded";
        };

        slideContainer.appendChild(image);
    }


    // -----------------------------------------------
    // VIDEO
    // -----------------------------------------------

    else if (slide.type === "video") {

        const video =
            document.createElement("video");

        video.controls = true;

        video.className =
            "slide-video";

        const source =
            document.createElement("source");

        source.src =
            getAssetPath(slide.asset.path);

        video.appendChild(source);

        slideContainer.appendChild(video);
    }


    // -----------------------------------------------
    // QUIZ
    // -----------------------------------------------

    else if (slide.type === "quiz") {

        renderQuiz(slide);
    }


    // -----------------------------------------------
    // UNKNOWN TYPE
    // -----------------------------------------------

    else {

        const message =
            document.createElement("p");

        message.textContent =
            `Unsupported slide type: ${slide.type}`;

        slideContainer.appendChild(message);
    }


    updateUI();

    // Save AFTER the current slide has been rendered.
    savePlayerState();
}


// --------------------------------------------------
// QUIZ
// --------------------------------------------------

function renderQuiz(slide) {

    const quizContainer =
        document.createElement("div");

    quizContainer.className =
        "quiz-container";


    const question =
        document.createElement("p");

    question.className =
        "quiz-question";

    question.textContent =
        slide.question;

    quizContainer.appendChild(question);


    const optionsContainer =
        document.createElement("div");

    optionsContainer.className =
        "quiz-options";


    slide.options.forEach(option => {

        const label =
            document.createElement("label");

        label.className =
            "quiz-option";


        const input =
            document.createElement("input");

        input.type = "radio";

        input.name =
            `quiz-${slide.id}`;

        input.value =
            option.id;


        label.appendChild(input);

        label.appendChild(
            document.createTextNode(
                ` ${option.text}`
            )
        );

        optionsContainer.appendChild(label);
    });


    quizContainer.appendChild(
        optionsContainer
    );


    const submitButton =
        document.createElement("button");

    submitButton.type = "button";

    submitButton.textContent =
        "Submit Answer";

    submitButton.className =
        "quiz-submit";


    const feedback =
        document.createElement("p");

    feedback.className =
        "quiz-feedback";


    submitButton.addEventListener(
        "click",
        () => {

            const selected =
                quizContainer.querySelector(
                    `input[name="quiz-${slide.id}"]:checked`
                );


            if (!selected) {

                feedback.textContent =
                    "Please select an answer before submitting.";

                return;
            }


            if (
                selected.value ===
                slide.correctOptionId
            ) {

                feedback.textContent =
                    "Correct! You can continue.";

                feedback.className =
                    "quiz-feedback correct";


                const inputs =
                    quizContainer.querySelectorAll(
                        "input"
                    );

                inputs.forEach(input => {
                    input.disabled = true;
                });

                submitButton.disabled = true;

            } else {

                feedback.textContent =
                    "Incorrect. Try again.";

                feedback.className =
                    "quiz-feedback incorrect";
            }
        }
    );


    quizContainer.appendChild(
        submitButton
    );

    quizContainer.appendChild(
        feedback
    );

    slideContainer.appendChild(
        quizContainer
    );
}


// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------

function goToSlide(index) {

    if (
        index < 0 ||
        index >= course.course.slides.length
    ) {
        return;
    }

    // Change the state FIRST.
    currentSlideIndex = index;

    // Then render and save the new state.
    renderSlide();
}


previousButton.addEventListener(
    "click",
    () => {

        if (currentSlideIndex > 0) {
            goToSlide(
                currentSlideIndex - 1
            );
        }
    }
);


nextButton.addEventListener(
    "click",
    () => {

        if (
            currentSlideIndex <
            course.course.slides.length - 1
        ) {
            goToSlide(
                currentSlideIndex + 1
            );
        }
    }
);


// --------------------------------------------------
// UPDATE UI
// --------------------------------------------------

function updateUI() {

    const totalSlides =
        course.course.slides.length;

    const currentNumber =
        currentSlideIndex + 1;

    const progress =
        Math.round(
            (visitedSlides.size /
                totalSlides) * 100
        );


    progressText.textContent =
        `${progress}% COMPLETE`;


    progressFill.style.width =
        `${progress}%`;


    slideProgress.textContent =
        `${currentNumber} / ${totalSlides}`;


    previousButton.disabled =
        currentSlideIndex === 0;


    nextButton.disabled =
        currentSlideIndex ===
        totalSlides - 1;


    const slideButtons =
        slideList.querySelectorAll(
            ".slide-item"
        );


    slideButtons.forEach(
        (button, index) => {

            button.classList.toggle(
                "active",
                index === currentSlideIndex
            );

            button.classList.toggle(
                "visited",
                visitedSlides.has(index)
            );
        }
    );
}


// --------------------------------------------------
// SAVE STATE
// --------------------------------------------------

function savePlayerState() {

    const state = {

        currentSlide:
            currentSlideIndex,

        visitedSlides:
            Array.from(visitedSlides)
    };


    // Local development / preview
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );


    // SCORM LMS
    setLocation(
        currentSlideIndex
    );

    setSuspendData(
        state
    );
}


// --------------------------------------------------
// RESTORE STATE
// --------------------------------------------------

function restorePlayerState() {

    let restored = false;


    // -----------------------------------------------
    // 1. SCORM SUSPEND DATA
    // -----------------------------------------------

    const suspendData =
        getSuspendData();

    if (suspendData) {

        try {

            const state =
                typeof suspendData === "string"
                    ? JSON.parse(suspendData)
                    : suspendData;


            if (
                typeof state.currentSlide === "number" &&
                state.currentSlide >= 0 &&
                state.currentSlide <
                    course.course.slides.length
            ) {

                currentSlideIndex =
                    state.currentSlide;


                if (
                    Array.isArray(
                        state.visitedSlides
                    )
                ) {

                    visitedSlides =
                        new Set(
                            state.visitedSlides
                        );
                }

                restored = true;
            }

        } catch (error) {

            console.warn(
                "Could not restore SCORM suspend data:",
                error
            );
        }
    }


    // -----------------------------------------------
    // 2. SCORM LOCATION
    // -----------------------------------------------

    if (!restored) {

        const location =
            getLocation();

        if (
            location !== null &&
            location !== ""
        ) {

            const index =
                Number(location);

            if (
                Number.isInteger(index) &&
                index >= 0 &&
                index <
                    course.course.slides.length
            ) {

                currentSlideIndex =
                    index;

                restored = true;
            }
        }
    }


    // -----------------------------------------------
    // 3. LOCAL STORAGE
    // -----------------------------------------------

    if (!restored) {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (saved) {

                const state =
                    JSON.parse(saved);


                if (
                    typeof state.currentSlide === "number" &&
                    state.currentSlide >= 0 &&
                    state.currentSlide <
                        course.course.slides.length
                ) {

                    currentSlideIndex =
                        state.currentSlide;


                    if (
                        Array.isArray(
                            state.visitedSlides
                        )
                    ) {

                        visitedSlides =
                            new Set(
                                state.visitedSlides
                            );
                    }
                }
            }

        } catch (error) {

            console.warn(
                "Could not restore local player state:",
                error
            );
        }
    }
}