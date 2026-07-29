export function isNumber(value: unknown): boolean {
    if (typeof value === "number") {
        return Number.isFinite(value);
    }

    if (typeof value !== "string") {
        return false;
    }

    const trimmed = value.trim();

    if (trimmed === "") {
        return false;
    }

    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed);
}