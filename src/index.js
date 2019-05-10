import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import store from "./fredux/store";
import { Provider } from "react-redux";
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";

import ErrorBoundary from "react-error-boundary";

const myErrorHandler = ({ componentStack, error }) => (
    <div>
        <p>
            <strong> An error occured!</strong>
        </p>
        <p>Info: </p>
        <p>
            <strong>Error:</strong> {error.toString()}
        </p>
        <p>
            <strong>Stacktrace:</strong> {componentStack}
        </p>

        <p>
            {" "}
            <a
                href="https://discord.gg/yUscFXr"
                target="_blank"
                rel="noopener noreferrer"
            >
                Get the developer to fix this
            </a>
        </p>
    </div>
);
const main = (
    <ErrorBoundary onError={myErrorHandler}>
        <Provider store={store}>
            <App />
        </Provider>
    </ErrorBoundary>
);

ReactDOM.render(main, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
