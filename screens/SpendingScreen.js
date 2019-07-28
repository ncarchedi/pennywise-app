import React from "react";
import { ScrollView, StyleSheet, Text, View, SectionList, FlatList } from "react-native"; 
import { Ionicons } from "@expo/vector-icons";

export default class SpendingScreen extends React.Component {
  state = {
    categories: [
      {
        name: 'Food',
        icon: 'md-pizza',
        thisMonth: 237.98,
        lastMonth: 576.88,
      },
      {
        name: 'Transportation',
        icon: 'md-car',
        thisMonth: 237.98,
        lastMonth: 576.88,
      },
      {
        name: 'Groceries',
        icon: 'md-cart',
        thisMonth: 237.98,
        lastMonth: 576.88,
      },
      {
        name: 'Salary',
        icon: 'md-cash',
        thisMonth: 2250.90,
        lastMonth: 4500.10,
      },
    ]
  };

  listItem = (item, index) => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryNameContainer}>
          <Ionicons
            name={item.icon}
            size={20}
          />
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <View style={styles.categorySpendingContainer}>
          <View style={styles.categorySpendingItemContainer}>
            <Text>$ {item.thisMonth}</Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text>$ {item.lastMonth}</Text>
          </View>
        </View>
      </View>
    )
  }

  listHeader = () => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryNameContainer}>
          <Text style={styles.headerText}>Category</Text>
        </View>
        <View style={styles.categorySpendingContainer}>
          <View style={styles.categorySpendingItemContainer}>
            <Text style={styles.headerText}>This month</Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text style={styles.headerText}>Last month</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.spendingContainer}>
            <FlatList
              data={this.state.categories}
              renderItem={({ item, index }) => this.listItem(item, index)}
              ListHeaderComponent={() => this.listHeader()}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

SpendingScreen.navigationOptions = {
  title: "Spending"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 20
  },
  spendingContainer: {
    // alignItems: "center"
  },
  spendingText: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    lineHeight: 24
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    marginHorizontal: 10,
  },
  categoryNameContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  categorySpendingContainer: {
    flexDirection: 'row-reverse',
  },
  categorySpendingItemContainer: {
    minWidth: 85,
    marginVertical: 10,
  },
  categorySpendingText: {
    color: 'pink',
  },
  headerText: {
    fontWeight: 'bold',
  },
});
