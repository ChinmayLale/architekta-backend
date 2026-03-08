import client from "prom-client";

// Collect default metrics (CPU, memory, event loop, GC, etc.)
client.collectDefaultMetrics();

// HTTP request counter
export const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
});

// Histogram for request duration
export const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

export const register = client.register;
