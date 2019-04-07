import React, {Component} from "react";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import {Commons} from "../Commons";
import {observer} from "mobx-react";
import {Instance} from "mobx-state-tree";
import {AEStore} from "../model/stores";

interface ReportComponentProps {
  aeStore: Instance<typeof AEStore>;
}

@observer
export class ReportComponent extends Component<ReportComponentProps> {
  
  constructor(props: Readonly<ReportComponentProps>) {
    super(props);
  }

  render() {
    return(
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

                <TableRow key={"Recettes"}>
                  <TableCell component="th">
                    Recettes
                  </TableCell>
                  <TableCell>
                    { Commons.getEuroAmountLabel(this.props.aeStore.financialData.profits) }
                  </TableCell>
                </TableRow>

                <TableRow key={"Taux de charges sociales"}>
                  <TableCell component="th">
                    Taux de charges sociales
                  </TableCell>
                  <TableCell>
                    {Commons.getPercentLabel(this.props.aeStore.socialChargesRate())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Bénéfices après charges sociales"}>
                  <TableCell component="th">
                    Bénéfices après charges sociales
                  </TableCell>
                  <TableCell>
                    {Commons.getEuroAmountLabel(this.props.aeStore.profitsAfterSocialCharges())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Revenus imposable"}>
                  <TableCell component="th">
                    Revenus imposable
                  </TableCell>
                  <TableCell>
                    {Commons.getEuroAmountLabel(this.props.aeStore.taxeableIncome())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Taux moyen d'imposition sur le revenu"}>
                  <TableCell component="th">
                    Taux moyen d'imposition sur le revenu
                  </TableCell>
                  <TableCell>
                    {Commons.getPercentLabel(this.props.aeStore.averageIncomeTaxRate())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Bénéfices après charges sociales et impôt sur le revenu"}>
                  <TableCell component="th">
                    Bénéfices après charges sociales et impôt sur le revenu
                  </TableCell>
                  <TableCell>
                    {Commons.getEuroAmountLabel(this.props.aeStore.profitsAfterSocialChargesAndIncomeTax())}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

          </Card>
        </Grid>
    );
  }
}