// Where each tool lives on the FastAPI backend. This is the ONLY place that
// knows backend route details; the rest of the app calls services/*.js.
//
// VERIFY against your backend: "/metaprobe" is the namespace from the project
// brief. The HTTP method and the parameter name are assumptions until they are
// checked against the real route.
export const METAPROBE_ENDPOINT = {
  path: "/metaprobe/extract",
  method: "GET", // "GET" sends ?url=..., anything else sends a JSON body
  urlParam: "url",
};
