# Node.js Forex Application

This is demo forex application

### Prerequisites

You would need the following tools installed before running the project locally:

- Node 20
- VSCode (or any preferred IDE)

### Running the project

1. Clone the repository:
   
   ```
   git clone https://github.com/ignatIgnatov/nodejs-forex.git
   ```
2. Navigate to the project directory:

   ```
   cd (path to your project's folder)
   ```

3. Create .env file in the root folder and use the following data:
   
   ```
   API_ACCESS_KEY="da37fb4189fe77cef7da08b5"
   PORT=8081
   ```
4. Install the dependencies:
   
   ```
   npm install
   ```
5. Start the server:

   ```
   node index.js
   ```
6. Access the application:

   - Go to http://localhost:8081/rates to see the fetched exchange rates.
   - Go to http://localhost:8081/convert?from=USD&to=BGN&amount=10 to convert ten dollars to bulgarian lev. Try with other currencies and values.
7. To start the tests run the following:
   
   ```
   npm test
   ```
