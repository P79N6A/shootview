import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from '../containers/app';

class Application {

    render(App: JSX.Element) {
        ReactDOM.render(
            App,
            document.querySelector('#root')
        );
    }
}

const app = new Application();

app.render(<App />);