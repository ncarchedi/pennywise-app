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

import { withGlobalContext } from "../GlobalContext";

class SpendingScreen extends React.Component {
  static navigationOptions = {
    title: "Spending"
  };

  render() {
    const { transactions } = this.props.global;

    // TODO: make months unique by year (e.g. 2019-01 !== 2018-01)
    today = new Date();
    thisMonth = today.getMonth();
    lastMonth = today.getMonth() - 1;

    const spendingByMonth = _(transactions)
      .map(t => ({
        month: t.date.getMonth(),
        ...t
      }))
      .filter(
        t =>
          [thisMonth, lastMonth].includes(t.month) &&
          t.category !== "No Category"
      )
      .groupBy("month")
      .map((month, monthName) =>
        _(month)
          .groupBy("category")
          .map((category, categoryName) => ({
            category: categoryName,
            amountSpent: _(category).sumBy("amount")
          }))
      )
      .value();

    // TODO: make sure months are ordered correctly
    const actualData = {
      thisMonth: spendingByMonth[1],
      lastMonth: spendingByMonth[0]
    };

    // // demo data - to be deleted once real data is working
    // const demoData = {
    //   thisMonth: [
    //     { category: "Fun", amountSpent: 150 },
    //     { category: "Fitness", amountSpent: 550 },
    //     { category: "Food", amountSpent: 500 },
    //     { category: "Rent", amountSpent: 1200 }
    //   ],
    //   lastMonth: [
    //     { category: "Bars", amountSpent: 350 },
    //     { category: "Fitness", amountSpent: 30.9 },
    //     { category: "Food", amountSpent: 650 },
    //     { category: "Rent", amountSpent: 2000 }
    //   ]
    // };

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
