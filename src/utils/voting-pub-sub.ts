type Message = { pollOptionId: string,  votes: number }
type Subscriber = (message: Message) => void

class VotingPubSub{
    private channels: Record<string, Subscriber[]> = {}

    subscribe(pollId: string, subscriber: Subscriber){
        if(!this.channels[pollId]){
            this.channels[pollId] = []
        }

        this.channels[pollId].push(subscriber)
    }

    publish(pollId: string, message: Message){
        console.log("start debug")
        if(!this.channels[pollId]){
            console.log("is not on channel")
            console.log(this.channels)
            console.log("poll id ", pollId)
            return;
        }

        for(const subscriber of this.channels[pollId]){
            subscriber(message)
            console.log("pass for")
        }

    }
}


export const voting = new VotingPubSub();