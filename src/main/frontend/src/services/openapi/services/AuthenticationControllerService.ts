/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthenticationResponse } from '../models/AuthenticationResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { TokenRefreshRequest } from '../models/TokenRefreshRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationControllerService {
    /**
     * @param requestBody
     * @returns AuthenticationResponse OK
     * @throws ApiError
     */
    public static register(
        requestBody: RegisterRequest,
    ): CancelablePromise<AuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AuthenticationResponse OK
     * @throws ApiError
     */
    public static refreshToken(
        requestBody: TokenRefreshRequest,
    ): CancelablePromise<AuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AuthenticationResponse OK
     * @throws ApiError
     */
    public static authenticate(
        requestBody: LoginRequest,
    ): CancelablePromise<AuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/authenticate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userId
     * @returns AuthenticationResponse OK
     * @throws ApiError
     */
    public static signOut(
        userId: number,
    ): CancelablePromise<AuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/auth/signout/{userId}',
            mediaType: 'application/json',
            path: {
                'userId': userId,
            },
        });
    }
}
