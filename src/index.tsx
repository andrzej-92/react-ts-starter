import './styles/style.scss';
import * as React from "react";
import * as ReactDOM from "react-dom";
import Hello from "./modules/hello/components/Hello";

ReactDOM.render(
    <Hello title="React / Typescript / Webpack" />,
    document.getElementById("root")
);