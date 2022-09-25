import friendsRouter from './friends';
import pg from 'pg';
import {Router} from 'express';

const router = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn()
} as unknown as Router;

// Can setup friendsRouter with mock db and mock router here and test the functions it registers for each
// endpoint giving them mock query results and seeing if they set the result appropriately

describe('TestFriendsEndpoints', () => {
    const mockDB = new pg.Pool();
    friendsRouter(router, mockDB);

    test('TestFriendsEndpointsRegistered', () => {
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
