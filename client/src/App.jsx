import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import ValidateIdea from './pages/ValidateIdea'
import PitchDeck from './pages/PitchDeck'
import MarketResearch from './pages/MarketResearch'
import CompetitorAnalysis from './pages/CompetitorAnalysis'
import FinancialProjections from './pages/FinancialProjections'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Content Creation Tools */}
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          
          {/* Visual Tools */}
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          
          {/* Professional Tools */}
          <Route path='review-resume' element={<ReviewResume />} />
          
          {/* NEW: Business Planning Tools */}
          <Route path='validate-idea' element={<ValidateIdea />} />
          <Route path='pitch-deck' element={<PitchDeck />} />
          <Route path='market-research' element={<MarketResearch />} />
          <Route path='competitor-analysis' element={<CompetitorAnalysis />} />
          <Route path='financial-projections' element={<FinancialProjections />} />
          
          {/* NEW: Project Management */}
          <Route path='projects' element={<Projects />} />
          <Route path='projects/:id' element={<ProjectDetails />} />
          
          {/* Community */}
          <Route path='community' element={<Community />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App