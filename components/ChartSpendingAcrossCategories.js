import React from "react";
import _ from "lodash";
import {
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryGroup,
  VictoryAxis,
  VictoryLabel
} from "victory-native";
import moment from "moment";

import { truncateString } from "../utils/TextUtils";
import PennywiseVictoryTheme from "../utils/PennywiseVictoryTheme";

export default ChartSpendingAcrossCategories = ({ transactions }) => {
  monthIdentifier = date => {
    return moment(date).format("YYYY-MM");
  };

  // spending chart logic
  const spendingByMonth = _(transactions)
    .map(t => ({
      monthIdentifier: monthIdentifier(t.date),
      ...t
    }))
    .groupBy("monthIdentifier")
    .map((month, monthIdentifier) => ({
      [monthIdentifier]: _(month)
        .groupBy("category")
        .map((category, categoryName) => ({
          category: categoryName,
          amountSpent: _(category).sumBy("amount")
        }))
    }))
    // from: https://stackoverflow.com/questions/30221286/how-to-convert-an-array-of-objects-to-an-object-in-lodash
    .reduce(function(memo, current) {
      return _.assign(memo, current);
    }, {});

  const spendingByMonthFinal = JSON.parse(JSON.stringify(spendingByMonth));

  const monthLabels = _(spendingByMonthFinal)
    .map((month, monthIdentifier) => ({
      name: monthIdentifier
    }))
    .orderBy("name")
    .value();

  const monthLabelsArray = _(monthLabels)
    .map("name")
    .value();

  // Order by the second to last month
  const monthToOrderBy =
    monthLabelsArray.length >= 2
      ? monthLabelsArray[monthLabelsArray.length - 2]
      : monthLabelsArray[0];

  const orderedCategories = _(transactions)
    .map(t => ({
      monthIdentifier: monthIdentifier(t.date),
      ...t
    }))
    .groupBy("category")
    .map((category, categoryName) => ({
      category: categoryName,
      maxSpent: _(category)
        .filter({ monthIdentifier: monthToOrderBy })
        .sumBy("amount")
    }))
    .orderBy("maxSpent", "asc")
    .map("category")
    .value();

  // Rough dimensions for the chart
  const nbCategories = orderedCategories.length;
  const nbMonths = monthLabelsArray.length;

  const nbPixelsOverhead = 100;
  const nbPixelsPerCategory = nbMonths * 15;
  const nbPixelsSpacing = 15;
  const height =
    nbPixelsOverhead + nbCategories * (nbPixelsPerCategory + nbPixelsSpacing);

  return (
    <VictoryChart
      // temporarily switching to grey scale to avoid issue with Roboto font
      theme={PennywiseVictoryTheme}
      // TODO: make sure long category names don't get cutoff
      // https://formidable.com/open-source/victory/docs/faq/#my-axis-labels-are-cut-off-how-can-i-fix-them
      padding={{ top: 45, bottom: 50, left: 115, right: 30 }}
      domainPadding={25}
      height={height}
    >
      <VictoryLegend
        x={10}
        y={10}
        orientation="horizontal"
        data={monthLabels.map(m => ({
          name: moment(m.name).format("MMM YYYY")
        }))}
      />
      <VictoryGroup horizontal offset={15}>
        {monthLabelsArray.map(m => (
          <VictoryBar
            key={m}
            data={spendingByMonthFinal[m]}
            x="category"
            y="amountSpent"
            barWidth={15}
            labels={({ datum }) => {
              return datum.amountSpent.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              });
            }}
            labelComponent={<VictoryLabel dx={5} />}
            categories={{ x: orderedCategories }}
          />
        ))}
      </VictoryGroup>
      {/* The vertical axis */}
      <VictoryAxis
        tickFormat={x => truncateString(x, 15)}
        style={{ grid: { stroke: null } }}
      />
      {/* The horizontal axis */}
      <VictoryAxis
        dependentAxis
        tickFormat={y =>
          y.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })
        }
        style={{ grid: { stroke: null } }}
        tickLabelComponent={<VictoryLabel angle={-45} dx={-15} dy={-5} />}
      />
      <VictoryLabel angle={45} />
    </VictoryChart>
  );
};
