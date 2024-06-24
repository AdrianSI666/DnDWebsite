/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginForm } from '../models/LoginForm';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationControllerService {
    /**
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static authenticateAndGetToken(
        requestBody: LoginForm,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/authenticate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
