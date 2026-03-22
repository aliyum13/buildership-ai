import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (apiFunction, retryCount = 3, baseDelay = 2000) => {
    for (let attempt = 0; attempt < retryCount; attempt++) {
        try {
            return await apiFunction();
        } catch (error) {
            const isLastAttempt = attempt === retryCount - 1;
            if (error.status === 429 || error.code === 'rate_limit_exceeded') {
                if (!isLastAttempt) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    console.log(`⚠️  Rate limited. Retrying in ${delay}ms...`);
                    await sleep(delay);
                    continue;
                }
                throw new Error('Rate limit exceeded. Please try again in a few moments.');
            }
            if (error.message?.toLowerCase().includes('quota')) {
                throw new Error('API quota exceeded. Please try again later.');
            }
            if (isLastAttempt) throw error;
            const delay = baseDelay * Math.pow(2, attempt);
            await sleep(delay);
        }
    }
    throw new Error('Max retry attempts exceeded');
};

// ✅ FIXED: All token limits increased significantly to prevent truncation
const generateAIContent = async (prompt, maxTokens = 2000) => {
    return await callWithRetry(async () => {
        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: maxTokens,
        });
        return response.choices[0].message.content;
    });
};

const checkUserLimits = (plan, free_usage, res) => {
    if (plan !== 'premium' && free_usage >= 10) {
        res.json({ success: false, message: "You have reached your free limit of 10 uses. Upgrade to Premium to continue." });
        return false;
    }
    return true;
};

const checkPremiumAccess = (plan, res) => {
    if (plan !== 'premium') {
        res.json({
            success: false,
            message: "This feature requires a Premium subscription. Upgrade your plan to access Pitch Deck Generator, Market Research, Competitor Analysis, Financial Projections, Image Generation, Background Removal, Object Removal, and Resume Review."
        });
        return false;
    }
    return true;
};

const updateUserUsage = async (userId, free_usage) => {
    await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 }
    });
};

// ========== CONTENT GENERATION ==========

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (!checkUserLimits(plan, free_usage, res)) return;
        if (!prompt) return res.json({ success: false, message: "Prompt is required" });

        console.log(`📝 Generating article for user ${userId}...`);

        // ✅ FIXED: Convert word count to proper token count (1 word ≈ 1.5 tokens)
        // Minimum 1500 tokens to prevent truncation, maximum 4000
        const tokenLimit = Math.max(1500, Math.min(Math.round((length || 800) * 2), 4000));
        const content = await generateAIContent(prompt, tokenLimit);

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan !== 'premium') await updateUserUsage(userId, free_usage);

        console.log(`✅ Article generated successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Generate Article Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (!checkUserLimits(plan, free_usage, res)) return;
        if (!prompt) return res.json({ success: false, message: "Prompt is required" });

        console.log(`📰 Generating blog titles for user ${userId}...`);

        // ✅ FIXED: Was 100 tokens (way too low). Now 1500 tokens for full title list
        const content = await generateAIContent(prompt, 1500);

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if (plan !== 'premium') await updateUserUsage(userId, free_usage);

        console.log(`✅ Blog titles generated successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Generate Blog Title Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;
        if (!prompt) return res.json({ success: false, message: "Prompt is required" });

        console.log(`🎨 Generating image for user ${userId}...`);

        const imageData = await callWithRetry(async () => {
            const formData = new FormData();
            formData.append('prompt', prompt);
            const { data } = await axios.post(
                "https://clipdrop-api.co/text-to-image/v1",
                formData,
                { headers: { 'x-api-key': process.env.CLIPDROP_API_KEY }, responseType: "arraybuffer", timeout: 30000 }
            );
            return data;
        }, 3, 3000);

        const base64Image = `data:image/png;base64,${Buffer.from(imageData, 'binary').toString('base64')}`;
        const uploadResult = await callWithRetry(async () => await cloudinary.uploader.upload(base64Image));

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${uploadResult.secure_url}, 'image', ${publish ?? false})`;

        console.log(`✅ Image generated successfully`);
        res.json({ success: true, content: uploadResult.secure_url });
    } catch (error) {
        console.error('❌ Generate Image Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;
        if (!image) return res.json({ success: false, message: "Image file is required" });

        console.log(`🖼️  Removing background for user ${userId}...`);

        const uploadResult = await callWithRetry(async () => {
            return await cloudinary.uploader.upload(image.path, {
                transformation: [{ effect: 'background_removal', background_removal: 'remove_the_background' }]
            });
        }, 3, 3000);

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${uploadResult.secure_url}, 'image')`;

        if (fs.existsSync(image.path)) fs.unlinkSync(image.path);

        console.log(`✅ Background removed successfully`);
        res.json({ success: true, content: uploadResult.secure_url });
    } catch (error) {
        console.error('❌ Remove Background Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;
        if (!image || !object) return res.json({ success: false, message: "Image file and object description are required" });

        console.log(`🗑️  Removing object "${object}" for user ${userId}...`);

        const uploadResult = await callWithRetry(async () => await cloudinary.uploader.upload(image.path));

        const imageUrl = cloudinary.url(uploadResult.public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        });

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        if (fs.existsSync(image.path)) fs.unlinkSync(image.path);

        console.log(`✅ Object removed successfully`);
        res.json({ success: true, content: imageUrl });
    } catch (error) {
        console.error('❌ Remove Object Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const { profileType } = req.body;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;
        if (!resume) return res.json({ success: false, message: "Resume file is required" });

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: "Resume file size exceeds 5MB limit." });
        }

        console.log(`📄 Reviewing resume for user ${userId}...`);

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text?.trim();

        if (!resumeText || resumeText.length < 50) {
            if (fs.existsSync(resume.path)) fs.unlinkSync(resume.path);
            return res.json({
                success: false,
                message: "Could not extract text from this PDF. Please ensure your PDF contains real readable text (not a scanned image)."
            });
        }

        const prompt = `You are a professional career coach and resume expert. 
Review the following ${profileType || 'resume'} and provide detailed, constructive feedback covering:

1. **Overall Impression** - First impression and general assessment
2. **Structure & Formatting** - Layout, readability, and organization  
3. **Content Quality** - Impact statements, achievements, and clarity
4. **Skills & Keywords** - Relevant keywords and skill presentation
5. **Specific Improvements** - 5 concrete actionable recommendations
6. **Strengths** - What is done well and should be kept

Resume Content:
${resumeText}

Be specific, constructive, and actionable in your feedback.`;

        // ✅ FIXED: 2500 tokens for complete resume review
        const content = await generateAIContent(prompt, 2500);

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

        if (fs.existsSync(resume.path)) fs.unlinkSync(resume.path);

        console.log(`✅ Resume reviewed successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Resume Review Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

// ========== BUSINESS PLANNING ==========

export const validateBusinessIdea = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { idea, industry, target_market, problem } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (!checkUserLimits(plan, free_usage, res)) return;

        if (!idea || !industry || !target_market || !problem) {
            return res.json({ success: false, message: "All fields are required" });
        }

        console.log(`💡 Validating business idea for user ${userId}...`);

        const prompt = `
            Act as an experienced business consultant and startup advisor. Analyze this business idea:
            
            Business Idea: ${idea}
            Industry: ${industry}
            Target Market: ${target_market}
            Problem Being Solved: ${problem}
            
            Provide a comprehensive validation analysis with the following sections:
            
            1. **Market Viability Score** (X/10 with justification)
            2. **Strengths & Opportunities** - List 3-5 key advantages
            3. **Potential Challenges & Risks** - Identify major obstacles
            4. **Target Audience Fit** - Analyze market demand and customer segments
            5. **Competitive Landscape** - Brief overview of competition
            6. **Revenue Potential** - Realistic assessment of monetization
            7. **Next Steps** - 3-5 actionable recommendations to validate further
            
            Be honest, constructive, and provide specific, actionable insights. Complete all 7 sections fully.
        `;

        // ✅ FIXED: 3000 tokens to ensure all 7 sections complete
        const content = await generateAIContent(prompt, 3000);

        await sql`INSERT INTO creations (user_id, prompt, content, type, category) VALUES (${userId}, ${idea}, ${content}, 'business-validation', 'business-planning')`;

        if (plan !== 'premium') await updateUserUsage(userId, free_usage);

        console.log(`✅ Business idea validated successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Validate Business Idea Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const generatePitchDeck = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { business_name, problem, solution, market_size, business_model, competitive_advantage } = req.body;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;

        if (!business_name || !problem || !solution) {
            return res.json({ success: false, message: "Business name, problem, and solution are required" });
        }

        console.log(`📊 Generating pitch deck for user ${userId}...`);

        const prompt = `
            Create comprehensive pitch deck content for an investor presentation:
            
            Business Name: ${business_name}
            Problem: ${problem}
            Solution: ${solution}
            Market Size: ${market_size || 'Not specified'}
            Business Model: ${business_model || 'Not specified'}
            Competitive Advantage: ${competitive_advantage || 'Not specified'}
            
            Generate detailed content for ALL 10 slides. Do not stop until all 10 are complete:
            1. Problem Statement
            2. Solution Overview
            3. Market Opportunity
            4. Product/Service
            5. Business Model
            6. Competitive Analysis
            7. Go-to-Market Strategy
            8. Traction/Milestones
            9. Team
            10. Financial Ask
            
            For each slide, provide a compelling headline and 3-5 bullet points with specific details.
        `;

        // ✅ FIXED: 4000 tokens for full 10-slide pitch deck
        const content = await generateAIContent(prompt, 4000);

        await sql`INSERT INTO creations (user_id, prompt, content, type, category) VALUES (${userId}, ${business_name}, ${content}, 'pitch-deck', 'business-planning')`;

        console.log(`✅ Pitch deck generated successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Generate Pitch Deck Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const generateMarketResearch = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { industry, target_market, research_focus } = req.body;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;

        if (!industry || !target_market) {
            return res.json({ success: false, message: "Industry and target market are required" });
        }

        console.log(`🔍 Generating market research for user ${userId}...`);

        const prompt = `
            Conduct comprehensive market research analysis:
            
            Industry: ${industry}
            Target Market: ${target_market}
            Research Focus: ${research_focus || 'General market analysis'}
            
            Provide detailed insights on ALL sections below. Complete every section fully:
            1. Market Overview - Size, growth trends, and key drivers
            2. Customer Segments - Demographics, behaviors, and pain points
            3. Market Trends - Current and emerging trends
            4. Opportunities - Untapped markets and growth areas
            5. Recommendations - Strategic actions based on research
            
            Include specific data points and actionable insights.
        `;

        // ✅ FIXED: 3500 tokens for complete research
        const content = await generateAIContent(prompt, 3500);

        await sql`INSERT INTO creations (user_id, prompt, content, type, category) VALUES (${userId}, ${`${industry} - ${target_market}`}, ${content}, 'market-research', 'business-planning')`;

        console.log(`✅ Market research generated successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Generate Market Research Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const generateCompetitorAnalysis = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { your_business, industry, competitors } = req.body;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;

        if (!your_business || !industry) {
            return res.json({ success: false, message: "Your business name and industry are required" });
        }

        console.log(`⚔️ Generating competitor analysis for user ${userId}...`);

        const prompt = `
            Perform detailed competitive analysis:
            
            Your Business: ${your_business}
            Industry: ${industry}
            Known Competitors: ${competitors || 'Research and identify main competitors'}
            
            Provide ALL sections below completely:
            1. Competitive Landscape - Overview of the competitive environment
            2. Direct Competitors - Analysis of 3-5 main competitors
            3. Strengths & Weaknesses - SWOT analysis for each competitor
            4. Positioning Strategy - How to differentiate your business
            5. Recommendations - Strategic actions to gain competitive advantage
            
            Be specific and actionable with your recommendations.
        `;

        // ✅ FIXED: 3500 tokens for full analysis
        const content = await generateAIContent(prompt, 3500);

        await sql`INSERT INTO creations (user_id, prompt, content, type, category) VALUES (${userId}, ${your_business}, ${content}, 'competitor-analysis', 'business-planning')`;

        console.log(`✅ Competitor analysis generated successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Generate Competitor Analysis Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

export const generateFinancialProjections = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { business_model, revenue_streams, pricing, target_customers, costs } = req.body;
        const plan = req.plan;

        if (!checkPremiumAccess(plan, res)) return;

        if (!business_model || !revenue_streams) {
            return res.json({ success: false, message: "Business model and revenue streams are required" });
        }

        console.log(`💰 Generating financial projections for user ${userId}...`);

        const prompt = `
            Create realistic 3-year financial projections and analysis:
            
            Business Model: ${business_model}
            Revenue Streams: ${revenue_streams}
            Pricing: ${pricing || 'Not specified'}
            Target Customers (Year 1): ${target_customers || 'Not specified'}
            Estimated Costs: ${costs || 'Not specified'}
            
            Provide ALL sections below completely:
            1. Revenue Projections - Monthly breakdown for Year 1, quarterly for Years 2-3
            2. Cost Structure - Fixed and variable costs
            3. Unit Economics - Customer acquisition cost, lifetime value, margins
            4. Break-even Analysis - Timeline and key assumptions
            5. Cash Flow - Basic cash flow projections
            6. Key Assumptions - List all assumptions made
            7. Recommendations - Financial strategy recommendations
            
            Be realistic and conservative. Show calculation logic. Complete all 7 sections.
        `;

        // ✅ FIXED: 4000 tokens for full financial projections
        const content = await generateAIContent(prompt, 4000);

        await sql`INSERT INTO creations (user_id, prompt, content, type, category) VALUES (${userId}, ${business_model}, ${content}, 'financial-projections', 'business-planning')`;

        console.log(`✅ Financial projections generated successfully`);
        res.json({ success: true, content });
    } catch (error) {
        console.error('❌ Generate Financial Projections Error:', error.message);
        res.json({ success: false, message: error.message });
    }
};