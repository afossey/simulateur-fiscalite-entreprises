import React, {ChangeEvent, Component} from "react";
import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@material-ui/core";
import {DatePicker} from "material-ui-pickers";
import {AEStore} from "../model/stores";
import {MaterialUiPickersDate} from "material-ui-pickers/typings/date";
import {Moment} from "moment";
import {observer} from "mobx-react";
import {Instance} from "mobx-state-tree";
import {BusinessType} from "../model/enums";

interface CompanyComponentProps {
  aeStore: Instance<typeof AEStore>;
}
@observer
export class CompanyComponent extends Component<CompanyComponentProps> {

  constructor(props: Readonly<CompanyComponentProps>) {
    super(props);
  }

  private updateCreationDate = (date: MaterialUiPickersDate) => {
    const nativeDate = (date as Moment).toDate();
    this.props.aeStore.companyData.setCreationDate(nativeDate);
  };

  private selectBusiness = (event: ChangeEvent<HTMLSelectElement>) => {
    const businessType = event.target.value as BusinessType;
    this.props.aeStore.selectBusiness(businessType);
  };

  private updateACCRE = (event: ChangeEvent<HTMLInputElement>) => {
    const hasACCRE = event.target.checked as boolean;
    this.props.aeStore.setOptionACCRE(hasACCRE);
  };

  private updateVFL = (event: ChangeEvent<HTMLInputElement>) => {
    const hasVFL = event.target.checked as boolean;
    this.props.aeStore.setOptionVFL(hasVFL);
  };

  render() {
    return (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography component={"h6"} variant={"h6"}>
                Entreprise
              </Typography>
              <FormControl fullWidth={true} margin={"normal"}>
                <DatePicker
                    label="Date de création"
                    value={this.props.aeStore.companyData.creationDate}
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
                    value={this.props.aeStore.businessData().type}
                    onChange={this.selectBusiness}
                    inputProps={{
                      name: 'ae-activity',
                      id: 'ae-activity',
                    }}
                >
                  <MenuItem value={BusinessType.BUY_SELL}>Vente de marchandises et fourniture
                    d'hébergement</MenuItem>
                  <MenuItem value={BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM}>Location de
                    logements meublés de tourisme (classés)</MenuItem>
                  <MenuItem value={BusinessType.SERVICES_LIBERAL}>Prestation de services ou
                    professions libérales</MenuItem>
                  <MenuItem value={BusinessType.RENTAL}>Location d'habitation meublée</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth={true}>
                <FormControlLabel control={
                  <Checkbox
                      checked={this.props.aeStore.hasACCRE}
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
                      checked={this.props.aeStore.hasVFL}
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
    );
  }
}