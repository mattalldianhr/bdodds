# Backgammon Dice Probability Visualizer

An interactive web app that helps users understand the 36 equally likely outcomes when rolling two dice in backgammon.

## Features

- **Interactive 6x6 Grid**: Visualizes all 36 dice combinations, showing why doubles count once while other combinations count twice
- **Live Dice Roller**: Animated dice rolling with real-time statistics tracking
- **Probability Calculator**: Click any sum (2-12) to see which combinations produce it and the exact probability

## Local Development

Simply open `index.html` in a web browser. No build process required - it's pure HTML, CSS, and JavaScript.

## Deployment to Cloudflare Pages

1. **Install Cloudflare CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy the site**:
   ```bash
   wrangler pages deploy . --project-name=backgammon-dice-simulator
   ```

   Or use the Cloudflare dashboard:
   - Go to Cloudflare Dashboard > Pages
   - Create a new project
   - Connect your Git repository or upload the files directly
   - Set build command to: (leave empty - no build needed)
   - Set output directory to: `/` (root)

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and animations
- `script.js` - Dice logic and interactivity

## How It Works

The key insight is that when rolling two dice, there are 36 equally likely outcomes:
- Doubles (1-1, 2-2, etc.) can only occur one way
- Non-doubles (like 6-5) can occur two ways: 6 on die A + 5 on die B, OR 5 on die A + 6 on die B

This is why the probability of rolling a 7 (6 ways) is higher than rolling a 2 (1 way) or 12 (1 way).




