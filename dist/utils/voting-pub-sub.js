"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voting = void 0;
class VotingPubSub {
    channels = {};
    subscribe(pollId, subscriber) {
        if (!this.channels[pollId]) {
            this.channels[pollId] = [];
        }
        this.channels[pollId].push(subscriber);
    }
    publish(pollId, message) {
        console.log("start debug");
        if (!this.channels[pollId]) {
            console.log("is not on channel");
            console.log(this.channels);
            console.log("poll id ", pollId);
            return;
        }
        for (const subscriber of this.channels[pollId]) {
            subscriber(message);
            console.log("pass for");
        }
    }
}
exports.voting = new VotingPubSub();
