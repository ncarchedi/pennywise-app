import React from "react";
import _ from "lodash";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
  VictoryLabel
} from "victory-native";
import moment from "moment";

import PennywiseVictoryTheme from "../utils/PennywiseVictoryTheme";

export default ChartSpendingWithinCategory = ({ transactions }) => {
  monthIdentifier = date => {
    return moment(date).format("YYYY-MM");
  };

  // TODO: get this from the user instead of hardcoding
  SELECTED_CATEGORY = "Transportation";

  // spending chart logic
  const spendingByMonth = _(transactions)
    .filter(t => t.category === SELECTED_CATEGORY)
    .map(t => ({
      monthIdentifier: monthIdentifier(t.date),
      ...t
    }))
    .groupBy("monthIdentifier")
    .map((month, monthIdentifier) => ({
      monthIdentifier,
      amountSpent: _(month).sumBy("amount")
    }))
    .value();

  return (
    <VictoryChart
      // temporarily switching to grey scale to avoid issue with Roboto font
      theme={PennywiseVictoryTheme}
      // TODO: make sure long category names don't get cutoff
      // https://formidable.com/open-source/victory/docs/faq/#my-axis-labels-are-cut-off-how-can-i-fix-them
      padding={{ top: 50, bottom: 50, left: 75, right: 50 }}
    >
      <VictoryGroup
        offset={15}
        style={{
          data: { width: 15 }
        }}
      >
        <VictoryBar
          data={spendingByMonth}
          x="monthIdentifier"
          y="amountSpent"
          labels={({ datum }) => {
            return datum.amountSpent.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }}
          labelComponent={<VictoryLabel angle={-45} dx={15} dy={0} />}
          // categories={{ x: orderedCategories }}
        />
      </VictoryGroup>
      {/* The vertical axis */}
      <VictoryAxis style={{ grid: { stroke: null } }} />
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
