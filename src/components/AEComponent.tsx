import React, {Component} from "react";
import {FinanceComponent} from "./FinanceComponent";
import {CompanyComponent} from "./CompanyComponent";
import {ReportComponent} from "./ReportComponent";
import {Grid} from "@material-ui/core";
import {AEStore} from "../model/stores";
import {Instance} from "mobx-state-tree";
import {observer} from "mobx-react";

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
        <Grid container spacing={24} justify={"center"} wrap={"wrap"} style={styles.aeView}>
          <FinanceComponent financialData={this.state.aeStore.financialData}/>
          <CompanyComponent aeStore={this.state.aeStore}/>
          <ReportComponent aeStore={this.state.aeStore}/>
        </Grid>
    );
  }
}

const styles = {
  aeView: {
    padding: 25
  }
};