import { createService, findAllService, countNews, topNewsService, findByIdService, searchByTitleService, byUserService, updateService, eraseService } from '../services/news.service.js';

const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title || !text || !banner) {
            res.status(400).send({ message: "Submit all fields for registration." })
        }

        await createService({
            title,
            text,
            banner,
            user: req.userId
        });

        res.send(201);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5;
        }

        if (!offset) {
            offset = 0;
        }

        const news = await findAllService(offset, limit);
        const total = await countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no news." });
        }

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

};

const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(400).send({ message: "There is no news available." });
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await searchByTitleService(title);

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no posts with this title." });
        }

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const news = await byUserService(id);

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const update = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !text && !banner) {
            res.status(400).send({ message: "Submit at least one field." });
        }

        const news = await findByIdService(id);

        if (news.user._id != req.userId) {
            return res.status(400).send({ message: "You didn't create this news." });
        }

        await updateService(id, title, text, banner);

        return res.send({ message: "News successfully updated." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const erase = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        if (news.user._id != req.userId) {
            return res.status(400).send({ message: "You didn't create this news." });
        }

        await eraseService(id);
        return res.send({ message: "News deleted successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    byUser,
    update,
    erase
};