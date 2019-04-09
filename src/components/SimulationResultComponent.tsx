import React, {Component} from "react";
import {
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import {Commons} from "../Commons";
import {observer} from "mobx-react";
import {Instance} from "mobx-state-tree";
import {SimulatorStore} from "../model/Stores";

interface SimulationResultComponentProps {
  simulator: Instance<typeof SimulatorStore>;
}

@observer
export class SimulationResultComponent extends Component<SimulationResultComponentProps> {
  
  constructor(props: Readonly<SimulationResultComponentProps>) {
    super(props);
  }

  render() {
    return(
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
                    Recettes HT
                  </TableCell>
                  <TableCell>
                    { Commons.getEuroAmountLabel(this.props.simulator.company.finance.profits) }
                  </TableCell>
                </TableRow>

                <TableRow key={"Taux de charges sociales"}>
                  <TableCell component="th">
                    Taux de charges sociales
                  </TableCell>
                  <TableCell>
                    {Commons.getPercentLabel(this.props.simulator.socialChargesRate())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Bénéfices après charges sociales"}>
                  <TableCell component="th">
                    Bénéfices après charges sociales
                  </TableCell>
                  <TableCell>
                    {Commons.getEuroAmountLabel(this.props.simulator.profitsAfterSocialCharges())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Revenus imposable"}>
                  <TableCell component="th">
                    Revenus imposable
                  </TableCell>
                  <TableCell>
                    {Commons.getEuroAmountLabel(this.props.simulator.taxeableIncome())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Taux moyen d'imposition sur le revenu"}>
                  <TableCell component="th">
                    Taux moyen d'imposition sur le revenu
                  </TableCell>
                  <TableCell>
                    {Commons.getPercentLabel(this.props.simulator.averageIncomeTaxRate())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Bénéfices après charges sociales et impôt sur le revenu"}>
                  <TableCell component="th">
                    Bénéfices après déduction des charges et impôts (net)
                  </TableCell>
                  <TableCell>
                    {Commons.getEuroAmountLabel(this.props.simulator.profitsAfterSocialChargesAndIncomeTax())}
                  </TableCell>
                </TableRow>

                <TableRow key={"Bénéfices net mensuel"}>
                  <TableCell component="th">
                    Bénéfices net / mois
                  </TableCell>
                  <TableCell>
                    {Commons.getEuroAmountLabel(this.props.simulator.profitsAfterSocialChargesAndIncomeTax() / 12)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

          </Card>
    );
  }
}