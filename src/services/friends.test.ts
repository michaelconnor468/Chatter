import friendsRouter from './friends';
import {Pool} from 'pg';
import {Router} from 'express';

const router = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn()
} as unknown as Router;

const db = {
    query: jest.fn()
} as unknown as Pool;

describe('TestFriendsEndpoints', () => {
    friendsRouter(router, db);

    it('should register the correct enpoint names', () => {
        expect(router.get).toHaveBeenCalledTimes(2);
        expect(router.get).toHaveBeenCalledWith('/friends', expect.anything());
        expect(router.get).toHaveBeenCalledWith('/friends/invites', expect.anything());
        expect(router.delete).toHaveBeenCalledTimes(1);
        expect(router.delete).toHaveBeenCalledWith('/friends', expect.anything());
        expect(router.post).toHaveBeenCalledTimes(1);
        expect(router.post).toHaveBeenCalledWith('/friends', expect.anything());
        expect(router.put).toHaveBeenCalledTimes(0);
    });
});
