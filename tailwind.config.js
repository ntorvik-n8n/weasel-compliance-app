/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Dark Theme Colors (inspired by your mockups)
        dark: {
          bg: '#1a1b1e',           // Main background
          surface: '#2b2d31',       // Cards and panels
          elevated: '#36373d',      // Hover states
          border: '#3f4147',        // Dividers
          text: {
            primary: '#ffffff',     // Headings
            secondary: '#b5bac1',   // Body text
            muted: '#80848e',       // Subtle text
          }
        },
        // Risk & Status Colors
        risk: {
          critical: '#ed4245',      // 7-10 risk score
          high: '#f26522',          // 5-6 risk score
          medium: '#faa61a',        // 3-4 risk score
          low: '#57f287',           // 1-2 risk score
          none: '#3ba55d',          // 0 risk score
        },
        // Compliance Colors
        compliance: {
          violation: '#ed4245',     // Red for violations
          warning: '#fee75c',       // Yellow for warnings
          pass: '#3ba55d',          // Green for compliant
        },
        // Badge Colors (from your mockup)
        badge: {
          abusive: '#ed4245',       // Red badge
          pressure: '#5865f2',      // Purple/blue badge
          threat: '#eb459e',        // Pink badge
          success: '#23a55a',       // Green badge
        }
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 2px 10px 0 rgba(0, 0, 0, 0.2)',
        'card-hover': '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
