import json
import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("loan_api")
logging.basicConfig(level=logging.INFO)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Structured request/response logging middleware.

    Logs method, path, status_code, and response_time_ms as JSON-structured
    entries. Does NOT log request body content (FR-016).
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.perf_counter()

        response = await call_next(request)

        response_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        log_entry = {
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "response_time_ms": response_time_ms,
        }

        logger.info(json.dumps(log_entry))

        return response
