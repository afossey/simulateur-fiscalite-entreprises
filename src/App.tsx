import React, {ChangeEvent, Component} from 'react';
import './App.css';
import {
  AppBar,
  Card,
  CardContent,
  Checkbox,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import {AEBusiness, AEConfig, AEStore, BusinessNature, BusinessType} from "./model";
import {observer} from "mobx-react";
import {DatePicker, MuiPickersUtilsProvider} from "material-ui-pickers";
import {MaterialUiPickersDate} from "material-ui-pickers/typings/date";
import MomentUtils from '@date-io/moment';
import moment, {Moment} from "moment";
import "moment/locale/fr";

moment.locale('fr');

@observer
class App extends Component<{}, { aeStore: any }> {
  constructor(props: any) {
    super(props);

    const AE2019Parameters = {
      effectiveYear: '2019',
      businesses: [
        AEBusiness.create({
          type: BusinessType.BUY_SELL,
          nature: BusinessNature.BIC}),
        AEBusiness.create({
          type: BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM,
          nature: BusinessNature.BIC}),
        AEBusiness.create({
          type: BusinessType.SERVICES_LIBERAL,
          nature: BusinessNature.BNC}),
        AEBusiness.create({
          type: BusinessType.RENTAL,
          nature: BusinessNature.BIC})
      ]
    };
    this.state = {
      aeStore: AEStore.create({
        businessType: BusinessType.SERVICES_LIBERAL,
        config: AEConfig.create(AE2019Parameters)
      })
    };
  }

  private updateAnnualRevenue = (event: ChangeEvent<HTMLInputElement>) => {
    const annualRevenue = parseFloat(event.target.value);
    this.state.aeStore.financialData.setAnnualRevenueWithoutTaxes(
        annualRevenue && annualRevenue > 0 ? annualRevenue : 0);
  };

  private updateCharges = (event: ChangeEvent<HTMLInputElement>) => {
    const charges = parseFloat(event.target.value);
    this.state.aeStore.financialData.setCharges(charges && charges > 0 ? charges : 0);
  };

  private updateCreationDate = (date: MaterialUiPickersDate) => {
    const nativeDate = (date as Moment).toDate();
    this.state.aeStore.companyData.setCreationDate(nativeDate);
  };

  private selectBusiness = (event: ChangeEvent<HTMLSelectElement>) => {
    const businessType = event.target.value as BusinessType;
    this.state.aeStore.selectBusiness(businessType);
  };

  private updateACCRE = (event: ChangeEvent<HTMLInputElement>) => {
    const hasACCRE = event.target.checked as boolean;
    this.state.aeStore.setOptionACCRE(hasACCRE);
  };

  private updateVFL = (event: ChangeEvent<HTMLInputElement>) => {
    const hasVFL = event.target.checked as boolean;
    this.state.aeStore.setOptionVFL(hasVFL);
  };

  private getPercentLabel = (value: number) => ( Math.round(value * 1000) / 10) + '%';
  private getEuroAmountLabel = (value: number) => ( Math.round(value * 100) / 100) + ' €';

  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale={"fr"}>
        <CssBaseline />
        <div>
          <AppBar position="static" style={styles.appBar}>
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Simulateur Fiscalité Auto-Entreprise 2019
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid container spacing={24} justify={"center"} wrap={"wrap"} style={styles.aeView}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography component={"h6"} variant={"h6"}>
                    Revenus
                  </Typography>
                  <TextField
                      id="ae-revenue"
                      label="Chiffre d'affaire annuel € HT"
                      defaultValue={0}
                      onChange={this.updateAnnualRevenue}
                      margin="normal"
                      type="number"
                      fullWidth={true}
                  />
                  <TextField
                      id="ae-charges"
                      label="Charges annuel € HT"
                      defaultValue={0}
                      onChange={this.updateCharges}
                      margin="normal"
                      type="number"
                      fullWidth={true}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography component={"h6"} variant={"h6"}>
                    Entreprise
                  </Typography>
                  <FormControl fullWidth={true} margin={"normal"}>
                    <DatePicker
                        label="Date de création"
                        value={this.state.aeStore.companyData.creationDate}
                        format={"DD/MM/YYYY"}
                        disableFuture
                        onChange={this.updateCreationDate}
                        animateYearScrolling
                        fullWidth={true}
                    />
                  </FormControl>
                  <FormControl fullWidth={true} margin={"normal"}>
                    <InputLabel htmlFor="ae-activity">Activité</InputLabel>
                    <Select
                        value={this.state.aeStore.businessData().type}
                        onChange={this.selectBusiness}
                        inputProps={{
                          name: 'ae-activity',
                          id: 'ae-activity',
                        }}
                    >
                      <MenuItem value={BusinessType.BUY_SELL}>Vente de marchandises et fourniture d'hébergement</MenuItem>
                      <MenuItem value={BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM}>Location de logements meublés de tourisme (classés)</MenuItem>
                      <MenuItem value={BusinessType.SERVICES_LIBERAL}>Prestation de services ou professions libérales</MenuItem>
                      <MenuItem value={BusinessType.RENTAL}>Location d'habitation meublée</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth={true}>
                    <FormControlLabel control={
                      <Checkbox
                          checked={this.state.aeStore.hasACCRE}
                          onChange={this.updateACCRE}
                          value="ACCRE"
                          color="primary"
                      />
                    }
                    label={"Exonération de début d'activité"}>
                    </FormControlLabel>
                  </FormControl>
                  <FormControl fullWidth={true}>
                    <FormControlLabel control={
                      <Checkbox
                          checked={this.state.aeStore.hasVFL}
                          onChange={this.updateVFL}
                          value="VFL"
                          color="primary"
                      />
                    }
                    label={"Versement fiscal libératoire"}>
                    </FormControlLabel>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography component={"h6"} variant={"h6"}>
                    Simulation
                  </Typography>
                </CardContent>
                <Divider/>
                  <Table>
                    <TableBody>

                      <TableRow key={"Profits"}>
                        <TableCell component="th">
                          Profits
                        </TableCell>
                        <TableCell>
                          { this.getEuroAmountLabel(this.state.aeStore.financialData.profits) }
                        </TableCell>
                      </TableRow>

                      <TableRow key={"Taux de charges sociales"}>
                        <TableCell component="th">
                          Taux de charges sociales
                        </TableCell>
                        <TableCell>
                          {this.getPercentLabel(this.state.aeStore.socialChargesRate())}
                        </TableCell>
                      </TableRow>

                      <TableRow key={"Profits après charges sociales"}>
                        <TableCell component="th">
                          Profits après charges sociales
                        </TableCell>
                        <TableCell>
                          {this.getEuroAmountLabel(this.state.aeStore.profitsAfterSocialCharges())}
                        </TableCell>
                      </TableRow>

                      <TableRow key={"Revenus imposable"}>
                        <TableCell component="th">
                          Revenus imposable
                        </TableCell>
                        <TableCell>
                          {this.getEuroAmountLabel(this.state.aeStore.taxeableIncome())}
                        </TableCell>
                      </TableRow>

                      <TableRow key={"Taux moyen d'imposition sur le revenu"}>
                        <TableCell component="th">
                          Taux moyen d'imposition sur le revenu
                        </TableCell>
                        <TableCell>
                          {this.getPercentLabel(this.state.aeStore.averageIncomeTaxRate())}
                        </TableCell>
                      </TableRow>

                      <TableRow key={"Profits après charges sociales et impôt sur le revenu"}>
                        <TableCell component="th">
                          Profits après charges sociales et impôt sur le revenu
                        </TableCell>
                        <TableCell>
                          {this.getEuroAmountLabel(this.state.aeStore.profitsAfterSocialChargesAndIncomeTax())}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

              </Card>
            </Grid>
          </Grid>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

const styles = {
  aeView: {
    padding: 25
  },
  appBar: {
    backgroundColor: '#2196f3'
  }
};
export default App;
