import React, {ChangeEvent, Component} from 'react';
import './App.css';
import {
  AppBar,
  Card,
  CardContent,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import {AEBusiness, AEConfig, AEStore, BusinessType} from "./model";
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

    const defaultBusiness = AEBusiness.create({
      type: BusinessType.SERVICES_LIBERAL,
      nature: 'BNC'});

    const AE2019Parameters = {
      effectiveYear: '2019',
      businesses: [
        AEBusiness.create({
          type: BusinessType.BUY_SELL,
          nature: 'BIC'}),
        AEBusiness.create({
          type: BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM,
          nature: 'BIC'}),
        AEBusiness.create({
          type: BusinessType.SERVICES_LIBERAL,
          nature: 'BNC'}),
        AEBusiness.create({
          type: BusinessType.RENTAL,
          nature: 'BIC'})
      ]
    };
    this.state = {
      aeStore: AEStore.create({
        businessData: defaultBusiness,
        config: AEConfig.create(AE2019Parameters)
      })
    };
  }

  public updateAnnualRevenue = (event: ChangeEvent<HTMLInputElement>) => {
      const annualRevenue = parseFloat(event.target.value);
      this.state.aeStore.financialData.setAnnualRevenueWithoutTaxes(annualRevenue);
  };

  public updateCharges = (event: ChangeEvent<HTMLInputElement>) => {
    const charges = parseFloat(event.target.value);
    this.state.aeStore.financialData.setCharges(charges);
  };

  public updateCreationDate = (date: MaterialUiPickersDate) => {
    const nativeDate = (date as Moment).toDate();
    this.state.aeStore.companyData.setCreationDate(nativeDate);
  };

  public selectBusiness = (event: ChangeEvent<HTMLSelectElement>) => {
    const businessType = event.target.value as BusinessType;
    this.state.aeStore.selectBusiness(businessType);
  };

  public updateACCRE = (event: ChangeEvent<HTMLInputElement>) => {
    const hasACCRE = event.target.checked as boolean;
    this.state.aeStore.setOptionACCRE(hasACCRE);
  };

  public updateVFL = (event: ChangeEvent<HTMLInputElement>) => {
    const hasVFL = event.target.checked as boolean;
    this.state.aeStore.setOptionVFL(hasVFL);
  };

  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale={"fr"}>
        <CssBaseline />
        <div>
          <AppBar position="static">
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
                      value={this.state.aeStore.financialData.annualRevenueWithoutTaxes}
                      onChange={this.updateAnnualRevenue}
                      margin="normal"
                      type="number"
                      fullWidth={true}
                  />
                  <TextField
                      id="ae-charges"
                      label="Charges annuel € HT"
                      value={this.state.aeStore.financialData.charges}
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
                        label="Date de création de l'entreprise"
                        value={this.state.aeStore.companyData.creationDate}
                        disableFuture
                        onChange={this.updateCreationDate}
                        animateYearScrolling
                        fullWidth={true}
                    />
                  </FormControl>
                  <FormControl fullWidth={true} margin={"normal"}>
                    <InputLabel htmlFor="ae-activity">Activité</InputLabel>
                    <Select
                        value={this.state.aeStore.businessData.type}
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
  aeSection: {
    padding: 15
  }
};
export default App;
