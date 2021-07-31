import context from '../context';
import db from '../db';

export default () => {
    context.router.post('/user', async (req, res) => {
        try {
            console.log(req.body);
        } catch (e) {
            console.log(e);
        }
    });
};