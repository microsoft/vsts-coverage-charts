import * as React from "react";
import Select from "react-select";
import * as TFSContracts from "TFS/Build/Contracts";
import { BuildHttpClient } from "TFS/Build/RestClient";

class Build {
    value: TFSContracts.DefinitionReference;
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
interface IBuildSelectorProps {
    restClient: BuildHttpClient;
}

interface IBuildSelectorState {
    buildDefinitions: Build[];
    selectedItem: Build;
}

export class BuildSelector extends React.Component<IBuildSelectorProps, IBuildSelectorState> {

    constructor(props: IBuildSelectorProps) {
        super(props);
        this.state = {
            buildDefinitions: [],
            selectedItem: undefined
        };
    }

    componentDidMount() {
        var context = VSS.getWebContext();
        this.props.restClient.getDefinitions(context.project.id).then((definitions: TFSContracts.DefinitionReference[]) => {
            const mappedDefs = definitions.map((d: TFSContracts.DefinitionReference, idx: number) => {
                return {
                    value: d,
                    label: `${d.id} - ${d.name}`
                } as Build
            })
            this.setState({
                buildDefinitions: mappedDefs
            });
            console.log("Fetched defs", definitions);
        })
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
                options={this.state.buildDefinitions}
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

export class CoverageChartConfigComponent extends React.Component<{
    restClient: BuildHttpClient
}, {}> {

    public render() {
        return (
            <div className="widget-component">
                <h2 className="title">Coverage Charts Config</h2>
                <p>Coming soon...</p>
                <BuildSelector 
                    restClient={this.props.restClient} 
                    />
                <div style={{ height: "400px" }} />
            </div>
        );
    }
}
