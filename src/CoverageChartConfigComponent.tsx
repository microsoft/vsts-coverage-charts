import * as React from "react";
import Select from "react-select";
import * as TFSContracts from "TFS/Build/Contracts";
import { BuildHttpClient } from "TFS/Build/RestClient";
import { WidgetSettings } from "./WidgetSettings";
import "./CoverageChartConfig.css";

class Build {
    value: TFSContracts.DefinitionReference;
    label: string;
}

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
            
            var selectedBuildDef = this.props.initialSettings && mappedDefs.filter((val) => val.value.id === this.props.initialSettings.buildDef)[0];
            this.setState({
                buildDefinitions: mappedDefs,
                selectedItem: selectedBuildDef
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
                <h2 className="coverage-chart-config-title">Coverage Charts Config</h2>
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
