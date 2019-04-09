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
import {CompanyStore} from "../model/Stores";
import {MaterialUiPickersDate} from "material-ui-pickers/typings/date";
import {Moment} from "moment";
import {observer} from "mobx-react";
import {Instance} from "mobx-state-tree";
import {BusinessType, CompanyLegalStatus} from "../model/Enums";
import {FinanceComponent} from "./FinanceComponent";

interface CompanyComponentProps {
  company: Instance<typeof CompanyStore>;
}
@observer
export class CompanyComponent extends Component<CompanyComponentProps> {

  constructor(props: Readonly<CompanyComponentProps>) {
    super(props);
  }

  private updateCreationDate = (date: MaterialUiPickersDate) => {
    const nativeDate = (date as Moment).toDate();
    this.props.company.setCreationDate(nativeDate);
  };

  private selectBusiness = (event: ChangeEvent<HTMLSelectElement>) => {
    const businessType = event.target.value as BusinessType;
    this.props.company.selectBusiness(businessType);
  };

  private updateACCRE = (event: ChangeEvent<HTMLInputElement>) => {
    const hasACCRE = event.target.checked as boolean;
    this.props.company.setOptionACCRE(hasACCRE);
  };

  private updateVFL = (event: ChangeEvent<HTMLInputElement>) => {
    const hasVFL = event.target.checked as boolean;
    this.props.company.setOptionVFL(hasVFL);
  };

  render() {
    return (
          <Card>
            <CardContent>
              <Typography component={"h6"} variant={"h6"}>
                Entreprise
              </Typography>
              <Grid container wrap={"wrap"}>
                <Grid item xs={6}>
                  <FormControl margin={"normal"} fullWidth={true}>
                    <DatePicker
                        label="Date de création"
                        value={this.props.company.creationDate}
                        format={"DD/MM/YYYY"}
                        disableFuture
                        onChange={this.updateCreationDate}
                        animateYearScrolling
                        fullWidth={true}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth={true} margin={"normal"}>
                    <InputLabel htmlFor="company-legal-status">Statut juridique</InputLabel>
                    <Select
                        value={this.props.company.legalStatus}
                        inputProps={{
                          name: 'company-legal-status',
                          id: 'company-legal-status',
                        }}
                    >
                      <MenuItem value={CompanyLegalStatus.AE}>AE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl fullWidth={true} margin={"normal"}>
                <InputLabel htmlFor="company-business">Activité</InputLabel>
                <Select
                    value={this.props.company.business.type}
                    onChange={this.selectBusiness}
                    inputProps={{
                      name: 'company-business',
                      id: 'company-business',
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
              <FinanceComponent finance={this.props.company.finance}/>
              <FormControl fullWidth={true}>
                <FormControlLabel control={
                  <Checkbox
                      checked={this.props.company.hasACCRE}
                      onChange={this.updateACCRE}
                      value="ACCRE"
                      color="primary"
                  />
                }
                                  label={"Exonération de début d'activité (ex-ACCRE)"}>
                </FormControlLabel>
              </FormControl>
              <FormControl fullWidth={true}>
                <FormControlLabel control={
                  <Checkbox
                      checked={this.props.company.hasVFL}
                      onChange={this.updateVFL}
                      value="VFL"
                      color="primary"
                  />
                }
                                  label={"Versement fiscal libératoire (VFL)"}>
                </FormControlLabel>
              </FormControl>
            </CardContent>
          </Card>
    );
  }
}