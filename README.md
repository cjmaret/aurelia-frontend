# 🤖 Aurelia Frontend 🤖

Welcome to the frontend of **Aurelia**, an innovative application designed to help language learners improve their spoken language skills in real time. With Aurelia-AI, users can engage in conversations, receive instant feedback, and get corrections to refine their language abilities.

This project serves as the front-end for the Aurelia-AI backend.

---

## 🌟 Features

- **Real-Time Language Feedback**: Engage in conversations and receive instant corrections to improve your spoken language.
- **User Authentication**: Sign up, log in, and manage your account.
- **Customizable Settings**: Personalize your experience with language preferences and user settings.
- **Secure API Integration**: Communicate with the backend via secure API requests.
- **Testing**: Major components tested with React Testing Library.

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- Backend server running locally (e.g., FastAPI on `http://localhost:8000`).

### Installation

1. Clone the repository:
   ```git clone https://github.com/your-username/aurelia-frontend.git```
   ```cd aurelia-frontend```

2. Install dependencies:
   ```npm install```

3. Start the app:
   ```npx expo start```

---

## 🖥️ Running the App

### For Testers or Viewers (Using Expo Go)

If you just want to **test or view the app** without setting up a local development environment:

1. **Install Expo Go**:
   - Download the Expo Go app on your device:
     - [Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)
     - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Access the App**:
   - Open the Expo Go app and scan the QR code provided by the app owner.
   - Alternatively, use the provided Expo project link (e.g., `https://expo.dev/@username/project-name`).

3. **Ensure Backend Accessibility**:
   - The app connects to the backend running on your DigitalOcean Droplet.
   - Make sure your backend server is running and accessible at your droplet's public IP and port, for example:
     ```
     http://24.144.89.186:8000
     ```
   - If you are running the backend locally for development, update your API URL in the config file accordingly.

---

### For Developers (Running Locally)

If you want to **run the app locally** for development purposes:

1. Start the app:
   ```npx expo start```

2. Open the Expo Go app on your device (available on [iOS](https://apps.apple.com/app/expo-go/id982107779) and [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).

3. Scan the QR code displayed in the terminal or Expo CLI output.

4. Ensure your backend server is accessible from your device:
   - Run the app: 
      ```uvicorn app.app:app --reload```
   - Run the app to allow calls from Expo Go:
      ```uvicorn app.app:app --host 0.0.0.0 --port 8000 --reload```
   - Replace `localhost` in your API URL (in config file) with your machine's local IP address (e.g., ```http://192.168.x.x:8000```).
      - can be found via ```ifconfig | grep inet```
   - If on a public network, use the `--tunnel` flag when running the Expo app:
     ```npx expo start --tunnel```

5. Make sure your device and development machine are connected to the same Wi-Fi network.

---

## 🛠️ Project Technologies

- **React**: Component-based UI library for building the user interface.
- **React Native**: Framework for building mobile applications.
- **Expo**: Framework for developing React Native apps with ease.
- **SecureStore**: Secure storage for sensitive data like tokens.
- **JWT (JSON Web Tokens)**: Used for authentication and token management.
- **Fetch API**: For making HTTP requests to the backend.
- **FastAPI**: Backend server for handling API requests.
- **React Testing Library**: For testing React components.

---

## 🔗 Links

- [➡️ Frontend GitHub Repository](https://github.com/cjmaret/aurelia-frontend)
- [➡️ Backend GitHub Repository](https://github.com/cjmaret/aurelia-backend)

---

## ✨ Demo

**TBA**

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.