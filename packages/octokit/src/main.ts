import util from 'node:util';
import * as core from '@actions/core';
import * as github from '@actions/github';
import type { Octokit } from '@octokit/core';
import type {
    OctokitOptions,
    OctokitPlugin,
} from '@octokit/core/dist-types/types';
import { RequestError } from '@octokit/request-error';
import type { EndpointDefaults, OctokitResponse } from '@octokit/types';
import { retry } from '@octokit/plugin-retry';
import { throttling, type ThrottlingOptions } from '@octokit/plugin-throttling';

type GitHub = ReturnType<typeof github.getOctokit>;

const log: OctokitOptions['log'] = {
    debug: (...args) => core.debug(util.format(...args)),
    info: (...args) => core.info(util.format(...args)),
    warn: (...args) => core.warning(util.format(...args)),
    error: (...args) => core.error(util.format(...args)),
};

function requestDescription(octokit: Octokit, options: EndpointDefaults) {
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, '');

    return `${requestOptions.method} ${path}`;
}

function responseDescription(
    octokit: Octokit,
    options: EndpointDefaults,
    response: OctokitResponse<unknown> | undefined,
    start: number
) {
    const requestId = response?.headers['x-github-request-id'];

    return `${requestDescription(octokit, options)} - ${response?.status} with id ${requestId} in ${
        Date.now() - start
    }ms`;
}

function requestLog(octokit: Octokit) {
    octokit.hook.wrap('request', (request, options) => {
        if (core.isDebug()) {
            core.startGroup(requestDescription(octokit, options));
            core.info(util.inspect(options));
            core.endGroup();
        }

        const start = Date.now();

        return (request as typeof octokit.request)(options)
            .then(response => {
                core.startGroup(
                    responseDescription(octokit, options, response, start)
                );

                core.info(util.inspect({ request: options, response }));
                core.endGroup();

                return response;
            })
            .catch(error => {
                if (error instanceof RequestError) {
                    const { response } = error;

                    core.error(
                        responseDescription(octokit, options, response, start)
                    );

                    core.startGroup('Details');
                    core.info(
                        util.inspect({
                            request: options,
                            response,
                        })
                    );
                    core.endGroup();
                }

                throw error;
            });
    });
}

function rateLimit(
    what: string,
    retryAfter: number,
    options: EndpointDefaults,
    octokit: Octokit,
    retryCount: number
): boolean {
    if (retryCount === 0) {
        octokit.log.warn(
            `${what} for request ${options.method} ${options.url}. Will retry after ${retryAfter} seconds!`
        );

        return true;
    } else {
        octokit.log.warn(
            `${what} for request ${options.method} ${options.url}. Retry limit exceeded!`
        );

        return false;
    }
}

const throttle: ThrottlingOptions = {
    onRateLimit: rateLimit.bind(globalThis, 'Request quota exhausted'),
    onSecondaryRateLimit: rateLimit.bind(
        globalThis,
        'SecondaryRateLimit detected'
    ),
};

export function getOctokit(
    token: string,
    options?: OctokitOptions,
    ...additionalPlugins: OctokitPlugin[]
): GitHub {
    return github.getOctokit(
        token,
        {
            log,
            throttle,
            ...options,
        },
        requestLog,
        retry,
        throttling,
        ...additionalPlugins
    );
}
