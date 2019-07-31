import React from "react";
import { ScrollView, StyleSheet, Text, View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { withGlobalContext } from '../GlobalContext';

class SpendingScreen extends React.Component { 

  listItem = (item, index) => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryNameContainer}>
          <Ionicons name={item.icon} size={20} />
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <View style={styles.categorySpendingContainer}>
          <View style={styles.categorySpendingItemContainer}>
            <Text>
              {/* Todo: replace with actual values */}
              {Number("400").toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text>
              {/* Todo: replace with actual values */}
              {Number("400").toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  listHeader = () => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryNameContainer}>
          <Text style={styles.headerText}>Category</Text>
        </View>
        <View style={styles.categorySpendingContainer}>
          <View style={styles.categorySpendingItemContainer}>
            <Text style={styles.headerText}>Last month</Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text style={styles.headerText}>This month</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const categories = this.props.global.categories

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.spendingContainer}>
            <FlatList
              data={categories}
              renderItem={({ item, index }) => this.listItem(item, index)}
              ListHeaderComponent={() => this.listHeader()}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withGlobalContext(SpendingScreen);

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
  categoryContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nameText: {
    marginHorizontal: 10
  },
  categoryNameContainer: {
    flexDirection: "row",
    marginVertical: 10
  },
  categorySpendingContainer: {
    flexDirection: "row-reverse"
  },
  categorySpendingItemContainer: {
    minWidth: 85,
    marginVertical: 10,
    flexDirection: "row-reverse"
  },
  headerText: {
    fontWeight: "bold"
  }
});
