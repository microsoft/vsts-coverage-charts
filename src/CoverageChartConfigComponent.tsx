import * as React from "react";
import Select from "react-select";
import * as TFSContracts from "TFS/Build/Contracts";
import { BuildHttpClient } from "TFS/Build/RestClient";
import { WidgetSettings } from "./WidgetSettings";
import "./CoverageChartConfig.css";
import * as NumericInput from "react-numeric-input";

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
    yaxisDomain: number;
    showLineCoverage: boolean;
}

export class BuildSelector extends React.Component<IBuildSelectorProps, IBuildSelectorState> {

    constructor(props: IBuildSelectorProps) {
        super(props);
        this.state = {
            buildDefinitions: [],
            selectedItems: [],
            isLoading: true,
            numBuilds: props.initialSettings && props.initialSettings.numBuilds || 5,
            yaxisDomain: props.initialSettings && props.initialSettings.yaxisRange,
            showLineCoverage: props.initialSettings && props.initialSettings.showLineCoverage
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
            <div>
                <h4 className="config-select-title">Build definitions</h4>
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
                <h4 className="config-text-title">Number of builds to show</h4>
                <NumericInput
                    min={1}
                    max={50}
                    value={this.state.numBuilds}
                    onChange={(val: number) => { this.onNumBuildsChanged(val) }}
                    className="config-numeric-input"
                />
                <h4 className="config-text-title">Y-axis domain padding</h4>
                <NumericInput
                    min={0}
                    max={50}
                    value={this.state.yaxisDomain}
                    onChange={(val: number) => { this.onYaxisDomainChanged(val) }}
                    className="config-numeric-input"
                />
                <div className="config-text-title config-checkbox" onClick={this.onShowLineCoverageChanged}>
                    <input type="checkbox" checked={this.state.showLineCoverage} onChange={this.onShowLineCoverageChanged} style={{ verticalAlign: "text-top", marginLeft: "0px" }} />
                    <span style={{ fontStyle: "normal" }}>Show line coverage</span>
                </div>
            </div>
        );
    }

    private onBuildSelectionChanged = (selectedBuilds: Build[]) => {
        this.setState({
            selectedItems: selectedBuilds
        });
        this.props.onSettingsChanged({
            size: this.props.initialSettings && this.props.initialSettings.size,
            buildDefs: selectedBuilds.map((bd: Build, idx: number) => bd.value.id),
            numBuilds: this.state.numBuilds,
            showLineCoverage: this.state.showLineCoverage,
            yaxisRange: this.state.yaxisDomain
        });
    }

    private onNumBuildsChanged = (numBuilds: number) => {
        this.setState({
            numBuilds: numBuilds
        });
        this.props.onSettingsChanged({
            size: this.props.initialSettings && this.props.initialSettings.size,
            buildDefs: this.state.selectedItems.map((bd: Build, idx: number) => bd.value.id),
            numBuilds: numBuilds,
            showLineCoverage: this.state.showLineCoverage,
            yaxisRange: this.state.yaxisDomain
        });
    }

    private onYaxisDomainChanged = (yaxisDomain: number) => {
        this.setState({
            yaxisDomain: yaxisDomain
        });
        this.props.onSettingsChanged({
            size: this.props.initialSettings && this.props.initialSettings.size,
            buildDefs: this.state.selectedItems.map((bd: Build, idx: number) => bd.value.id),
            numBuilds: this.state.numBuilds,
            showLineCoverage: this.state.showLineCoverage,
            yaxisRange: yaxisDomain
        });
    }

    private onShowLineCoverageChanged = () => {
        const newVal = !this.state.showLineCoverage;
        this.setState({
            showLineCoverage: newVal
        });
        this.props.onSettingsChanged({
            size: this.props.initialSettings && this.props.initialSettings.size,
            buildDefs: this.state.selectedItems.map((bd: Build, idx: number) => bd.value.id),
            numBuilds: this.state.numBuilds,
            showLineCoverage: newVal,
            yaxisRange: this.state.yaxisDomain
        });
    }
}

export class CoverageChartConfigComponent extends React.Component<IBuildSelectorProps, {}> {

    public render() {
        return (
            <div className="widget-component">
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
