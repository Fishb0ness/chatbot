# Web Design Services Sales Chatbot

This project provides a customer-facing chatbot for a web design agency to increase sales by helping potential clients understand service offerings, showcase portfolio examples, and guide customers through the buying process.

## Features

- Informative responses about web design services and packages
- Dynamic portfolio examples based on customer's business type
- Package comparison and recommendations
- Clear explanations of pricing and features
- Guided sales process from inquiry to consultation
- Modern, responsive web interface
- Customer feedback collection
- Business-specific context awareness

## Setup Instructions

### Prerequisites

- Node.js (v18 or newer)
- OpenAI API key

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the environment template and add your OpenAI API key:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file and add your OpenAI API key

### Configuration

1. Edit `chatbot-config.json` with your company details:
   - Company name and brand voice
   - Web design service packages and pricing
   - Portfolio examples
   - Business types and industries you serve
   - Feature categories for different website packages

2. Customize `chatbot-prompt.md` to fit your specific services:
   - Update website package details and pricing
   - Customize portfolio examples and case studies
   - Refine value propositions for professional web design
   - Add FAQs and competitor comparisons
   - Tailor the conversation flow for your sales process

### Running the Application

For development:
```
npm run dev
```

For production:
```
npm start
```

The application will be available at `http://localhost:3000`

## Customizing Your Chatbot

### Prompt Engineering

The core of your chatbot's capabilities is in the `chatbot-prompt.md` file. This serves as the system instructions for the AI model. Here are some tips for effective customization:

1. **Be Specific:** Clearly define the tasks and processes your chatbot should handle
2. **Add Examples:** Include realistic examples of interactions specific to your company
3. **Define Tone:** Set guidelines for how formal or casual the responses should be
4. **Task Instructions:** Break down complex workflows into clear steps
5. **Update Regularly:** Revise the prompt as you gather feedback from users

### Extending Functionality

To add new capabilities:

1. Update the task categories in `chatbot-config.json`
2. Add relevant keywords for detection
3. Add new examples in the prompt file
4. If needed, create API endpoints in `app.js` for integrations
5. Add new quick links in the frontend

## Security Considerations

- Store sensitive API keys in environment variables
- Implement proper user authentication before deployment
- Consider data privacy regulations when storing conversation history
- Limit the chatbot's access to sensitive systems
- Implement proper logging for audit purposes

## Troubleshooting

- **Chatbot gives incorrect information:** Update the prompt with more precise examples
- **Rate limiting errors:** Check your OpenAI usage and limits
- **Slow responses:** Consider implementing caching for common queries

## License

[Your License Information]

## Support

For questions or issues, please contact [your contact information].
