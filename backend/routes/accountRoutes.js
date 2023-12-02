const router = require('express').Router();
const User = require('../models/User');
const { Op } = require('sequelize');

function convertString(val) {
    return val.trim().length === 0 ? null : val.trim()
}

router.post('/register', async (req, res) => {
    const username = convertString(req.body.username);
    const password = convertString(req.body.password);
    const email = convertString(req.body.email);

    try {
        const user = await User.create({
            username,
            password,
            email
        });
        req.session.user = user;
        res.json(user.toJSON());
    } catch (error) {
        res.json({
            error: {
                message: error.errors[0].message,
                error: error.errors[0]
            }
        });
    }
});

router.post('/login', async (req, res) => {
    const email = convertString(req.body.email);
    const password = convertString(req.body.password);

    try {
        const user = await User.findOne({
            where: {
                email: {
                    [Op.iLike]: email
                },
                password
            }
        });
        if (user) {
            req.session.user = user;
            res.json(user.toJSON());
        } else {
            res.json({ error: 'User not found' });
        }
    } catch (error) {
        res.json({
            error: {
                message: error.errors[0].message,
                error: error.errors[0]
            }
        });
    } 
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: 'User logged out' });
});

router.post('/update', async (req, res) => {
    if (!req.session.user) {
        res.json({ error: 'User not logged in' });
        return;
    }

    try {
        const user = await User.findOne({
            where: {
                id: req.session.user.id
            }
        });
        if (user) {
            for (const key in user.toJSON()) {
                if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                    if (req.body[key]) {
                        user[key] = req.body[key];
                    }
                }
            }

            await user.save();
            req.session.user = user;
            res.json(user.toJSON());
        } else {
            res.json({ error: 'User not found' });
        }
    } catch (error) {
        res.json({
            error: {
                message: error.errors[0].message,
                error: error.errors[0]
            }
        });
    }
});

router.get('/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.json({ error: 'User not logged in' });
    }
});

module.exports = router;
