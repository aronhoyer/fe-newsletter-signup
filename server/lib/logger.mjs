const LogLevels = Object.freeze({
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
})

/** @typedef {typeof LogLevels[keyof typeof LogLevels]} LogLevel */

export class Logger {
    /** @type {LogLevel} */
    static #minLevel = process.env.NODE_ENV === "production"
        ? LogLevels.WARN
        : LogLevels.DEBUG

    /**
     * @param {LogLevel} level
     * @returns {string}
     */
    static #getLevelName(level) {
        return Object.entries(LogLevels).find(([,l]) => l === level)?.[0]
    }

    /**
     * @param {LogLevel} level 
     * @param {any} message 
     * @param {...any} messages 
     */
    static #write(level, message, ...messages) {
        if (level >= Logger.#minLevel) {
            console.log(`${Logger.#getLevelName(level)}:`, message, ...messages)
        }
    }

    static debug(message, ...messages) {
        Logger.#write(LogLevels.DEBUG, message, ...messages)
    }

    static info(message, ...messages) {
        Logger.#write(LogLevels.INFO, message, ...messages)
    }

    static warn(message, ...messages) {
        Logger.#write(LogLevels.WARN, message, ...messages)
    }

    static error(message, ...messages) {
        Logger.#write(LogLevels.ERROR, message, ...messages)
    }
}
