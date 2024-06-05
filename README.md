# Admin Panel with Firebase

This project is a React-based admin panel that allows users to manage their profile picture, nickname, and a list of links. The data is stored in Firebase Realtime Database and Firebase Storage.

## Features

- **Profile Picture Upload**: Users can upload a profile picture which is stored in Firebase Storage.
- **Nickname Management**: Users can update their nickname.
- **Links Management**: Users can add, update, and delete links. Each link has a name, URL, and an icon. The order of the links can also be changed.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Firebase**: A platform developed by Google for creating mobile and web applications.
  - **Firebase Realtime Database**: To store user data.
  - **Firebase Storage**: To store user profile pictures.
- **React Icons**: A library of popular icons for React.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/admin-panel.git
    cd admin-panel
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up Firebase:
    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - Add a web app to your Firebase project and copy the Firebase configuration.
    - Create a file named `firebaseConf.jsx` in the `src` directory and add the following code with your Firebase configuration:
      ```javascript
      import { initializeApp } from "firebase/app";
      import { getDatabase, ref, set, onValue, push, remove, update } from "firebase/database";
      import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
      import { getAuth } from "firebase/auth";

      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };

      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);
      const storage = getStorage(app);
      const auth = getAuth(app);

      export { db, storage, ref, set, onValue, push, remove, update, storageRef, uploadBytes, getDownloadURL, deleteObject, listAll, auth };
      ```

4. Start the development server:
    ```bash
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Profile Picture**: To upload a new profile picture, click on the file input, select an image, and click the "Upload Profile Picture" button.
- **Nickname**: To update your nickname, type the new nickname in the input field and click the "Update Nickname" button.
- **Links**: To add a new link, fill in the link name, URL, and select an icon, then click the "Add Link" button.
  - To update a link's name or URL, edit the text in the input fields directly.
  - To change a link's icon, use the dropdown menu next to the link.
  - To reorder links, use the "Up" and "Down" buttons.
  - To remove a link, click the "Remove" button.

## Screenshots

Here are some screenshots of the application:

### Profile Section
![Profile Section](screenshots/profile-section.png)

### Links Section
![Links Section](screenshots/links-section.png)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
