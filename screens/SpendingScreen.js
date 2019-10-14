import React from "react";
import { StyleSheet, View } from "react-native";
import _ from "lodash";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryLegend,
  VictoryGroup
} from "victory-native";

import moment from "moment";

import { withGlobalContext } from "../GlobalContext";

class SpendingScreen extends React.Component {
  static navigationOptions = {
    title: "Spending"
  };

  monthIdentifier(date) {
    return moment(date).format("YYYY-MM");
  }

  render() {
    const transactions = this.props.global.listTransactions();

    // const firstDayPreviousMonth = moment()
    //   .subtract(1, "months")
    //   .startOf("month");

    // const lastDayThisMonth = moment().endOf("month");

    const spendingByMonth = _(transactions)
      .map(t => ({
        monthIdentifier: this.monthIdentifier(t.date),
        ...t
      }))
      // Filter out transactions without category
      .filter(t => {
        return t.category !== "No Category";
      })
      // // Filter out transactions that are not in the past 2 months
      // .filter(t => {
      //   const momentDate = moment(t.date);

      //   return (
      //     firstDayPreviousMonth.isSameOrBefore(momentDate) &&
      //     lastDayThisMonth.isSameOrAfter(momentDate)
      //   );
      // })
      .groupBy("monthIdentifier")
      .map((month, monthIdentifier) => {
        return {
          monthIdentifier,
          categories: _(month)
            .groupBy("category")
            .map((category, categoryName) => ({
              category: categoryName,
              amountSpent: _(category).sumBy("amount")
            }))
        };
      });

    const spendingThisMonth = spendingByMonth
      .filter(item => {
        return item.monthIdentifier === this.monthIdentifier(new Date());
      })
      .value();

    const spendingLastMonth = spendingByMonth
      .filter(item => {
        return (
          item.monthIdentifier ===
          this.monthIdentifier(moment().subtract(1, "months"))
        );
      })
      .value();

    const spendingPerCategoryThisMonth =
      spendingThisMonth[0] && spendingThisMonth[0].categories
        ? spendingThisMonth[0].categories
        : [];
    const spendingPerCategoryLastMonth =
      spendingLastMonth[0] && spendingLastMonth[0].categories
        ? spendingLastMonth[0].categories
        : [];

    // TODO: make sure months are ordered correctly
    const actualData = {
      thisMonth: spendingPerCategoryThisMonth,
      lastMonth: spendingPerCategoryLastMonth
    };

    const plotData = JSON.parse(JSON.stringify(actualData));

    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            // TODO: make sure long category names don't get cutoff
            // https://formidable.com/open-source/victory/docs/faq/#my-axis-labels-are-cut-off-how-can-i-fix-them
            padding={{ top: 50, bottom: 30, left: 100, right: 20 }}
          >
            <VictoryLegend
              x={100}
              y={15}
              orientation="horizontal"
              data={[
                { name: "This Month", symbol: { fill: "tomato" } },
                { name: "Last Month", symbol: { fill: "brown" } }
              ]}
            />
            <VictoryGroup
              horizontal
              offset={20}
              style={{
                data: { width: 15 }
              }}
              colorScale={["brown", "tomato"]}
            >
              <VictoryBar
                data={plotData.lastMonth}
                x="category"
                y="amountSpent"
              />

              <VictoryBar
                data={plotData.thisMonth}
                x="category"
                y="amountSpent"
              />
            </VictoryGroup>
          </VictoryChart>
        </View>
      </View>
    );
  }
}

export default withGlobalContext(SpendingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center"
  }
});
