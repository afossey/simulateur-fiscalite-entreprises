import React, {Component} from 'react';
import {
  AppBar,
  createMuiTheme,
  CssBaseline,
  Grid,
  MuiThemeProvider,
  Theme,
  Toolbar,
  Typography
} from "@material-ui/core";
import {AEStore} from "./model";
import {observer} from "mobx-react";
import {MuiPickersUtilsProvider} from "material-ui-pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import "moment/locale/fr";
import {FinanceComponent} from "./FinanceComponent";
import {CompanyComponent} from "./CompanyComponent";
import {ReportComponent} from "./ReportComponent";
import {blue} from "@material-ui/core/colors";

@observer
class App extends Component<{}, { aeStore: any, theme: Theme }> {
  constructor(props: any) {
    super(props);

    moment.locale('fr');

    const theme = createMuiTheme({
      palette: {
        primary: blue
      }
    });

    this.state = {
      aeStore: AEStore.create({}),
      theme: theme
    };
  }

  render() {
    return (
        <MuiThemeProvider theme={this.state.theme}>
          <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale={"fr"}>
            <CssBaseline />
            <div>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" color={"inherit"}>
                    Simulateur AE - 2019
                  </Typography>
                </Toolbar>
              </AppBar>
              <Grid container spacing={24} justify={"center"} wrap={"wrap"} style={styles.aeView}>
                <FinanceComponent financialData={this.state.aeStore.financialData}/>
                <CompanyComponent aeStore={this.state.aeStore}/>
                <ReportComponent aeStore={this.state.aeStore}/>
              </Grid>
            </div>
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
    );
  }
}

const styles = {
  aeView: {
    padding: 25
  }
};
export default App;
