import express from "express";
import { auth } from "../middlewares/auth.js";
import { 
    generateArticle, 
    generateBlogTitle, 
    generateImage, 
    removeImageBackground, 
    removeImageObject, 
    resumeReview,
    validateBusinessIdea,
    generatePitchDeck,
    generateMarketResearch,
    generateCompetitorAnalysis,
    generateFinancialProjections
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

// ============================================
// CONTENT GENERATION ROUTES
// ============================================
aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-title', auth, generateBlogTitle)

// ============================================
// IMAGE PROCESSING ROUTES
// ============================================
aiRouter.post('/generate-image', auth, generateImage)
aiRouter.post('/remove-image-background', 
    upload.single('image'), 
    auth, 
    removeImageBackground
)
aiRouter.post('/remove-image-object', 
    upload.single('image'), 
    auth, 
    removeImageObject
)

// ============================================
// PROFESSIONAL TOOLS ROUTES
// ============================================
aiRouter.post('/resume-review', 
    upload.single('resume'), 
    auth, 
    resumeReview
)

// ============================================
// BUSINESS PLANNING ROUTES
// ============================================
aiRouter.post('/validate-business-idea', auth, validateBusinessIdea)
aiRouter.post('/generate-pitch-deck', auth, generatePitchDeck)
aiRouter.post('/market-research', auth, generateMarketResearch)
aiRouter.post('/competitor-analysis', auth, generateCompetitorAnalysis)
aiRouter.post('/financial-projections', auth, generateFinancialProjections)

export default aiRouter