import mergeDeep from "lodash.merge"
export async function fetchJSON(url, options = {}) {
    options = mergeDeep(options, {
        // credentials: "same-origin",
        headers: {
            "accept": "application/json",
            "authorization": "bearer 0e2451cddea32f88620bad55c11d784946557693",
            "content-type": "application/json",
        },
        body: JSON.stringify(options.body),
    })
    let resp = await fetch(url, options) // throws automatically
    if ((resp.headers.get("content-type") || "").includes("application/json")) {
        try {
            return {
                body: await resp.json(),
                status: resp.status,
            }
        } catch (err) {
            // Bad JSON
            throw new Error(err)
        }
    } else {
        // Bad Content-type
        throw new Error( `API: Invalid mime-type`)
    }
}
