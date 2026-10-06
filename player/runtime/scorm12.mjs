/**
 * SCORM 1.2 Runtime Adapter
 *
 * Provides a small player-facing interface around the LMS SCORM 1.2 API.
 */

const MAX_API_SEARCH_DEPTH = 500;

export class ScormRuntimeError extends Error {
  constructor(message, code = null, diagnostic = null) {
    super(message);
    this.name = "ScormRuntimeError";
    this.code = code;
    this.diagnostic = diagnostic;
  }
}

export class Scorm12Runtime {
  constructor(rootWindow = window) {
    this.rootWindow = rootWindow;
    this.api = null;
    this.initialized = false;
    this.finished = false;
  }

  /**
   * Search a window and its parents for the SCORM 1.2 `API` object.
   */
  findAPI(startWindow) {
    let current = startWindow;
    let depth = 0;

    while (current && depth < MAX_API_SEARCH_DEPTH) {
      try {
        if (current.API) {
          return current.API;
        }

        if (current.parent === current) {
          break;
        }

        current = current.parent;
      } catch {
        // Cross-origin window boundary.
        break;
      }

      depth += 1;
    }

    return null;
  }

  /**
   * Locate the API through the parent hierarchy, then opener hierarchy.
   */
  locateAPI() {
    let api = this.findAPI(this.rootWindow);

    if (api) {
      return api;
    }

    try {
      if (this.rootWindow.opener) {
        api = this.findAPI(this.rootWindow.opener);
      }
    } catch {
      api = null;
    }

    return api;
  }

  initialize() {
    if (this.initialized) {
      return true;
    }

    if (this.finished) {
      throw new ScormRuntimeError(
        "Cannot initialize a SCORM session after it has been finished."
      );
    }

    this.api = this.locateAPI();

    if (!this.api) {
      throw new ScormRuntimeError(
        "SCORM 1.2 API could not be located."
      );
    }

    const result = this.api.LMSInitialize("");

    if (!this.isSuccess(result)) {
      throw this.createLmsError("LMSInitialize failed.");
    }

    this.initialized = true;

    return true;
  }

  ensureActive() {
    if (!this.api || !this.initialized || this.finished) {
      throw new ScormRuntimeError(
        "SCORM session is not active."
      );
    }
  }

  isSuccess(value) {
    return String(value).toLowerCase() === "true";
  }

  getValue(element) {
    this.ensureActive();

    const value = this.api.LMSGetValue(element);
    const errorCode = String(this.api.LMSGetLastError());

    if (errorCode !== "0") {
      throw this.createLmsError(
        `LMSGetValue failed for '${element}'.`,
        errorCode
      );
    }

    return value;
  }

  setValue(element, value) {
    this.ensureActive();

    const result = this.api.LMSSetValue(
      element,
      String(value)
    );

    if (!this.isSuccess(result)) {
      throw this.createLmsError(
        `LMSSetValue failed for '${element}'.`
      );
    }

    return true;
  }

  commit() {
    this.ensureActive();

    const result = this.api.LMSCommit("");

    if (!this.isSuccess(result)) {
      throw this.createLmsError("LMSCommit failed.");
    }

    return true;
  }

  getLessonStatus() {
    return this.getValue("cmi.core.lesson_status");
  }

  setLessonStatus(status) {
    const allowed = new Set([
      "passed",
      "completed",
      "failed",
      "incomplete",
      "browsed",
      "not attempted",
    ]);

    if (!allowed.has(status)) {
      throw new ScormRuntimeError(
        `Invalid SCORM 1.2 lesson status: ${status}`
      );
    }

    return this.setValue(
      "cmi.core.lesson_status",
      status
    );
  }

  getScore() {
    const value = this.getValue("cmi.core.score.raw");

    if (value === "") {
      return null;
    }

    const score = Number(value);

    return Number.isFinite(score) ? score : null;
  }

  setScore(score, min = 0, max = 100) {
    const numericScore = Number(score);
    const numericMin = Number(min);
    const numericMax = Number(max);

    if (
      !Number.isFinite(numericScore) ||
      !Number.isFinite(numericMin) ||
      !Number.isFinite(numericMax)
    ) {
      throw new ScormRuntimeError(
        "Score, minimum and maximum must be numeric."
      );
    }

    if (
      numericMin > numericMax ||
      numericScore < numericMin ||
      numericScore > numericMax
    ) {
      throw new ScormRuntimeError(
        "Score must be within the supplied minimum and maximum."
      );
    }

    this.setValue("cmi.core.score.min", numericMin);
    this.setValue("cmi.core.score.max", numericMax);
    this.setValue("cmi.core.score.raw", numericScore);

    return true;
  }

  getLocation() {
    return this.getValue(
      "cmi.core.lesson_location"
    );
  }

  setLocation(location) {
    return this.setValue(
      "cmi.core.lesson_location",
      location
    );
  }

  getSuspendData() {
    return this.getValue("cmi.suspend_data");
  }

  setSuspendData(data) {
    const value =
      typeof data === "string"
        ? data
        : JSON.stringify(data);

    // SCORM 1.2 suspend_data has an SPM of 4096 characters.
    if (value.length > 4096) {
      throw new ScormRuntimeError(
        "SCORM 1.2 suspend data exceeds 4096 characters."
      );
    }

    return this.setValue(
      "cmi.suspend_data",
      value
    );
  }

  suspend() {
    this.setValue("cmi.core.exit", "suspend");
    return this.commit();
  }

  finish({ suspend = false } = {}) {
    if (this.finished) {
      return true;
    }

    this.ensureActive();

    if (suspend) {
      this.setValue("cmi.core.exit", "suspend");
    } else {
      this.setValue("cmi.core.exit", "");
    }

    this.commit();

    const result = this.api.LMSFinish("");

    if (!this.isSuccess(result)) {
      throw this.createLmsError("LMSFinish failed.");
    }

    this.finished = true;
    this.initialized = false;

    return true;
  }

  createLmsError(message, knownCode = null) {
    let code = knownCode;
    let description = "";
    let diagnostic = "";

    try {
      code ??= String(this.api.LMSGetLastError());

      if (code && code !== "0") {
        description =
          this.api.LMSGetErrorString(code) || "";

        diagnostic =
          this.api.LMSGetDiagnostic(code) || "";
      }
    } catch {
      // Preserve the original error if LMS error reporting itself fails.
    }

    const details = description
      ? `${message} ${description}`
      : message;

    return new ScormRuntimeError(
      details,
      code,
      diagnostic
    );
  }
}