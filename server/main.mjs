import http, { STATUS_CODES } from "http"
import fs from "fs/promises"
import { createReadStream } from "fs"
import path from "path"
import url from "url"
import { Logger } from "./lib/logger.mjs"

const STATIC_DIR = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../dist")

try {
    await fs.stat(STATIC_DIR)

    /**
     * @param {import("http").ServerResponse} res 
     */
    async function homePageHandler(res) {
        try {
            const html = await fs.readFile(path.join(STATIC_DIR, "index.html"))

            res.setHeader("content-type", "text/html")
            res.setHeader("cache-control", "public; max-age=604800")
            res.end(html)
        } catch (error) {
            res.statusCode = 500
            return res.end()
        }
    };

    /**
     * @param {import("http").ServerResponse} res 
     */
    async function successPageHandler(res) {
        try {
            const html = await fs.readFile(path.join(STATIC_DIR, "success.html"))

            res.setHeader("content-type", "text/html")
            res.setHeader("cache-control", "public; max-age=604800")
            res.end(html)
        } catch (error) {
            res.statusCode = 500
            return res.end()
        }
    };

    /**
     * @param {string} pathname 
     */
    function getFileExtension(pathname) {
        return path.extname(pathname)
    }

    const PORT = process.env.PORT || 8080

    const server = http.createServer(async (req, res) => {
        const { pathname } = new URL(req.url || "", `http://${req.headers.host}`)

        if (/(?:css|js|svg|png)$/.test(pathname)) {
            const ext = getFileExtension(pathname)

            switch (ext) {
                case ".css":
                    res.setHeader("content-type", "text/css")
                break
                case ".js":
                    res.setHeader("content-type", "application/javascript")
                break
                case ".svg":
                    res.setHeader("content-type", "image/svg+xml")
                break
                case ".png":
                    res.setHeader("content-type", "image/png")
                break
                default:
                    Logger.warn("Unsupported file type:", ext)
                    res.statusCode = 404
                    return res.end()
            }

            const stream = createReadStream(path.join(STATIC_DIR, pathname))
            stream.on("open", () => {
                stream.pipe(res)
            });
            stream.on("error", (err) => {
                Logger.error(err)
                res.statusCode = 404
                res.statusMessage = STATUS_CODES[res.statusCode] || ""
                res.end(res.statusMessage)
            });
            return
        }

        switch (pathname) {
            case "/":
                return homePageHandler(res)
            case "/success":
                return successPageHandler(res)
            default:
                res.statusCode = 404
                res.statusMessage = STATUS_CODES[res.statusCode] || ""
                return res.end(res.statusMessage)
        }
    })

    if (process.env.NODE_ENV !== "production") {
        server.on("listening", () => {
            Logger.info(`Server listening on :${PORT}`)
        })

        server.on("request", (req, res) => {
            const messages = [
                req.headers.origin,
                req.method,
                `${req.headers.host}${req.url || ""}`,
                res.statusCode,
            ].filter(Boolean).join(" ")

            Logger.info(messages)
        })
    }

    server.listen(PORT)
} catch (err) {
    Logger.error(err)
    process.exit(128)
}

