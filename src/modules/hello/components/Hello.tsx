import * as React from "react";
let styles = require('./hello.scss');

interface HelloProps {
    title: string;
}

class Hello extends React.Component<HelloProps, {}> {


    render() {

        const { title } = this.props;

        return <div>
            <h1 className={styles.hello}>
                {title}
            </h1>
        </div>;
    }
}

export default Hello;