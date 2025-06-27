# CoalMine Carbon Compass 🌱

A comprehensive carbon neutrality platform designed specifically for Indian coal mines to track, manage, and reduce their carbon footprint while working towards India's Net Zero Mission 2070.

## 🚀 Features

### 🔐 Authentication System
- **Multi-role Support**: Mine Operators, Regulators, and Administrators
- **Secure Login**: Role-based access control
- **Session Management**: Persistent login with localStorage

### 📊 Real-time Dashboard
- **Live Statistics**: Total emissions, carbon offsets, reduction percentages
- **Interactive Charts**: Pie charts, line charts, and progress indicators
- **Carbon Neutrality Progress**: Visual progress towards net-zero goals
- **Sustainability Score**: Dynamic scoring based on performance

### 📝 Emission Management
- **IPCC Standards**: Real CO₂ calculations using IPCC emission factors
- **Multiple Sources**: Diesel, electricity, transport, equipment, refrigerants
- **Automatic Calculations**: Real-time CO₂ equivalent calculations
- **Data Export**: CSV export functionality
- **Bulk Upload**: Advanced CSV import with validation and preview
  - **Drag & Drop**: Intuitive file upload interface
  - **Template Download**: Pre-formatted CSV template
  - **Real-time Validation**: Instant error checking and feedback
  - **Preview Mode**: Review data before import
  - **Progress Tracking**: Visual import progress with status updates
  - **Error Handling**: Detailed error reporting for invalid entries

### 🌿 Carbon Sink Tracking
- **Offset Projects**: Tree plantations, solar installations, energy efficiency
- **Real Calculations**: Based on scientific sequestration factors
- **Project Management**: Track location, description, and progress
- **Advanced Calculator**: Estimate potential offsets for new projects

### 📈 Strategy Management
- **Reduction Strategies**: Plan and track carbon reduction initiatives
- **Progress Monitoring**: Real-time updates on strategy implementation
- **ROI Analysis**: Cost-benefit analysis of sustainability projects
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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

Use these credentials to test the application:

| Role | Email | Password |
|------|-------|----------|
| Mine Operator | `operator@coalmine.gov.in` | `password123` |
| Regulator | `regulator@cpcb.gov.in` | `password123` |
| Admin | `admin@coalmine.gov.in` | `password123` |

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
- **Forest Research Institute India**: Carbon sequestration rates

### CSV Upload Format
The bulk upload feature supports CSV files with the following format:

```csv
Date,Activity Type,Quantity,Unit,Location,Notes
2024-01-15,Diesel Fuel,5000,litres,Block A,Heavy equipment operation
2024-01-14,Electricity,8500,kWh,Processing Plant,Daily operations
```

**Required Fields:**
- **Date**: YYYY-MM-DD format
- **Activity Type**: Must match available emission sources
- **Quantity**: Positive number
- **Unit**: Measurement unit (auto-filled based on activity type)

**Optional Fields:**
- **Location**: Mine section or location
- **Notes**: Additional context or details

**Supported Activity Types:**
- Diesel Fuel (litres)
- Electricity (kWh)
- Vehicle Transport (km)
- Coal Combustion (tonnes)
- Refrigerants (kg)
- Equipment Operation (hours)

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── AppSidebar.tsx  # Navigation sidebar
│   └── CSVUpload.tsx   # Bulk upload component
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── DataContext.tsx # Application data
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── calculations.ts # CO₂ calculation logic
│   └── utils.ts        # General utilities
├── pages/              # Application pages
│   ├── Dashboard.tsx   # Main dashboard
│   ├── EmissionInput.tsx # Emission logging
│   ├── CarbonSink.tsx  # Carbon sink management
│   ├── Strategy.tsx    # Strategy planning
│   ├── Reports.tsx     # Reports and analytics
│   ├── Login.tsx       # Authentication
│   └── ...            # Other pages
└── App.tsx            # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌍 Environmental Impact

This platform helps coal mines:
- **Track Emissions**: Accurate CO₂ footprint measurement
- **Plan Reductions**: Strategic carbon reduction planning
- **Achieve Compliance**: Meet regulatory requirements
- **Support Net Zero**: Contribute to India's 2070 goal

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real-time Monitoring**: IoT sensor integration
- **AI Recommendations**: Machine learning for optimization
- **Mobile App**: React Native mobile application
- **API Integration**: Backend server with database
- **Advanced Analytics**: Predictive modeling and forecasting
- **GIS Integration**: Geographic information system mapping
- **Advanced CSV Features**: Excel import, data mapping, batch processing

---

**🇮🇳 Supporting India's Net Zero Mission 2070**  
*Empowering Coal Mines for Carbon Neutrality*
