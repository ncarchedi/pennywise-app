import React from "react";
import { StyleSheet, View } from "react-native";
import _ from "lodash";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryLegend,
  VictoryGroup,
  VictoryAxis,
  VictoryLabel
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

    const spendingByMonth = _(transactions)
      .map(t => ({
        monthIdentifier: this.monthIdentifier(t.date),
        ...t
      }))
      // Filter out transactions without category
      .filter(t => {
        return t.category !== "No Category";
      })
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
            .value()
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

    // get the proper ordering of categories based on spending this month
    const orderedCategories = _(spendingPerCategoryThisMonth)
      .sortBy("amountSpent")
      .map("category")
      .value();

    const plotData = {
      thisMonth: spendingPerCategoryThisMonth,
      lastMonth: spendingPerCategoryLastMonth
    };

    // console.log(plotData);

    const nbCategories = Math.max(
      spendingPerCategoryThisMonth.length,
      spendingPerCategoryLastMonth.length
    );

    // These calculations are not exact. E.g. I'm not sure how many pixels
    // 'overhead' should be. It's just to adjust the height
    // more or less with the nb of categories.
    const nbPixelsOverhead = 100;
    const nbPixelsPerCategory = 30;
    const nbPixelsSpacing = 15;
    const height =
      nbPixelsOverhead + nbCategories * (nbPixelsPerCategory + nbPixelsSpacing);

    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            // TODO: make sure long category names don't get cutoff
            // https://formidable.com/open-source/victory/docs/faq/#my-axis-labels-are-cut-off-how-can-i-fix-them
            padding={{ top: 50, bottom: 30, left: 100, right: 40 }}
            height={height}
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
              offset={15}
              style={{
                data: { width: 15 }
              }}
              colorScale={["brown", "tomato"]}
            >
              <VictoryBar
                data={plotData.lastMonth}
                x="category"
                y="amountSpent"
                labels={({ datum }) => {
                  return "$" + Math.round(datum.amountSpent);
                }}
                labelComponent={<VictoryLabel dx={5} />}
                categories={{ x: orderedCategories }}
              />
              <VictoryBar
                data={plotData.thisMonth}
                x="category"
                y="amountSpent"
                labels={({ datum }) => {
                  return "$" + Math.round(datum.amountSpent);
                }}
                labelComponent={<VictoryLabel dx={5} />}
              />
            </VictoryGroup>
            {/* The vertical axis */}
            <VictoryAxis style={{ grid: { stroke: null } }} />
            {/* The horizontal axis */}
            <VictoryAxis
              dependentAxis
              tickFormat={x => `$${x}`}
              style={{ grid: { stroke: null } }}
            />
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
    flex: 1
  }
});
