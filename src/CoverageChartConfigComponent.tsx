import * as React from "react";
import Select from "react-select";

class Build {
    value: string;
    label: string;
}

const builds = [
    { value: "A", label: "Option a" },
    { value: "B", label: "Option b" },
    { value: "C", label: "Option c" },
    { value: "D", label: "Option d" },
    { value: "E", label: "Option e" },
    { value: "F", label: "Option f" },
    { value: "G", label: "Option g" }
];

export class DropdownBasicExample extends React.Component<
    {},
    {
        selectedItem: Build;
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
            <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={this.state.selectedItem}
                isClearable={true}
                isSearchable={true}
                name="build"
                options={builds}
                onChange={this.onBuildSelectionChanged}
            />
        );
    }

    private onBuildSelectionChanged = (selectedBuild: Build) => {
        this.setState({
            selectedItem: selectedBuild
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
            </div>
        );
    }
}
