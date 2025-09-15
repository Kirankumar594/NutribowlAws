import express from 'express';
import { 
    createBanner, 
    getAllBanners, 
    getBanner, 
    updateBanner, 
    deleteBanner,
    getHomeBanners
} from '../controllers/BannerController.js';

const router = express.Router();

router.post('/', createBanner);
router.get('/', getAllBanners);
router.get('/home', getHomeBanners);
router.get('/:id', getBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

export default router;