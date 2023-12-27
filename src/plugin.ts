import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PluginCommonModule, VendurePlugin } from '@vendure/core'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { SubscriptionResolver } from './subscription-resolver'

@VendurePlugin({
    imports: [
        PluginCommonModule,
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            useFactory: () => ({
                typePaths: [join(__dirname, '/*.graphql')],
                include: [SubscriptionPlugin],
                path: '/subscription-api',
                context: ({ req, res, connection }:any) => {
                    if (!req) {
                        req = connection.context
                        req.get = () => null // our "req" doesn't have get for authentication headers, so maybe would be another point to get auth
                    }
                    return { req, res }
                },
                // fieldResolverEnhancers: ['guards'],
                installSubscriptionHandlers: true,
                subscriptions: {
                    onConnect: (connectionParams: any, _: any, context: { request: any }) => {
                        // if you need authenticated request, this has to be somehow extended, maybe via connectionParams
                        // somehow we don't have a session here (couldn't figure out how to get it, but maybe it's possibe
                        return { req: context.request }
                    },
                },
            }),
        }),
    ],
    providers: [SubscriptionResolver],
})
export class SubscriptionPlugin {}