import {Time} from "../src/Time";

const milliScale = 1000;
const secondScale = 60;
const minuteScale = 60;

describe('hours', () => {
    it('to hours', () => {
        const time = new Time({hours: 1})
        expect(time.hours).toBe(1)
    })
    it('to minutes', () => {
        const time = new Time({hours: 1})
        expect(time.minutes).toBe(minuteScale)
    })
    it('to seconds', () => {
        const time = new Time({hours: 1})
        expect(time.seconds).toBe(minuteScale * secondScale)
    })
    it('to milliseconds', () => {
        const time = new Time({hours: 1})
        expect(time.milliseconds).toBe(minuteScale * secondScale * milliScale)
    })
})
describe('minutes', () => {
    it('to hours', () => {
        const time = new Time({minutes: 60})
        expect(time.hours).toBe(1)
    })
    it('to minutes', () => {
        const time = new Time({minutes: 60})
        expect(time.minutes).toBe(minuteScale)
    })
    it('to seconds', () => {
        const time = new Time({minutes: 60})
        expect(time.seconds).toBe(minuteScale * secondScale)
    })
    it('to milliseconds', () => {
        const time = new Time({minutes: 60})
        expect(time.milliseconds).toBe(minuteScale * secondScale * milliScale)
    })
})
describe('seconds', () => {
    it('to hours', () => {
        const time = new Time({seconds: 60 * 60})
        expect(time.hours).toBe(1)
    })
    it('to minutes', () => {
        const time = new Time({seconds: 60 * 60})
        expect(time.minutes).toBe(minuteScale)
    })
    it('to seconds', () => {
        const time = new Time({seconds: 60 * 60})
        expect(time.seconds).toBe(minuteScale * secondScale)
    })
    it('to milliseconds', () => {
        const time = new Time({seconds: 60 * 60})
        expect(time.milliseconds).toBe(minuteScale * secondScale * milliScale)
    })
})
describe('milliseconds', () => {
    it('to hours', () => {
        const time = new Time({milliseconds: 1000 * 60 * 60})
        expect(time.hours).toBe(1)
    })
    it('to minutes', () => {
        const time = new Time({milliseconds: 1000 * 60 * 60})
        expect(time.minutes).toBe(minuteScale)
    })
    it('to seconds', () => {
        const time = new Time({milliseconds: 1000 * 60 * 60})
        expect(time.seconds).toBe(minuteScale * secondScale)
    })
    it('to milliseconds', () => {
        const time = new Time({milliseconds: 1000 * 60 * 60})
        expect(time.milliseconds).toBe(minuteScale * secondScale * milliScale)
    })
})