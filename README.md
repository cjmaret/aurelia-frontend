# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


## Running the app on desktop (browser)

To run the app in your browser:

1. Start the app:
   ```bash
   npx expo start
   ```

2. In the Expo CLI output, select the option to open the app in the browser by pressing `w`.

3. Ensure your backend server is running locally (e.g., FastAPI on `http://localhost:8000`).

---

## Running the app on Expo Go (physical device)

To run the app on a physical device using Expo Go:

1. Start the app:
   ```bash
   npx expo start
   ```

2. Open the Expo Go app on your device (available on [iOS](https://apps.apple.com/app/expo-go/id982107779) and [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).

3. Scan the QR code displayed in the terminal or Expo CLI output.

4. Ensure your backend server is accessible from your device:
   - Start the backend server with the following command:
     ```bash
     uvicorn app:app --host 0.0.0.0 --port 8000 --reload
     ```
   - Replace `localhost` in your API URL with your machine's local IP address (e.g., `http://192.168.x.x:8000`).
   - can be found via `ifconfig | grep inet`

5. Make sure your device and development machine are connected to the same Wi-Fi network.
6. If the network is public, use `--tunnel` flag when running expo app