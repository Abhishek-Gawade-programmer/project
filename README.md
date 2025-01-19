# Project Overview

This project is a Vite + React + TypeScript application designed for blog translation and management. It leverages OpenAI's GPT-3.5 model for translating blog content into multiple Indian languages. The project also includes features for managing blogs, tracking analytics, and more.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Abhishek-Gawade-programmer/project.git
   cd project
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```sh
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

## Usage

To run the project and use its features:

1. **Start the development server:**
   ```sh
   npm run dev
   ```

2. **Open the application:**
   Open your browser and navigate to `http://localhost:3000`.

3. **Explore the features:**
   - **Home:** Translate English text to multiple Indian languages.
   - **Explore:** Browse and search for blogs.
   - **Create Blog:** Create a new blog and translate it into multiple languages.
   - **My Blogs:** View and manage your translated blogs.
   - **Manage Blogs:** Edit or delete existing blogs.

## Features

- **Multi-language Translation:** Translate blog content into multiple Indian languages using OpenAI's GPT-3.5 model.
- **Blog Management:** Create, edit, and delete blogs.
- **Analytics:** Track views, session duration, and language distribution for each blog.
- **Audio Transcription:** Upload audio files for transcription and translation.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
