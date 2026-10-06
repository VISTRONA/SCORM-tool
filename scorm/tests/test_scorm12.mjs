import assert from "node:assert/strict";
import {
  Scorm12Runtime,
  ScormRuntimeError,
} from "../runtime/scorm12.js";


function createFakeAPI() {
  const values = new Map();

  return {
    initialized: false,
    finished: false,
    commits: 0,

    LMSInitialize(value) {
      assert.equal(value, "");
      this.initialized = true;
      return "true";
    },

    LMSFinish(value) {
      assert.equal(value, "");
      this.finished = true;
      return "true";
    },

    LMSGetValue(element) {
      return values.get(element) ?? "";
    },

    LMSSetValue(element, value) {
      values.set(element, String(value));
      return "true";
    },

    LMSCommit(value) {
      assert.equal(value, "");
      this.commits += 1;
      return "true";
    },

    LMSGetLastError() {
      return "0";
    },

    LMSGetErrorString() {
      return "";
    },

    LMSGetDiagnostic() {
      return "";
    },

    values,
  };
}


function createFakeWindow(api) {
  const fakeWindow = {
    API: api,
    opener: null,
  };

  fakeWindow.parent = fakeWindow;

  return fakeWindow;
}


const api = createFakeAPI();
const fakeWindow = createFakeWindow(api);

const runtime = new Scorm12Runtime(fakeWindow);

assert.equal(runtime.initialize(), true);
assert.equal(api.initialized, true);

runtime.setLessonStatus("incomplete");
assert.equal(
  api.values.get("cmi.core.lesson_status"),
  "incomplete"
);

runtime.setScore(80);
assert.equal(
  api.values.get("cmi.core.score.raw"),
  "80"
);
assert.equal(
  api.values.get("cmi.core.score.min"),
  "0"
);
assert.equal(
  api.values.get("cmi.core.score.max"),
  "100"
);

runtime.setLocation("slide-3");
assert.equal(runtime.getLocation(), "slide-3");

runtime.setSuspendData({
  slideId: "slide-3",
  visited: ["slide-1", "slide-2", "slide-3"],
});

assert.ok(
  runtime.getSuspendData().includes("slide-3")
);

runtime.commit();
assert.ok(api.commits >= 1);

runtime.finish({ suspend: true });

assert.equal(
  api.values.get("cmi.core.exit"),
  "suspend"
);

assert.equal(api.finished, true);


// Missing API must fail cleanly.

const noApiWindow = {
  API: null,
  opener: null,
};

noApiWindow.parent = noApiWindow;

const missingRuntime =
  new Scorm12Runtime(noApiWindow);

assert.throws(
  () => missingRuntime.initialize(),
  ScormRuntimeError
);


console.log("SCORM 1.2 runtime tests passed.");