export class Time {
    static fromHours(hours: number): Date {
        return Time.fromMinutes(hours * 60)
    }

    static fromMinutes(minutes: number): Date {
        return Time.fromSeconds(minutes * 60)
    }

    static fromSeconds(seconds: number): Date {
        return Time.fromMilliseconds(seconds * 1000)
    }

    static fromMilliseconds(milliseconds: number): Date {
        return new Date(milliseconds);
    }
}