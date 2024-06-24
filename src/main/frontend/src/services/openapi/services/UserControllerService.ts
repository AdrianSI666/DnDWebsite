/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserCreateDTO } from '../models/UserCreateDTO';
import type { UserInfoDTO } from '../models/UserInfoDTO';
import type { UserPublicDTO } from '../models/UserPublicDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @param requestBody
     * @returns UserPublicDTO OK
     * @throws ApiError
     */
    public static saveUser(
        requestBody: UserCreateDTO,
    ): CancelablePromise<UserPublicDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns UserInfoDTO OK
     * @throws ApiError
     */
    public static getAllUsers(): CancelablePromise<Array<UserInfoDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/all',
        });
    }
}
