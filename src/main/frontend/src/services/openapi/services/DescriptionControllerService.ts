/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DescriptionDTO } from '../models/DescriptionDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DescriptionControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns DescriptionDTO OK
     * @throws ApiError
     */
    public static updateDescription(
        id: number,
        requestBody: DescriptionDTO,
    ): CancelablePromise<DescriptionDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/descriptions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
