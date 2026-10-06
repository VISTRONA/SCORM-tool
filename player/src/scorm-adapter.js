import { Scorm12Runtime } from "../runtime/scorm12.mjs";

const scorm = new Scorm12Runtime();
let scormAvailable = false;

export function initializeScorm() {
    try {
        scorm.initialize();
        scormAvailable = true;
        console.log("SCORM 1.2 initialized.");
        return true;
    } catch (error) {
        scormAvailable = false;
        console.log("SCORM LMS not available. Running in preview mode.");
        return false;
    }
}

export function setLocation(slideIndex) {
    if (!scormAvailable) return;

    try {
        scorm.setLocation(String(slideIndex));
        scorm.commit();
    } catch (error) {
        console.error("Could not save SCORM location:", error);
    }
}

export function setSuspendData(data) {
    if (!scormAvailable) return;

    try {
        scorm.setSuspendData(data);
        scorm.commit();
    } catch (error) {
        console.error("Could not save SCORM suspend data:", error);
    }
}

export function getLocation() {
    if (!scormAvailable) return null;

    try {
        return scorm.getLocation();
    } catch (error) {
        console.error("Could not retrieve SCORM location:", error);
        return null;
    }
}

export function getSuspendData() {
    if (!scormAvailable) return null;

    try {
        return scorm.getSuspendData();
    } catch (error) {
        console.error("Could not retrieve SCORM suspend data:", error);
        return null;
    }
}

export function setScore(score) {
    if (!scormAvailable) return;

    try {
        scorm.setScore(score, 0, 100);
        scorm.commit();
    } catch (error) {
        console.error("Could not save SCORM score:", error);
    }
}

export function setLessonStatus(status) {
    if (!scormAvailable) return;

    try {
        scorm.setLessonStatus(status);
        scorm.commit();
    } catch (error) {
        console.error("Could not save SCORM lesson status:", error);
    }
}

export function finishScorm() {
    if (!scormAvailable) return;

    try {
        scorm.finish();
    } catch (error) {
        console.error("Could not finish SCORM session:", error);
    }
}