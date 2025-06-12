require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'chatbot-config.json'), 'utf8'));

// Load system prompt
const systemPrompt = fs.readFileSync(path.join(__dirname, 'chatbot-prompt.md'), 'utf8')
  .replace(/\[Your Company Name\]/g, config.companyName)
  .replace(/\[Professional\/Creative\/Friendly\]/g, process.env.BRAND_VOICE || 'Professional yet friendly')
  .replace(/\[Location\]/g, config.mainOfficeLocation || 'our office');

// Portfolio examples for different business types
const portfolioExamples = {
  restaurant: {
    businessName: "Pasta Paradise",
    businessType: "Italian Restaurant",
    websiteType: "Advanced Service Business Website",
    features: [
      "Online reservation system",
      "Digital menu with beautiful food photography",
      "Google Maps integration for directions",
      "Mobile-optimized ordering for takeout",
      "Instagram feed integration showing latest dishes"
    ],
    results: "Increased online reservations by 45% in the first month",
    testimonial: "The online reservation system has completely transformed how we manage our bookings. Our customers love being able to book anytime, and we've seen a significant increase in our weekday dinner traffic."
  },
  salon: {
    businessName: "Style Studio",
    businessType: "Hair Salon",
    websiteType: "Advanced Service Business Website",
    features: [
      "Online appointment booking system",
      "Staff profiles with specialties and availability",
      "Before & after gallery of hairstyles",
      "Service menu with pricing",
      "Integrated client reviews"
    ],
    results: "Reduced no-shows by 60% with automated appointment reminders",
    testimonial: "Our clients love being able to book appointments online at any time. The automated reminders have dramatically reduced our no-shows, which has been amazing for our business."
  },
  retail: {
    businessName: "Urban Threads",
    businessType: "Clothing Boutique",
    websiteType: "E-commerce Website",
    features: [
      "Full product catalog with detailed descriptions",
      "Size guide and product recommendations",
      "Secure checkout with multiple payment options",
      "Inventory management system",
      "Customer accounts with order history"
    ],
    results: "Generated $12,000 in online sales in the first quarter",
    testimonial: "Adding an online store allowed us to reach customers beyond our local area. Now we ship nationwide and have regular customers from across the country!"
  },
  professional: {
    businessName: "Clear Vision Accounting",
    businessType: "Accounting Firm",
    websiteType: "Extended Basic Page with SEO",
    features: [
      "Professional service descriptions with clear pricing",
      "Client portal for document uploads",
      "SEO optimization for local accounting searches",
      "Lead capturing contact forms",
      "Resource library with tax guides"
    ],
    results: "Ranking on first page of Google for 'local accounting services'",
    testimonial: "The SEO work on our website has completely changed our business. We're now getting qualified leads directly through our website every day without spending on ads."
  },
  startup: {
    businessName: "Launch Innovation",
    businessType: "Tech Startup",
    websiteType: "Basic Landing Page",
    features: [
      "Clean, modern design with animated elements",
      "Clear explanation of product benefits",
      "Email signup for product launch notifications",
      "Team member profiles",
      "Press kit and media resources"
    ],
    results: "Collected 1,500 email signups before product launch",
    testimonial: "Our landing page helped us validate our product concept and build an audience before we even launched. It was the perfect starting point for our new business."
  }
};

// Chat history storage (in production, use a database)
const chatHistories = {};

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId, context = {} } = req.body;
    
    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and userId are required' });
    }

    // Initialize or retrieve chat history
    if (!chatHistories[userId]) {
      chatHistories[userId] = [];
    }    // Add context information if available
    let contextualizedPrompt = systemPrompt;
    
    // Add website-specific context
    if (context.businessType) {
      contextualizedPrompt += `\nUser business type: ${context.businessType}`;
    }
    
    if (context.websiteGoals) {
      contextualizedPrompt += `\nUser website goals: ${context.websiteGoals}`;
    }
      // Add portfolio data based on query
    const lowerMessage = message.toLowerCase();
    let portfolioContext = '';
    
    // Check for business type mentions to provide relevant examples
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('cafe') || lowerMessage.includes('dining')) {
      const example = portfolioExamples.restaurant;
      portfolioContext += `\n\nRelevant Portfolio Example - ${example.businessName} (${example.businessType}):
- Package: ${example.websiteType}
- Key features: ${example.features.join(', ')}
- Results: ${example.results}
- Client testimonial: "${example.testimonial}"`;
    }
    
    if (lowerMessage.includes('salon') || lowerMessage.includes('spa') || lowerMessage.includes('hair') || lowerMessage.includes('beauty') || lowerMessage.includes('barber')) {
      const example = portfolioExamples.salon;
      portfolioContext += `\n\nRelevant Portfolio Example - ${example.businessName} (${example.businessType}):
- Package: ${example.websiteType}
- Key features: ${example.features.join(', ')}
- Results: ${example.results}
- Client testimonial: "${example.testimonial}"`;
    }
    
    if (lowerMessage.includes('shop') || lowerMessage.includes('store') || lowerMessage.includes('retail') || lowerMessage.includes('boutique') || lowerMessage.includes('sell products') || lowerMessage.includes('e-commerce') || lowerMessage.includes('ecommerce')) {
      const example = portfolioExamples.retail;
      portfolioContext += `\n\nRelevant Portfolio Example - ${example.businessName} (${example.businessType}):
- Package: ${example.websiteType}
- Key features: ${example.features.join(', ')}
- Results: ${example.results}
- Client testimonial: "${example.testimonial}"`;
    }
    
    if (lowerMessage.includes('professional') || lowerMessage.includes('service') || lowerMessage.includes('consult') || lowerMessage.includes('accounting') || lowerMessage.includes('lawyer') || lowerMessage.includes('legal') || lowerMessage.includes('firm')) {
      const example = portfolioExamples.professional;
      portfolioContext += `\n\nRelevant Portfolio Example - ${example.businessName} (${example.businessType}):
- Package: ${example.websiteType}
- Key features: ${example.features.join(', ')}
- Results: ${example.results}
- Client testimonial: "${example.testimonial}"`;
    }
    
    if (lowerMessage.includes('startup') || lowerMessage.includes('new business') || lowerMessage.includes('tech company') || lowerMessage.includes('launch')) {
      const example = portfolioExamples.startup;
      portfolioContext += `\n\nRelevant Portfolio Example - ${example.businessName} (${example.businessType}):
- Package: ${example.websiteType}
- Key features: ${example.features.join(', ')}
- Results: ${example.results}
- Client testimonial: "${example.testimonial}"`;
    }
    
    // Add the portfolio context to the prompt if we found relevant information
    if (portfolioContext) {
      contextualizedPrompt += `\n\nPORTFOLIO EXAMPLES:${portfolioContext}\n\nPlease use these examples in your response when relevant.`;
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: contextualizedPrompt },
      ...chatHistories[userId],
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano", // or your preferred model
      messages: messages,
      max_tokens: 500
    });

    // Get response
    const responseContent = completion.choices[0].message.content;

    // Update chat history
    chatHistories[userId].push({ role: 'user', content: message });
    chatHistories[userId].push({ role: 'assistant', content: responseContent });

    // Limit history size
    if (chatHistories[userId].length > 10) {
      chatHistories[userId] = chatHistories[userId].slice(-10);
    }

    // Send response
    res.json({
      message: responseContent,
      category: detectCategory(message, config.taskCategories)
    });

  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
});

// Helper function to detect category of query
function detectCategory(message, categories) {
  const lowerMessage = message.toLowerCase();
  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return category.name;
      }
    }
  }
  return 'General';
}

// Simple feedback endpoint
app.post('/api/feedback', (req, res) => {
  const { userId, messageId, rating, comment } = req.body;
  // In production, store feedback in database
  console.log(`Feedback received - User: ${userId}, Rating: ${rating}, Comment: ${comment || 'None'}`);
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Enterprise chatbot server running on port ${PORT}`);
  console.log(`Company: ${config.companyName}, Industry: ${config.industry}`);
});
