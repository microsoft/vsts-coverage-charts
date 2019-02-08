import * as React from "react";
import { ChangeEvent } from "react";

class Build {
    key: string;
    text: string;
}

const builds = [
    { key: "A", text: "Option a" },
    { key: "B", text: "Option b" },
    { key: "C", text: "Option c" },
    { key: "D", text: "Option d" },
    { key: "E", text: "Option e" },
    { key: "F", text: "Option f" },
    { key: "G", text: "Option g" }
];

export class DropdownBasicExample extends React.Component<
    {},
    {
        selectedItem?: string;
    }
    > {

    constructor(props: {}) {
        super(props);
        this.state = {
            selectedItem: undefined
        };
    }
    public render() {
        const { selectedItem } = this.state;

        return (
            <div>
                <form action="/action_page.php">
                    <input list="builds" name="build" />
                    <datalist id="builds" onChange={this.onBuildSelectionChanged}>
                        {builds.map((b: Build, idx: number) => {
                            return <option value={b.key}>{b.text}</option>;
                        })}
                    </datalist>
                </form>
            </div>
        );
    }

    private onBuildSelectionChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            selectedItem: event.target.value
        });
    }
}

export class CoverageChartConfigComponent extends React.Component {

    public render() {
        return (
            <div className="widget-component">
                <h2 className="title">Coverage Charts Config</h2>
                <p>Coming soon...</p>
                <DropdownBasicExample />
                <div style={{ height: "400px" }} />
            </div>
        );
    }
}
