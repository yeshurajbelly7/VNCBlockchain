# VNC-20 Blockchain - HTML Pages

## 📁 Complete Standalone HTML Website

These are fully functional, standalone HTML pages with embedded CSS and JavaScript. No Node.js, npm, or build process required - just open in your browser!

## 🎨 Dark Quantum Theme

All pages feature a beautiful dark theme with quantum-inspired gradients:
- **Primary Color**: `#0ea5e9` (Cyan/Blue)
- **Quantum Color**: `#a855f7` (Purple)
- **Background**: Dark gradient from `#060610` to `#0f0f1e`
- Smooth animations and transitions
- Responsive design for all screen sizes

## 📄 Available Pages

### 1. **index.html** - Home Page
- Hero section with animated gradients
- Network statistics cards
- Live performance metrics with simulated real-time updates
- Latest blocks and transactions
- Feature showcase (6 key features)
- Complete footer with links

**Features:**
- Real-time TPS counter (updates every 3 seconds)
- Animated hero background with pulse effects
- Network stats with live indicators
- Responsive grid layouts

### 2. **explorer.html** - Blockchain Explorer
- Real-time network statistics
- Latest blocks table with pagination
- Transaction history with filtering
- Validator information and rankings
- VNC-20 token listings
- Advanced search functionality

**Features:**
- 4 tabs: Blocks, Transactions, Validators, Tokens
- Search by block number, transaction hash, or address
- Auto-refreshing data (every 3 seconds)
- Clickable rows for detailed views
- Sortable tables

### 3. **wallet.html** - Web3 Wallet
- Portfolio balance card with gradient design
- 4 quick action buttons (Send, Receive, Stake, Swap)
- Asset list with multiple tokens
- Staking dashboard with APY calculator
- Recent transaction history
- Interactive modals for all actions

**Features:**
- Send transaction form with MAX button
- Receive with QR code placeholder
- Staking interface with validator selection
- Token swap interface with rate display
- Copy address to clipboard
- Transaction history with icons

### 4. **docs.html** - Documentation
- Complete technical documentation
- Sticky sidebar navigation
- Table of contents with smooth scrolling
- Code examples with syntax highlighting
- API reference
- Staking and validator guides

**Features:**
- 8 major sections with subsections
- Interactive sidebar with active section highlighting
- Code blocks with proper formatting
- Info boxes (info, warning, success)
- Feature grids and comparison tables
- Responsive layout

## 🚀 How to Use

### Option 1: Direct Opening
1. Navigate to the `html` folder
2. Double-click any HTML file
3. It will open in your default browser
4. Navigate between pages using the links

### Option 2: Local Server (Recommended)
```powershell
# Navigate to the html folder
cd "d:\VNC Crypto Blockchan\html"

# Start a simple HTTP server (Python 3)
python -m http.server 8080

# Or using Node.js
npx http-server -p 8080
```

Then open: http://localhost:8080

## 🎯 Interactive Features

### Real-Time Updates
All pages include JavaScript that simulates live blockchain data:
- Network TPS updates every 3 seconds
- Block time calculations
- New blocks and transactions
- Validator statistics

### Navigation
- Fully linked navigation between all pages
- Back to home buttons
- Smooth scroll to sections
- Active link highlighting

### Responsive Design
- Mobile-friendly layouts
- Collapsible menus (CSS-based)
- Flexible grids
- Touch-friendly buttons

## 🛠️ Customization

### Colors
Edit the CSS `:root` variables in each file:
```css
:root {
    --primary: #0ea5e9;        /* Main blue color */
    --quantum: #a855f7;        /* Purple accent */
    --bg-dark: #0f0f1e;        /* Background color */
    --text-primary: #ffffff;    /* Main text color */
    --text-secondary: #94a3b8; /* Secondary text */
}
```

### Content
All content is inline and easy to modify:
- Text is directly in the HTML
- No external dependencies
- Simple structure

## 📊 Page Structure

```
html/
├── index.html          # Home page (8KB)
├── explorer.html       # Blockchain explorer (12KB)
├── wallet.html         # Web3 wallet (14KB)
├── docs.html          # Documentation (16KB)
└── README.md          # This file
```

## 🌟 Key Features

### 1. **Zero Dependencies**
- No npm packages required
- No build process needed
- No external CSS/JS files
- All assets embedded

### 2. **Performance**
- Lightweight (~50KB total)
- Fast loading times
- Optimized animations
- Efficient JavaScript

### 3. **Accessibility**
- Semantic HTML
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support

### 4. **Cross-Browser**
- Works in Chrome, Firefox, Safari, Edge
- Modern CSS with fallbacks
- Progressive enhancement

## 🎨 Design System

### Typography
- **Headers**: Segoe UI, system fonts
- **Code**: Courier New, monospace
- **Font Sizes**: 0.85rem - 4rem (responsive)

### Spacing
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 2rem (32px)
- **XLarge**: 4rem (64px)

### Components
- Cards with hover effects
- Gradient buttons
- Modal dialogs
- Data tables
- Form inputs
- Navigation bars
- Badges and tags

## 🔧 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |

## 💡 Tips

1. **Development**: Use browser DevTools to inspect and modify styles in real-time
2. **Testing**: Test on different screen sizes using browser responsive mode
3. **Performance**: Monitor performance with Lighthouse in Chrome DevTools
4. **Customization**: Start with the CSS variables, then modify individual components

## 🔗 Links Between Pages

- **Home** → Explorer, Wallet, Docs
- **Explorer** → Home (via logo)
- **Wallet** → Home (via logo)
- **Docs** → Home, Explorer, Wallet

## 📱 Mobile Responsiveness

All pages adapt to screen sizes:
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px-1199px (adjusted grids)
- **Mobile**: <768px (single column)

## 🎭 Simulated Data

The pages use JavaScript to generate realistic blockchain data:
- Block numbers increment
- Transaction hashes are random
- TPS fluctuates realistically
- Timestamps update dynamically

## 🚧 Future Enhancements

To connect to a real blockchain:
1. Replace simulated data with API calls
2. Add Web3 wallet integration (MetaMask)
3. Connect to smart contracts
4. Implement real transaction signing
5. Add GraphQL or REST API endpoints

## 📞 Support

For questions or issues:
- Check the docs.html page for technical documentation
- Review the inline comments in the HTML files
- Test in browser DevTools console

## 📜 License

Apache 2.0 License - See main project LICENSE file

---

**Built with ❤️ for the VNC-20 Blockchain Platform**

Enjoy your quantum-ready, dark-themed blockchain website! 🚀
