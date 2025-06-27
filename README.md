# CoalMineNetZero - Carbon Management Platform

A comprehensive carbon management platform for coal mining operations, featuring AI-powered insights and real-time monitoring.

## 🌟 Key Features

### 🤖 AI-Powered Insights
- **Gemini AI Integration**: Advanced AI analysis powered by Google's Gemini Pro
- **Smart Recommendations**: Personalized carbon reduction strategies
- **Emission Analysis**: AI-driven pattern recognition and optimization suggestions
- **Compliance Reports**: Automated regulatory compliance assessment
- **Chat Assistant**: Interactive AI assistant for carbon management guidance

### 📊 Dashboard & Analytics
- **Real-time Monitoring**: Live emission tracking and carbon sink monitoring
- **Interactive Charts**: Visual representation of emission trends and patterns
- **Progress Tracking**: Carbon neutrality progress with animated indicators
- **Performance Metrics**: Sustainability scoring and reduction percentages

### 🔔 Smart Notifications
- **Success Alerts**: Achievement notifications for emission reductions
- **Warning System**: Excess emission alerts and compliance reminders
- **Priority Management**: High, medium, and low priority notifications
- **Action Items**: Direct action buttons for quick response
- **Filtering**: Filter by unread, priority, or all notifications

### 📋 Strategy Management
- **AI Recommendations**: Gemini AI-powered strategy suggestions
- **Implementation Planning**: Phase-wise strategy execution
- **ROI Analysis**: Cost-benefit analysis of sustainability projects
- **Progress Monitoring**: Real-time updates on strategy implementation
- **Status Tracking**: Planned, in-progress, and completed projects

### 📋 Reports & Analytics
- **Comprehensive Reports**: Detailed emission and offset reports
- **Trend Analysis**: Historical data visualization
- **Regulatory Compliance**: Reports for regulatory submissions
- **Performance Metrics**: Key performance indicators

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite
- **AI Integration**: Google Gemini Pro API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini AI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coalmine-carbon-compass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Gemini AI (Optional)**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

Use these credentials to test the application:

| Role | Email | Password |
|------|-------|----------|
| Mine Operator | `operator@coalmine.gov.in` | `password123` |
| Regulator | `regulator@cpcb.gov.in` | `password123` |
| Admin | `admin@coalmine.gov.in` | `password123` |

## 🤖 AI Features

### Gemini AI Integration
The platform integrates Google's Gemini Pro AI for:
- **Strategy Recommendations**: AI-powered carbon reduction strategies
- **Emission Analysis**: Pattern recognition and optimization suggestions
- **Compliance Reports**: Automated regulatory compliance assessment
- **Chat Assistant**: Interactive AI guidance for carbon management

### AI Capabilities
- Real-time data analysis
- Predictive modeling for emission trends
- Personalized recommendations based on mine data
- Natural language interaction for complex queries
- Multi-language support for Indian mining operations

## 📊 Data Management

### Local Storage
The application uses localStorage for data persistence:
- `coalmine_user`: User authentication data
- `coalmine_emissions`: Emission entries
- `coalmine_carbon_sinks`: Carbon sink projects
- `coalmine_strategies`: Reduction strategies

### CO₂ Calculations
All calculations are based on:
- **IPCC 2006 Guidelines**: Emission factors
- **CEA 2023**: Indian grid electricity mix
- **ARAI 2023**: Transport emission factors

## 🔔 Notification System

### Types of Notifications
- **Success**: Achievement alerts for emission reductions and milestones
- **Warning**: Excess emission alerts and compliance issues
- **Error**: High-risk situations requiring immediate attention
- **Info**: Recommendations and insights
- **Reminder**: Data entry reminders and report deadlines

### Features
- Priority-based sorting (High > Medium > Low)
- Read/unread status tracking
- Action buttons for quick response
- Filtering and search capabilities
- Automatic generation based on data patterns

## 🎯 Key Benefits

- **AI-Powered Insights**: Leverage advanced AI for strategic decision-making
- **Real-time Monitoring**: Track emissions and progress in real-time
- **Regulatory Compliance**: Automated compliance reporting and alerts
- **Cost Optimization**: AI-driven recommendations for maximum ROI
- **Sustainability Goals**: Clear path to carbon neutrality
- **User-Friendly Interface**: Intuitive design for all user types

## 📈 Future Enhancements

- **Advanced AI Models**: Integration with additional AI providers
- **Mobile Application**: Native mobile app for field operations
- **IoT Integration**: Real-time sensor data integration
- **Blockchain**: Carbon credit verification and trading
- **Multi-language Support**: Additional Indian languages
- **Advanced Analytics**: Machine learning for predictive insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@coalmine.gov.in
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**Built with ❤️ for sustainable mining operations**
