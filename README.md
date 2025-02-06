React Native Timer App
A fully functional React Native Timer App that allows users to create, manage, and track timers with category grouping, bulk actions, and progress tracking. The app also supports light and dark themes, with the selected theme being saved using AsyncStorage.

Features:
    Create & Manage Timers: Add, start, pause, reset, and delete timers.

    Category-based Timer Grouping: Timers are grouped by category (Workout, Study, Break).

    Bulk Actions: Start, Pause, and Reset all timers within a category.

    Progress Visualization: Displays remaining time and status.

    Timer History: Completed timers are logged in a history screen.

    Theme Toggle (Light/Dark Mode): Theme selection is saved using AsyncStorage.

    Data Persistence: Timers and history are stored using AsyncStorage.

    Export Timer History: Save and share history as a JSON file.


Tech Stack:
    React Native - Framework for building mobile apps.

    React Navigation - Handles screen transitions.

    AsyncStorage - Saves timer and history data persistently.

    React Native Paper - UI components for better styling.

    React Native Vector Icons - For interactive UI elements.

    React Native FS & Share - For exporting timer history as a file.


Installation & Setup:

    git clone 'https://github.com/koushal9800/TimerApp.git'
    npm install
    npx react-native run-android
    