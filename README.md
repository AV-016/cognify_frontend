# Cognify - Health Monitoring Dashboard

A comprehensive health-tech dashboard designed for elderly care management with features for patients, caregivers, and healthcare providers.

## Features

### Core Functionality
- **Authentication System** - Secure login with mock users (patient, caregiver, doctor)
- **Health Metrics Dashboard** - Real-time vital signs monitoring including:
  - Heart rate
  - Blood pressure (systolic/diastolic)
  - Oxygen levels
  - Temperature
  - Weight
  - Daily steps
  - Sleep duration

- **Health Trends Analysis** - Detailed historical analysis with:
  - 7, 30, and 90-day views
  - Min/max/average calculations
  - Interactive charts for each metric
  - Visual trend identification

- **Alert Management** - Comprehensive notification system:
  - Critical alerts (requires immediate attention)
  - Warning alerts (monitor closely)
  - Info alerts (informational messages)
  - Alert dismissal and filtering
  - Unread count tracking

- **Caregiver Management** - Care team coordination:
  - Primary caregiver assignment
  - Secondary caregivers
  - Contact information and quick messaging
  - Permission management

- **User Profiles** - Personal health information management:
  - Basic profile info (name, email, phone, address)
  - Medical information (blood type, allergies, conditions)
  - Emergency contacts
  - Profile editing

- **Settings** - Comprehensive configuration:
  - Notification preferences
  - Privacy & sharing controls
  - Display preferences (units, time format)
  - Account security

## Demo Accounts

The dashboard includes three pre-configured demo accounts:

```
Patient Account
Email: john@example.com
Password: password123
Role: Patient (Senior)

Caregiver Account
Email: sarah@example.com
Password: password123
Role: Caregiver (Family member)

Doctor Account
Email: doctor@example.com
Password: password123
Role: Doctor (Healthcare provider)
```

Quick login buttons are available on the login page for easy access.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Context + localStorage
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Project Structure

```
app/
├── page.tsx                 # Root redirect page
├── layout.tsx               # Root layout with AppProvider
├── globals.css              # Global styles and design tokens
├── login/
│   └── page.tsx            # Login page with demo buttons
├── dashboard/
│   └── page.tsx            # Main dashboard with vital signs
├── trends/
│   └── page.tsx            # Health trends analysis
├── alerts/
│   └── page.tsx            # Alert management
├── caregivers/
│   └── page.tsx            # Caregiver management
├── profile/
│   └── page.tsx            # User profile editing
└── settings/
    └── page.tsx            # Settings and preferences

components/
├── dashboard-layout.tsx     # Main layout wrapper with sidebar
├── protected-route.tsx      # Route protection wrapper
└── ui/                      # shadcn/ui components

lib/
├── types.ts                 # TypeScript interfaces
├── context.tsx              # React Context for state management
└── utils.ts                 # Utility functions
```

## Getting Started

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser
5. Use demo credentials to login

### Customization

#### Design System
Colors and typography can be customized in:
- `app/globals.css` - CSS design tokens (--primary, --accent, etc.)
- `tailwind.config.ts` - Tailwind configuration

#### Mock Data
Modify mock data in `lib/context.tsx`:
- `MOCK_USERS` - User accounts
- `MOCK_MEDICATIONS` - Medication list
- `MOCK_ALERTS` - Sample alerts
- `MOCK_CAREGIVERS` - Care team
- `generateHealthMetrics()` - Health data generation

#### Theme Colors
The dashboard uses a healthcare-focused color scheme:
- Primary: Trustworthy Blue (`oklch(0.52 0.16 259)`)
- Secondary: Light Blue (`oklch(0.9 0.05 249)`)
- Accent: Bright Blue (`oklch(0.68 0.15 256)`)
- Supports both light and dark modes

## Features in Detail

### Health Metrics
The dashboard displays real-time health metrics with:
- Current values
- Trend indicators
- Normal range references
- Historical comparison

### Trends & Analytics
Advanced analytics with:
- Time-range filtering (7/30/90 days)
- Statistical calculations (avg, min, max)
- Interactive Recharts visualizations
- Tab-based metric organization

### Alerts System
Smart alert management with:
- Severity-based filtering
- Read/unread status
- Alert guidelines documentation
- Quick actions (dismiss, delete)

### Responsive Design
- Mobile-first approach
- Hamburger menu on smaller screens
- Adaptive grid layouts
- Touch-friendly interface

## Data Persistence

The app uses `localStorage` for client-side persistence:
- User session (`cognify-user`)
- Health metrics (`cognify-metrics`)

**Note**: For production, replace with a real backend database (Supabase, Neon, etc.)

## Security Considerations

- All passwords are hashed in production (use bcrypt)
- Implement proper authentication (JWT, sessions)
- Add rate limiting on login attempts
- Use HTTPS only
- Implement Row Level Security (RLS) on database

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance Optimizations

- Code splitting by route
- Image optimization
- CSS minification
- Component lazy loading
- Chart data limits (30-day default)

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Future Enhancements

- [ ] Real backend database integration
- [ ] Wearable device integration
- [ ] Advanced ML-based health predictions
- [ ] Video consultation features
- [ ] Prescription management
- [ ] Lab results integration
- [ ] Multi-language support
- [ ] Mobile app versions (iOS/Android)
- [ ] Real-time collaboration features
- [ ] Advanced permission system

## Troubleshooting

### Session not persisting
- Check browser localStorage is enabled
- Clear cache and reload
- Try incognito/private mode

### Charts not rendering
- Ensure Recharts is properly installed
- Check browser console for errors
- Verify data format matches chart expectations

### Performance issues
- Reduce date range in trends
- Check browser DevTools Performance tab
- Clear localStorage if too large

## Support

For issues or questions, please refer to:
- Next.js Documentation: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
- Recharts: https://recharts.org

## License

MIT License - Feel free to use for personal and commercial projects.

---

**Cognify** - Empowering Healthier Lives Through Technology
# cognify_frontend
