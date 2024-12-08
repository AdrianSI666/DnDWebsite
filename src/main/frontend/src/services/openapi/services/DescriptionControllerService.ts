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
     * @param worldId
     * @param requestBody
     * @returns DescriptionDTO OK
     * @throws ApiError
     */
    public static updateDescription(
        id: number,
        worldId: number,
        requestBody: DescriptionDTO,
    ): CancelablePromise<DescriptionDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/descriptions/{id}/world/{worldId}',
            path: {
                'id': id,
                'worldId': worldId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
