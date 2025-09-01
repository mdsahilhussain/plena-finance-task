# Plena Finance Task

A cryptocurrency portfolio tracking application.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/mdsahilhussain/plena-finance-task)](https://github.com/mdsahilhussain/plena-finance-task/stargazers)
[![Open Issues](https://img.shields.io/github/issues/mdsahilhussain/plena-finance-task)](https://github.com/mdsahilhussain/plena-finance-task/issues)

## Why This Project?

This project aims to provide a user-friendly interface for tracking and managing a cryptocurrency portfolio. It allows users to monitor their holdings, view coin statistics, and stay updated with the latest market trends.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Usage](#-usage)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [🧪 Testing](#-testing)
- [📄 License](#-license)
- [💬 Feedback](#-feedback)
- [🌟 Show Your Support](#-show-your-support)

## ✨ Features

-   **Cryptocurrency Tracking:** Monitor the value of your cryptocurrency holdings in real-time.
-   **Watchlist:** Add coins to a watchlist for easy tracking.
-   **Coin Statistics:** View detailed information about individual cryptocurrencies, including price charts and market data.
-   **Portfolio Management:** Add and remove coins from your portfolio.
-   **Local Storage Persistence:** Portfolio and watchlist data are saved locally using `localStorage`.
-   **Web3 Integration:** Connect your wallet using RainbowKit and Wagmi.

## 🛠️ Tech Stack

| Frontend      | Backend | Tools           | APIs                                  |
| :------------ | :------ | :-------------- | :------------------------------------ |
| React         | N/A     | Vite            | (External Crypto APIs - not specified) |
| RainbowKit    | Redux   | TypeScript      |                                       |
| Wagmi         |         | Tailwind CSS    |                                       |
| React-Query   |         | ESLint, Prettier|                                       |
| Chart.js      |         |                 |                                       |

## 📦 Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/mdsahilhussain/plena-finance-task.git
    cd plena-finance-task
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

## ⚙️ Environment Variables

The project requires the following environment variables:

-   `VITE_SOME_KEY`: Some Value (Example)

## 🚀 Usage

1.  Start the development server:

    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the port Vite assigns).

## 📁 Project Structure

```
plena-finance-task/
├── src/
│   ├── components/
│   ├── store/
│   │   ├── index.ts
│   │   ├── features/
│   │       ├── portfolio/
│   │       │   ├── portfolio.reducer.ts
│   │       ├── coin/
│   │       │   ├── coin.reducer.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── public/
├── .eslintrc.cjs
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## 🧪 Testing

(Add information about testing, if applicable.  If no specific testing framework is set up, you can leave a placeholder like this.)

Testing is not yet implemented in this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Feedback

If you have any questions, suggestions, or issues, please feel free to open an issue on the GitHub repository.

## 🌟 Show Your Support

Give a ⭐️ to this project if you like it!