import logo from "./logo.svg";
import gradientBackground from "./gradientBackground.png";
import user_group from "./user_group.png";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import profile_img_1 from "./profile_img_1.png";
import arrow_icon from "./arrow_icon.svg";
import { 
    SquarePen, Hash, Image, Eraser, Scissors, FileText,
    Lightbulb, Presentation, BarChart, Target, DollarSign, 
    CheckSquare, Users, TrendingUp
} from 'lucide-react';

export const assets = {
    logo,
    gradientBackground,
    user_group,
    star_icon,
    star_dull_icon,
    profile_img_1,
    arrow_icon,
};

// Organized by categories for entrepreneurship - with updated colors matching #2C459D theme
export const AiToolsData = [
    // Business Planning Tools
    {
        title: 'Business Idea Validator',
        description: 'Validate your business ideas with AI-powered market analysis and feasibility assessment.',
        Icon: Lightbulb,
        bg: { from: '#2C459D', to: '#4A63B3' },
        path: '/ai/validate-idea',
        category: 'planning'
    },
    {
        title: 'Pitch Deck Generator',
        description: 'Create compelling pitch deck content that captures investor attention.',
        Icon: Presentation,
        bg: { from: '#1F3278', to: '#2C459D' },
        path: '/ai/pitch-deck',
        category: 'planning'
    },
    
    // Content Creation Tools
    {
        title: 'Business Content Writer',
        description: 'Generate business plans, investor updates, blog posts, and marketing content.',
        Icon: SquarePen,
        bg: { from: '#3D56B2', to: '#5A74C7' },
        path: '/ai/write-article',
        category: 'content'
    },
    {
        title: 'Marketing Title Generator',
        description: 'Create catchy titles for blogs, products, campaigns, and social media posts.',
        Icon: Hash,
        bg: { from: '#6B7FCC', to: '#8798D6' },
        path: '/ai/blog-titles',
        category: 'content'
    },
    
    // Visual Tools
    {
        title: 'Product Visual Creator',
        description: 'Generate product mockups, marketing visuals, and presentation graphics with AI.',
        Icon: Image,
        bg: { from: '#4158A8', to: '#5B72BD' },
        path: '/ai/generate-images',
        category: 'visual'
    },
    {
        title: 'Background Removal',
        description: 'Create professional product photos and team headshots by removing backgrounds.',
        Icon: Eraser,
        bg: { from: '#2C459D', to: '#3851A5' },
        path: '/ai/remove-background',
        category: 'visual'
    },
    {
        title: 'Image Object Removal',
        description: 'Perfect your product photography by removing unwanted objects seamlessly.',
        Icon: Scissors,
        bg: { from: '#344D9F', to: '#4860B0' },
        path: '/ai/remove-object',
        category: 'visual'
    },
    
    // Professional Tools
    {
        title: 'Resume & Profile Optimizer',
        description: 'Optimize resumes for founders, team members, and job applications with AI feedback.',
        Icon: FileText,
        bg: { from: '#5168BC', to: '#6A80CA' },
        path: '/ai/review-resume',
        category: 'professional'
    }
];

// Tool categories for filtering
export const toolCategories = [
    { id: 'all', name: 'All Tools', Icon: Target },
    { id: 'planning', name: 'Business Planning', Icon: Lightbulb },
    { id: 'content', name: 'Content Creation', Icon: SquarePen },
    { id: 'visual', name: 'Visual Design', Icon: Image },
    { id: 'professional', name: 'Professional', Icon: FileText }
];

// Business stages for project management
export const businessStages = [
    { value: 'ideation', label: 'Ideation', color: '#2C459D', Icon: Lightbulb },
    { value: 'planning', label: 'Planning', color: '#3D56B2', Icon: CheckSquare },
    { value: 'development', label: 'Development', color: '#4A63B3', Icon: TrendingUp },
    { value: 'launch', label: 'Launch', color: '#5B72BD', Icon: Target },
    { value: 'growth', label: 'Growth', color: '#6A80CA', Icon: BarChart }
];

// Industries for business classification
export const industries = [
    'Technology', 'E-commerce', 'Healthcare', 'Education', 
    'Finance', 'Real Estate', 'Food & Beverage', 'Entertainment',
    'Marketing', 'Consulting', 'Manufacturing', 'Retail', 'Other'
];

// Task priorities
export const taskPriorities = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' }
];

// Updated testimonials for entrepreneurship focus
export const testimonialData = [
    {
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
        name: 'Sarah Chen',
        title: 'Founder, TechStart Inc',
        content: 'QuickVenture AI helped me validate my business idea and create a compelling pitch deck in days, not weeks. The AI tools are incredible for early-stage founders.',
        rating: 5,
    },
    {
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
        name: 'Michael Rodriguez',
        title: 'CEO, GrowthLabs',
        content: 'The business planning tools and content generation features have been game-changers for our startup. We can focus on building while AI handles the documentation.',
        rating: 5,
    },
    {
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
        name: 'Emily Watson',
        title: 'Entrepreneur & Consultant',
        content: 'I use QuickVenture for all my client projects. From market research to visual content, everything I need for entrepreneurship in one platform.',
        rating: 5,
    },
];

// Quick actions for dashboard
export const quickActions = [
    {
        title: 'Start New Project',
        description: 'Create a new business project',
        Icon: Target,
        action: 'create-project',
        color: '#2C459D'
    },
    {
        title: 'Validate Idea',
        description: 'Get AI feedback on your business idea',
        Icon: Lightbulb,
        action: 'validate-idea',
        color: '#3D56B2'
    },
    {
        title: 'Generate Content',
        description: 'Create marketing or business content',
        Icon: SquarePen,
        action: 'write-content',
        color: '#4A63B3'
    },
    {
        title: 'Create Visuals',
        description: 'Generate product or marketing images',
        Icon: Image,
        action: 'generate-image',
        color: '#5B72BD'
    }
];