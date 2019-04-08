import React, {Component} from "react";
import {FinanceComponent} from "./FinanceComponent";
import {CompanyComponent} from "./CompanyComponent";
import {SimulationComponent} from "./SimulationComponent";
import {Grid} from "@material-ui/core";
import {AEStore} from "../model/Stores";
import {Instance} from "mobx-state-tree";
import {observer} from "mobx-react";
import {AESimulationHintComponent} from "./AESimulationHintComponent";
import {AESimulationWarningComponent} from "./AESimulationWarningComponent";

interface AEComponentState {
  aeStore: Instance<typeof AEStore>;
}

@observer
export class AEComponent extends Component<{}, AEComponentState> {

  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      aeStore: AEStore.create({})
    };
  }

  render() {
    return(
        <Grid container spacing={24} wrap={"wrap"} style={styles.aeView}>
          <Grid item xs={12} md={6}>
            <FinanceComponent financialData={this.state.aeStore.financialData}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <CompanyComponent aeStore={this.state.aeStore}/>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <AESimulationHintComponent aeStore={this.state.aeStore}/>
              </Grid>
              <Grid item xs={12}>
                <AESimulationWarningComponent/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SimulationComponent aeStore={this.state.aeStore}/>
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