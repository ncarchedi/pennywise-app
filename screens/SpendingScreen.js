import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text
} from "react-native";
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
import { Ionicons } from "@expo/vector-icons";

import TransactionsList from "../components/TransactionsList";

import { withGlobalContext } from "../GlobalContext";

class SpendingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Spending",
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam("toggleListView")}
          style={{ marginRight: 20 }}
        >
          <Ionicons name={navigation.getParam("toggleViewIcon")} size={25} />
        </TouchableOpacity>
      )
    };
  };

  state = {
    showListView: false
  };

  componentDidMount() {
    // necessary for parameterizing the header bar button. See:
    // https://reactnavigation.org/docs/en/header-buttons.html#adding-a-button-to-the-header
    this.props.navigation.setParams({
      toggleListView: this.toggleListView,
      toggleViewIcon: "ios-list"
    });
  }

  toggleListView = () => {
    const { showListView } = this.state;
    this.setState({ showListView: !showListView });

    this.props.navigation.setParams({
      toggleViewIcon: this.state.showListView ? "ios-list" : "ios-stats"
    });
  };

  handleTransactionPress = transaction => {
    this.props.navigation.navigate("EditModalTransactions", { transaction });
  };

  monthIdentifier = date => {
    return moment(date).format("YYYY-MM");
  };

  render() {
    const transactions = this.props.global.listTransactions();
    const { categories } = this.props.global;
    const { showListView } = this.state;

    // get only categorized transactions
    const categorizedTransactions = _.reject(transactions, {
      category: "No Category"
    });

    if (
      Array.isArray(categorizedTransactions) &&
      !categorizedTransactions.length
    )
      return (
        <View>
          <Ionicons
            name={"ios-pricetags"}
            size={60}
            style={styles.emptyScreenEmoji}
          />
          <Text style={styles.emptyScreenHeader}>
            Categorize some expenses!
          </Text>
          <Text style={styles.emptyScreenCTA}>
            Your categorized expenses will show up here
          </Text>
        </View>
      );

    if (showListView) {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <TransactionsList
              transactions={categorizedTransactions}
              categories={categories}
              onTransactionPress={this.handleTransactionPress}
            />
          </ScrollView>
        </View>
      );
    }

    const spendingByMonth = _(categorizedTransactions)
      .map(t => ({
        monthIdentifier: this.monthIdentifier(t.date),
        ...t
      }))
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
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <VictoryChart
              theme={VictoryTheme.material}
              // TODO: make sure long category names don't get cutoff
              // https://formidable.com/open-source/victory/docs/faq/#my-axis-labels-are-cut-off-how-can-i-fix-them
              padding={{ top: 50, bottom: 50, left: 120, right: 50 }}
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
                <VictoryBar
                  data={plotData.thisMonth}
                  x="category"
                  y="amountSpent"
                  labels={({ datum }) => {
                    return datum.amountSpent.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    });
                  }}
                  labelComponent={<VictoryLabel dx={5} />}
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
                tickLabelComponent={
                  <VictoryLabel angle={-45} dx={-15} dy={-5} />
                }
              />
              <VictoryLabel angle={45} />
            </VictoryChart>
          </ScrollView>
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
  },
  emptyScreenEmoji: {
    textAlign: "center",
    marginTop: 30
  },
  emptyScreenHeader: {
    fontSize: 22,
    marginTop: 15,
    textAlign: "center"
  },
  statusMessageText: {
    fontSize: 17,
    marginTop: 15,
    textAlign: "center"
  },
  emptyScreenCTA: {
    fontSize: 14,
    marginTop: 30,
    color: "darkgrey",
    width: "50%",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: 20
  }
});
