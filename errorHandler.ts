import logger from "./logger"

export function handleError(error: Error, context?: string) {
  logger.error(`${context || "An error occurred"}: ${error.message}`, {
    stack: error.stack,
    context,
  })
}

