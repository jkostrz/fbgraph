/**
 * Error Handler
 * @param err
 * @returns {*}
 */
exports.handle = function(err) {

    if (!err) {
        return;
    }

    var code = parseInt(err.code, 10);
    var subCode = parseInt(err.error_subcode || 0, 10);

    if (subCode) {
        switch (subCode) {
            // Other authentication issues
            case 458:
            case 459:
            case 460:
            case 463:
            case 464:
            case 467:
                return {
                    type: 'FacebookAuthenticationException',
                    code: code,
                    subCode: subCode,
                    fbType: err.type,
                    message: err.message,
                    fbTraceId: err.fbtrace_id
                };

            // Video upload resumable error
            case 1363030:
            case 1363019:
            case 1363037:
            case 1363033:
            case 1363021:
            case 1363041:
                return {
                    type: 'FacebookResumableUploadException',
                    fbType: err.type,
                    code: code,
                    subCode: subCode,
                    message: err.message,
                    fbTraceId: err.fbtrace_id
                };
        }
    }

    switch (code) {
        // Login status or token expired, revoked, or invalid
        case 100:
        case 102:
        case 190:
            return {
                type: 'FacebookAuthenticationException',
                code: code,
                fbType: err.type,
                message: err.message,
                fbTraceId: err.fbtrace_id
            };

        // Server issue, possible downtime
        case 1:
        case 2:
            return {
                type: 'FacebookServerException',
                code: code,
                fbType: err.type,
                message: err.message,
                fbTraceId: err.fbtrace_id
            };

        // API Throttling
        case 4:
        case 17:
        case 341:
            return {
                type: 'FacebookThrottleException',
                code: code,
                fbType: err.type,
                message: err.message,
                fbTraceId: err.fbtrace_id
            };

        // Duplicate Post
        case 506:
            return {
                type: 'FacebookClientException',
                code: code,
                fbType: err.type,
                message: err.message,
                fbTraceId: err.fbtrace_id
            };
    }

    // Missing Permissions
    if (code === 10 || (code >= 200 && code <= 299)) {
        return {
            type: 'FacebookAuthorizationException',
            code: code,
            fbType: err.type,
            message: err.message,
            fbTraceId: err.fbtrace_id
        };
    }

    if (err.type === 'OAuthException') {
        return {
            type: 'FacebookAuthenticationException',
            code: code,
            fbType: err.type,
            message: err.message,
            fbTraceId: err.fbtrace_id
        };
    }

    return {
        type: 'FacebookOtherException',
        code: code || null,
        fbType: err.type,
        message: err.message,
        fbTraceId: err.fbtrace_id || null,
        exception: err.exception || null
    };
};
