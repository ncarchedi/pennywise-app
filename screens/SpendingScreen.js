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

    // list view logic
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

    // spending chart logic
    const spendingByMonth = _(categorizedTransactions)
      .map(t => ({
        monthIdentifier: this.monthIdentifier(t.date),
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

    const orderedCategories = _(categorizedTransactions)
      .map(t => ({
        monthIdentifier: this.monthIdentifier(t.date),
        ...t
      }))
      .groupBy("category")
      .map((category, categoryName) => ({
        category: categoryName,
        maxSpent: _(category).maxBy("amount").amount
      }))
      .orderBy("maxSpent")
      .map("category")
      .value();

    // These calculations are not exact. E.g. I'm not sure how many pixels
    // 'overhead' should be. It's just to adjust the height
    // more or less with the nb of categories.
    const nbCategories = orderedCategories.length;
    const nbMonths = monthLabelsArray.length;

    const nbPixelsOverhead = 100;
    const nbPixelsPerCategory = nbMonths * 15;
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
                x={0}
                y={15}
                orientation="horizontal"
                data={monthLabels}
              />
              <VictoryGroup
                horizontal
                offset={15}
                style={{
                  data: { width: 15 }
                }}
              >
                {monthLabelsArray.map(m => (
                  <VictoryBar
                    key={m}
                    data={spendingByMonthFinal[m]}
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
                ))}
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
    marginTop: 30,
    color: "darkgrey",
    width: "50%",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: 20
  }
});
