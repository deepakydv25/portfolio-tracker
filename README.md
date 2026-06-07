# Portfolio Tracker 📈

A full-stack application for tracking and visualizing investment portfolios with real-time stock data, historical analysis, and comprehensive dashboard features.

## 🎯 Overview

Portfolio Tracker is a web-based application that helps users monitor their investment portfolios. It provides real-time stock price updates, historical performance analysis, and interactive visualizations to track portfolio performance over time.

**Tech Stack:**
- **Frontend:** TypeScript (66.9%), React, Tailwind CSS, Recharts
- **Backend:** Python (11.2%)
- **Styling:** CSS (18.9%), HTML (2.8%), JavaScript (0.2%)

---

## 📁 Project Structure

```
portfolio-tracker/
├── frontend/                    # React TypeScript frontend application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── services/           # API service calls and data fetching
│   │   ├── App.tsx            # Main application component
│   │   ├── App.css            # Application styles
│   │   ├── index.tsx          # React entry point
│   │   ├── index.css          # Global styles
│   │   ├── output.css         # Tailwind CSS output
│   │   └── ...                # Other utilities and configurations
│   ├── public/                 # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── README.md              # Frontend-specific documentation
│
├── backend/                     # Python backend API server
│   ├── src/
│   │   └── main.py           # Main backend server entry point
│   ├── data/                  # Data storage and processing
│   └── requirements.txt       # Python dependencies
│
├── scripts/                     # Utility scripts for data processing
│   ├── data/                  # Data processing directory
│   ├── data_script.py         # Script for current portfolio data
│   ├── historical_script.py   # Script for historical data processing
│   ├── today_script.py        # Script for today's market data
│   ├── months.txt            # Month references
│   └── symbols.txt           # Stock symbols list

```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn** for package management

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will open at [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend server:
   ```bash
   python src/main.py
   ```

### Data Scripts

The `scripts/` directory contains utility scripts for data processing:

- **data_script.py** - Processes current portfolio data
- **historical_script.py** - Processes historical market data
- **today_script.py** - Fetches and processes today's market data

To run a script:
```bash
python scripts/data_script.py
```

---

## 📦 Available Scripts

### Frontend Scripts

In the `frontend/` directory, you can run:

- **`npm start`** - Runs the app in development mode
- **`npm run build`** - Builds the app for production
- **`npm test`** - Launches the test runner
- **`npm run eject`** - Ejects from Create React App (one-way operation)

### Development

```bash
# Start frontend
cd frontend && npm start

# Start backend (in another terminal)
cd backend && python src/main.py
```

---

## 🛠️ Technology Stack

### Frontend
- **React** 19.1.1 - UI library
- **TypeScript** 4.9.5 - Type-safe JavaScript
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Recharts** 3.1.0 - Chart library for visualizations
- **Axios** 1.11.0 - HTTP client for API calls
- **Lucide React** 0.535.0 - Icon library

### Backend
- **Python** 3.8+ - Server runtime
- Additional dependencies in `backend/requirements.txt`

---

## 📊 Features

- ✅ Real-time stock price tracking
- ✅ Portfolio performance visualization
- ✅ Historical data analysis
- ✅ Interactive dashboard
- ✅ Multiple stock symbols support
- ✅ Data persistence and caching

---

## 🔄 API Integration

The frontend communicates with the backend API for:
- Fetching portfolio data
- Getting real-time stock prices
- Retrieving historical performance data
- Managing portfolio updates

All API calls are handled in `frontend/src/services/`

---

## 📈 Data Management

- **Current Data:** Processed by `data_script.py`
- **Historical Data:** Processed by `historical_script.py`
- **Daily Updates:** Handled by `today_script.py`
- **Data Storage:** Located in `backend/data/` directory

---

## 🎨 Styling

The project uses:
- **Tailwind CSS** for responsive utility-first styling
- **Custom CSS** in individual component files
- **Global styles** in `src/index.css` and `src/output.css`

---

## 📝 Configuration Files

- **tsconfig.json** - TypeScript compiler options
- **tailwind.config.js** - Tailwind CSS customization
- **package.json** - Frontend dependencies and scripts
- **requirements.txt** - Python backend dependencies

---

## 🚢 Deployment

### Frontend Build
```bash
cd frontend
npm run build
```
The production-ready files will be in the `frontend/build/` directory.

### Backend Deployment
Ensure all dependencies are installed:
```bash
pip install -r backend/requirements.txt
python backend/src/main.py
```

---

## 🐛 Testing

Run frontend tests:
```bash
cd frontend
npm test
```

---

## 📄 License

This project is open source and available under your chosen license.

---

## 👤 Author

**deepakydv25** - Portfolio Tracker

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📞 Support

For issues, questions, or suggestions, please open an issue in the GitHub repository.

---

## 🔗 Quick Links

- [Frontend README](./frontend/README.md)
- [Backend Requirements](./backend/requirements.txt)
- [Repository](https://github.com/deepakydv25/portfolio-tracker)

---

**Last Updated:** July 31, 2025
