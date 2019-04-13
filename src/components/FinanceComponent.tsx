import React, {ChangeEvent, Component} from "react";
import {Grid, TextField} from "@material-ui/core";
import {observer} from "mobx-react";
import {Instance} from "mobx-state-tree";
import {FinancialStore} from "../model/Stores";

interface FinanceComponentProps {
  finance: Instance<typeof FinancialStore>;
}
@observer
export class FinanceComponent extends Component<FinanceComponentProps> {

  constructor(props: Readonly<FinanceComponentProps>) {
    super(props);
  }

  private updateAnnualRevenue = (event: ChangeEvent<HTMLInputElement>) => {
    const annualRevenue = parseFloat(event.target.value);
    this.props.finance.setAnnualRevenueWithoutTaxes(
        annualRevenue && annualRevenue > 0 ? annualRevenue : 0);
  };

  private updateCharges = (event: ChangeEvent<HTMLInputElement>) => {
    const charges = parseFloat(event.target.value);
    this.props.finance.setCharges(charges && charges > 0 ? charges : 0);
  };

  render() {
    return (
        <Grid container wrap={"wrap"}>
          <Grid item xs={12} md={6}>
              <TextField
                  id="ae-revenue"
                  label="Chiffre d'affaire annuel € HT"
                  defaultValue={0}
                  placeholder={'0'}
                  onChange={this.updateAnnualRevenue}
                  margin="normal"
                  type="number"
                  fullWidth={true}
              />
          </Grid>
          <Grid item xs={12} md={6}>
              <TextField
                  id="ae-charges"
                  label="Charges annuel € HT"
                  defaultValue={0}
                  placeholder={'0'}
                  onChange={this.updateCharges}
                  margin="normal"
                  type="number"
                  fullWidth={true}
              />
          </Grid>
        </Grid>
    );
  }
}