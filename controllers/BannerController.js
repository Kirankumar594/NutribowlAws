import Banner from '../models/BannerModel.js';

// Create Banner
export const createBanner = async (req, res) => {
    try {
        const { title, description, subtitle, points, type, buttonText, buttonLink } = req.body;

        // Handle points field - it might come as array or need parsing
        let pointsArray = [];
        if (points) {
            if (typeof points === 'string') {
                try {
                    pointsArray = JSON.parse(points);
                } catch (error) {
                    // If it's not valid JSON, treat as array of strings
                    pointsArray = Array.isArray(points) ? points : [points];
                }
            } else if (Array.isArray(points)) {
                pointsArray = points;
            }
        }

        const banner = new Banner({
            title,
            description,
            subtitle,
            points: pointsArray,
            type: type || 'hero',
            buttonText: buttonText || 'Learn More',
            buttonLink: buttonLink || '/'
        });

        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Banner
export const updateBanner = async (req, res) => {
    try {
        const { title, description, subtitle, points, type, buttonText, buttonLink } = req.body;
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        // Handle points field - it might come as array or need parsing
        let pointsArray = banner.points;
        if (points) {
            if (typeof points === 'string') {
                try {
                    pointsArray = JSON.parse(points);
                } catch (error) {
                    // If it's not valid JSON, treat as array of strings
                    pointsArray = Array.isArray(points) ? points : [points];
                }
            } else if (Array.isArray(points)) {
                pointsArray = points;
            }
        }

        const updates = { 
            title: title || banner.title,
            description: description || banner.description,
            subtitle: subtitle || banner.subtitle,
            points: pointsArray,
            type: type || banner.type,
            buttonText: buttonText || banner.buttonText,
            buttonLink: buttonLink || banner.buttonLink
        };

        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.status(200).json(updatedBanner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Banners
export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Homepage Banners (hero and mealplan)
export const getHomeBanners = async (req, res) => {
    try {
        const banners = await Banner.find({
            type: { $in: ['hero', 'mealplan'] }
        }).sort({ createdAt: -1 });
        
        // Group banners by type
        const groupedBanners = {
            hero: banners.filter(banner => banner.type === 'hero'),
            mealplan: banners.filter(banner => banner.type === 'mealplan')
        };
        
        res.status(200).json(groupedBanners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Banner
export const getBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Banner
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        await Banner.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};