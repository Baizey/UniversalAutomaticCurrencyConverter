export class Time {
    readonly milliseconds: number;
    readonly seconds: number;
    readonly minutes: number;
    readonly hours: number;
    readonly date: Date;

    constructor(time: {
        milliseconds?: number,
        seconds?: number,
        minutes?: number,
        hours?: number
    }) {
        const hours = (time.hours || 0)
        const minutes = hours * 60 + (time.minutes || 0)
        const seconds = minutes * 60 + (time.seconds || 0)
        this.milliseconds = seconds * 1000 + (time.milliseconds || 0)
        this.seconds = this.milliseconds / 1000
        this.minutes = this.seconds / 60
        this.hours = this.minutes / 60
        this.date = new Date(this.milliseconds);
    }
}