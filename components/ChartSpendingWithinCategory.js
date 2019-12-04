import React from "react";
import _ from "lodash";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel
} from "victory-native";
import moment from "moment";

import PennywiseVictoryTheme from "../utils/PennywiseVictoryTheme";

export default ChartSpendingWithinCategory = ({ transactions }) => {
  monthIdentifier = date => {
    return moment(date).format("YYYY-MM");
  };

  // TODO: allow user to select "all" or a specific category
  SELECTED_CATEGORY = "All";

  let filteredTransactions = transactions;

  if (SELECTED_CATEGORY !== "All")
    filteredTransactions = _(filteredTransactions).filter(
      t => t.category === SELECTED_CATEGORY
    );

  const spendingByMonth = _(filteredTransactions)
    .map(t => ({
      monthIdentifier: monthIdentifier(t.date),
      ...t
    }))
    .groupBy("monthIdentifier")
    .map((month, monthIdentifier) => ({
      monthIdentifier,
      amountSpent: _(month).sumBy("amount")
    }))
    .sortBy("monthIdentifier")
    .value();

  return (
    <VictoryChart
      // temporarily switching to grey scale to avoid issue with Roboto font
      theme={PennywiseVictoryTheme}
      // TODO: make sure long category names don't get cutoff
      // https://formidable.com/open-source/victory/docs/faq/#my-axis-labels-are-cut-off-how-can-i-fix-them
      padding={{ top: 10, bottom: 60, left: 65, right: 25 }}
      domainPadding={50}
    >
      <VictoryBar
        data={spendingByMonth}
        x={m => moment(m.monthIdentifier).format("MMM YYYY")}
        y="amountSpent"
        barWidth={30}
        labels={({ datum }) => {
          return datum.amountSpent.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
        }}
        labelComponent={<VictoryLabel angle={-45} dx={15} dy={-10} />}
      />
      {/* The vertical axis */}
      <VictoryAxis
        style={{ grid: { stroke: null } }}
        tickLabelComponent={<VictoryLabel angle={-45} dx={-20} />}
      />
      {/* The horizontal axis */}
      <VictoryAxis
        dependentAxis
        tickFormat={x =>
          x.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })
        }
        style={{ grid: { stroke: null } }}
      />
    </VictoryChart>
  );
};
