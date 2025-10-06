# 🎳 Bowling Coach Post Generator

A React web application that helps high school bowling coaches create engaging Facebook posts and tips using AI. The app uses Google's Gemini AI to generate content with a coaching personality tailored to bowling education and team motivation.

## Features

- **AI-Powered Content Generation**: Uses Google Gemini AI to create authentic, engaging posts
- **Multiple Post Types**:
  - Tip of the Day
  - Motivational posts
  - Technique deep dives
  - Team achievements
  - Practice drills
  - Mental game tips
  - Equipment advice
  - Event announcements
  - Season reflections

- **Comprehensive Topic Library**:
  - Fundamentals (Stance, Approach, Release, etc.)
  - Advanced Techniques (Hook Ball, Oil Patterns, etc.)
  - Mental Game (Focus, Pressure, Visualization)
  - Physical Fitness (Stretching, Core Strength, etc.)
  - Etiquette & Sportsmanship
  - Strategy (Spare Systems, Match Play, etc.)

- **Customizable Content**:
  - Skill level targeting (Beginner, Intermediate, Advanced, All Levels)
  - Custom topics
  - Additional context for personalization

- **USBC Resources Integration**: Direct links to official USBC coaching materials

## Security Features

- **Environment Variable Protection**: API keys stored in `.env` files (automatically excluded from git)
- **Client-Side Only**: No backend server means no stored credentials
- **No Automatic Posting**: Manual post creation prevents accidental publishing
- **Secure API Communication**: Direct integration with Google's Gemini API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key (free tier available)

## Installation

1. **Clone or navigate to the project**:
   ```bash
   cd bowling-coach-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Open `.env` and add your API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to the URL shown in the terminal (typically `http://localhost:5173`)

## Usage

1. **Configure Your Post**:
   - Select a post type (e.g., "Tip of the Day")
   - Choose the skill level for your audience
   - Pick a topic category and specific topic
   - Optionally add a custom topic or additional context

2. **Generate Content**:
   - Click "Generate Post"
   - Wait for the AI to create your content
   - Review the generated post

3. **Copy and Post**:
   - Click "Copy to Clipboard" to copy the post
   - Paste into your Facebook page
   - Make any final edits before posting

4. **Regenerate if Needed**:
   - Click "Regenerate" to get a new version
   - Adjust parameters for different results

## Project Structure

```
bowling-coach-app/
├── src/
│   ├── services/
│   │   ├── gemini.ts              # Gemini AI integration
│   │   └── coachPersonality.ts    # Coach personality & prompts
│   ├── App.tsx                     # Main application component
│   ├── App.css                     # Application styles
│   └── main.tsx                    # Application entry point
├── .env.example                    # Example environment variables
├── .env                            # Your API keys (DO NOT COMMIT)
├── .gitignore                      # Git ignore rules (includes .env)
└── package.json                    # Project dependencies
```

## Security Best Practices

### API Key Safety
- ✅ **DO**: Keep your `.env` file local and never commit it
- ✅ **DO**: Use the `.env.example` file as a template
- ✅ **DO**: Rotate your API key if you suspect it's been compromised
- ❌ **DON'T**: Share your API key with others
- ❌ **DON'T**: Commit `.env` files to version control
- ❌ **DON'T**: Deploy with exposed API keys

**Git Safety Features Included:**
- `.env` is automatically ignored by `.gitignore`
- Pre-commit hook prevents accidental `.env` commits
- Git attributes file provides additional protection
- `git status` will never show `.env` as untracked

### For Production Deployment
If you plan to deploy this app publicly:
1. Set up a backend server to proxy API requests
2. Store API keys on the server side
3. Implement rate limiting
4. Add authentication if needed

### USBC Credentials
The app doesn't require USBC login credentials. It only references publicly available USBC coaching resources via links. You do NOT need to provide any USBC credentials to use this app.

## Technology Stack

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tool
- **Google Gemini AI**: Content generation
- **CSS3**: Custom styling

## Customization

### Adjusting the Coach Personality
Edit `src/services/coachPersonality.ts` to modify:
- Coaching tone and style
- Expertise areas
- Topic categories
- Post generation guidelines

### Adding New Post Types
1. Add your post type to the `PostType` union in `coachPersonality.ts`
2. The UI will automatically update

### Modifying Topics
Edit the `BOWLING_TOPICS` array in `coachPersonality.ts` to add, remove, or modify topic categories and their items.

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## Troubleshooting

### "API Key not found" error
- Make sure you've created a `.env` file (not just `.env.example`)
- Verify the API key is correctly set in `.env`
- Restart the development server after adding the API key

### Generated content is off-topic
- Add more specific context in the "Additional Context" field
- Try selecting a more specific topic
- Adjust the skill level to match your audience

### Copy to clipboard doesn't work
- Make sure you're using HTTPS (required for clipboard API)
- Some browsers may block clipboard access - check browser permissions

## USBC Resources

This app references these official USBC resources:
- [Bowling Fundamentals](https://bowl.com/welcome/bowling-fundamentals)
- [Etiquette and Lingo](https://bowl.com/welcome/etiquette-and-lingo)
- [Basic Rules](https://bowl.com/welcome/basic-rules)
- [Fundamental Coaching](https://bowl.com/coaching/fundamental/)
- [Intermediate Coaching](https://bowl.com/coaching/intermediate/)
- [Advanced Coaching](https://bowl.com/coaching/advanced/)
- [Physical Fitness PDF](https://images.bowl.com/bowl/media/legacy/internap/bowl/coaching/pdfs/Physical_Fitness.pdf)

## License

This project is for educational and coaching purposes. Please respect USBC's copyright on their coaching materials.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the USBC coaching resources
3. Verify your Gemini API key is valid and has available quota

## Acknowledgments

- United States Bowling Congress (USBC) for coaching resources
- Google for the Gemini AI API
- The bowling coaching community

---

**Note**: This app is designed for manual post creation. Always review and edit generated content before posting to ensure it matches your team's needs and your coaching style.
