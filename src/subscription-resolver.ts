import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { Ctx, RequestContext } from '@vendure/core'

const pubSub = new PubSub()

@Resolver('Pages')
export class SubscriptionResolver {
    @Subscription()
    commentAdded(@Ctx() ctx: RequestContext) {
        return pubSub.asyncIterator('commentAdded')
    }

    @Mutation(returns => String)
    async addComment(@Args('comment', { type: () => String }) comment: string) {
        pubSub.publish('commentAdded', { commentAdded: comment })
        return comment
    }
}