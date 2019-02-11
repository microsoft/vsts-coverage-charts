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
    selectedItems: Build[];
    isLoading: boolean;
    numBuilds: number;
}

export class BuildSelector extends React.Component<IBuildSelectorProps, IBuildSelectorState> {

    constructor(props: IBuildSelectorProps) {
        super(props);
        this.state = {
            buildDefinitions: [],
            selectedItems: [],
            isLoading: true,
            numBuilds: 5
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
            
            var selectedBuildDefs = this.props.initialSettings && this.props.initialSettings.buildDefs && this.props.initialSettings.buildDefs.map((bd: number, idx: number) => {
                return mappedDefs.filter((val) => val.value.id === bd)[0];
            });
            this.setState({
                buildDefinitions: mappedDefs,
                selectedItems: selectedBuildDefs,
                isLoading: false
            });
        })
    }

    public render() {

        return (
            <Select
                isMulti
                isLoading={this.state.isLoading}
                className="basic-single"
                classNamePrefix="select"
                value={this.state.selectedItems}
                isClearable={true}
                isSearchable={true}
                name="build"
                options={this.state.buildDefinitions}
                onChange={this.onBuildSelectionChanged}
            />
        );
    }

    private onBuildSelectionChanged = (selectedBuilds: Build[]) => {
        console.log("On change called", selectedBuilds);
        this.setState({
            selectedItems: selectedBuilds
        });
        this.props.onSettingsChanged({...this.props.initialSettings, 
            buildDefs: selectedBuilds.map((bd: Build, idx: number) => bd.value.id)});
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
