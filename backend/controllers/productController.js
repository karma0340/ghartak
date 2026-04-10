import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    const { category } = req.query;
    try {
        const query = category ? { category } : {};
        const products = await Product.find(query);
        // Rename _id to id for frontend compatibility
        const mappedProducts = products.map(p => {
            const obj = p.toObject();
            obj.id = obj._id;
            return obj;
        });
        res.json(mappedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};