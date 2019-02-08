import * as React from "react";
import Select from "react-select";
import * as TFSContracts from "TFS/Build/Contracts";
import { BuildHttpClient } from "TFS/Build/RestClient";
import { WidgetSettings } from "./WidgetSettings";

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
    initialSettings: WidgetSettings;
    onSettingsChanged: (newSettings: WidgetSettings) => void;
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
            });
            
            this.setState({
                buildDefinitions: mappedDefs,
                selectedItem: mappedDefs.filter((val) => val.value.id === this.props.initialSettings.buildDef)[0]
            });
            console.log("Fetched defs", definitions);
        })
    }

    public render() {

        return (
            <Select
                className="basic-single"
                classNamePrefix="select"
                value={this.state.selectedItem}
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
        this.props.onSettingsChanged({...this.props.initialSettings, buildDef: selectedBuild.value.id})
    }
}

export class CoverageChartConfigComponent extends React.Component<IBuildSelectorProps, {}> {

    public render() {
        return (
            <div className="widget-component">
                <h2 className="title">Coverage Charts Config</h2>
                <p>Coming soon...</p>
                <BuildSelector 
                    restClient={this.props.restClient} 
                    initialSettings={this.props.initialSettings}
                    onSettingsChanged={this.props.onSettingsChanged}
                    />
                <div style={{ height: "400px" }} />
            </div>
        );
    }
}
