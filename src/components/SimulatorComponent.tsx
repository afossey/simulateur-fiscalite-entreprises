import React, {Component} from "react";
import {CompanyComponent} from "./CompanyComponent";
import {SimulationResultComponent} from "./SimulationResultComponent";
import {Grid} from "@material-ui/core";
import {SimulatorStore} from "../model/Stores";
import {Instance} from "mobx-state-tree";
import {observer} from "mobx-react";
import {SimulationHintComponent} from "./SimulationHintComponent";
import {SimulationWarningComponent} from "./SimulationWarningComponent";

interface AEComponentState {
  simulator: Instance<typeof SimulatorStore>;
}

@observer
export class SimulatorComponent extends Component<{}, AEComponentState> {

  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      simulator: SimulatorStore.create({})
    };
  }

  render() {
    return(
        <Grid container spacing={24} wrap={"wrap"} style={styles.aeView}>
          <Grid item xs={12} md={6}>
            <CompanyComponent company={this.state.simulator.company}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <SimulationHintComponent simulator={this.state.simulator}/>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <SimulationWarningComponent/>
              </Grid>
              <Grid item xs={12}>
                <SimulationResultComponent simulator={this.state.simulator}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    );
  }
}

const styles = {
  aeView: {
    padding: 25
  }
};