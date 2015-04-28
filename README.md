# Chemical-Physics Web
### Requirements

- [Node.js] (https://nodejs.org/download/)
- [npm] (https://github.com/npm/npm)

### Building

First install the require packages:

    cd <repo directory>
    npm install

Now run the build:

    cd <repo directory>
    npm run build

### Running dev server
    
    cd <repo directory>
    npm start

Point your browser to http://localhost:8000

The dev server will watch resources and rebuild as necessary.
#### Setting dev server port

    npm config set chemphyweb:dev_server:port <port>
