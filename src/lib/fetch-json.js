import mergeDeep from "lodash.merge"

export class ErrorX extends Error {
    constructor({message, status}) {
        super(message)
        this.status = status
        Error.captureStackTrace(this, ErrorX)
        // Errors are passed through frame boundaries so they should
        // be serializable (think err = {...err}).
        // The `message` is not enumerable so we fix that:
        Object.defineProperty(this, "message", {
            enumerable: true,
            get: () => message,
        })
    }
}

export async function fetchJSON(url, options = {}) {
    options = mergeDeep(options, {
        // credentials: "same-origin",
        headers: {
            "accept": "application/json",
            "authorization": "bearer 57e8ed284cb66d3bfcc07fd24353d128614add12",
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
            throw new ErrorX({status: resp.status, message: `API: Invalid JSON`})
        }
    } else {
        // Bad Content-type
        throw new ErrorX({status: resp.status, message: `API: Invalid mime-type`})
    }
}

export async function fetchGQL(url, query, variables) {
    let {body, status} = await fetchJSON(url, {
        method: "POST",
        body: {
            query,
            variables,
        },
    })
    if (body.errors) {
        throw new ErrorX({status, message: body.errors[0].message})
    }
    return body.data
}

