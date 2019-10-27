
import React from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";
import { toPrettyDate, leftJoin } from "../utils/TransactionUtils";
import allQuotes from "../data/quotes.json";
import Swipeable from 'react-native-gesture-handler/Swipeable'

const LeftAction = (progress,dragX) =>{

  const scale = dragX.interpolate({
    inputRange: [0,100],
    outputRange: [0,1],
    extrapolate: 'clamp'
  })
  return (
    <View style = {styles.leftAction}>
      <Animated.Text style = {[styles.actionText,{ transform: [{ scale }]}]}>  
        Edit Transaction
      </Animated.Text>
    </View>
  )
};


export default function WorkingTransactionsList({
  transactions,
  categories,
  onTransactionEdit,
  categorized,
  onRightClick,
  statusMessage
}) {
  ListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#f1f1f1" }} />
    );
  };

  ListItem = (item, index) => {
    const { name, amount, date, category, icon } = item;

    const RightAction = ({progress,dragX,}) =>{
      const scale = dragX.interpolate({
        inputRange: [-50,0],
        outputRange: [1,0],
        extrapolate: 'clamp'
      })
      
      
      return (
        <TouchableOpacity onPress={() => {this.close; onRightClick(item);}}>
          <View style = {styles.rightAction}>
            <Animated.Text style = {[styles.actionText,{ transform: [{ scale }]}]}>  
              Delete
            </Animated.Text>
          </View>
        </TouchableOpacity>
        
      )
    };

    return (
      <Swipeable 
        renderLeftActions={LeftAction}
        onSwipeableLeftOpen= {() => onTransactionEdit(item)}
        renderRightActions ={(progress, dragX) => <RightAction progress = {progress} dragX = {dragX}/>}
      >
        <View style = {styles.swipeItem}>
        <View style={styles.transactionsListItem} key={index}>
          <View
            style={{
              alignSelf: "center",
              width: 25
            }}
          >
            <Ionicons name={icon} size={25} style={{ alignSelf: "center" }} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 ,backgroundColor:"white" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", flex: 1, flexWrap: "wrap" }}>
                {name || "No Name"}
              </Text>
              <Text style={{ marginLeft: "auto" }}>
                {Number(amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD"
                })}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text>{toPrettyDate(date)}</Text>
              <Text style={{ fontStyle: "italic", marginLeft: "auto" }}>
                {category}
              </Text>
            </View>
          </View>
        </View>
        </View>
      </Swipeable>
    );
  };

  // get only the relevant transactions
  const transactionsFiltered = categorized
    ? _.reject(transactions, {
        category: "No Category"
      })
    : _.filter(transactions, {
        category: "No Category"
      });

  const transactionsWithIcons = leftJoin(
    transactionsFiltered,
    categories,
    "category",
    "label"
  );

  const transactionsFinal = _(transactionsWithIcons)
    .sortBy("date")
    .reverse()
    .value();

  // get random quote for empty screen
  const quote = allQuotes[Math.floor(Math.random() * allQuotes.length)];

  // console.log("rendering transactions list...");

  return (
    <View style={styles.container}>
      <FlatList
        style = {styles.flatListstyle}
        data={transactionsFinal}
        renderItem={({ item, index }) => this.ListItem(item, index)}
        ItemSeparatorComponent={this.ListItemSeparator}
        keyExtractor={(item, index) => item + index}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.emptyScreenEmoji}>🎉</Text>
            <Text style={styles.emptyScreenHeader}>All done for today!</Text>
            {statusMessage ? (
              <Text style={styles.statusMessageText}>{statusMessage}</Text>
            ) : null}
            <View style={styles.emptyScreenQuoteBox}>
              <Text style={styles.emptyScreenQuoteText}>{quote.text}</Text>
              <Text style={styles.emptyScreenQuoteSource}>
                {"-" + quote.source}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  swipeItem: {
    backgroundColor: "#fff"
  },
  transactionsListItem: {
    marginVertical: 12,
    marginHorizontal: 10,
    flexDirection: "row"
  },
  sectionHeader: {
    paddingLeft: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1"
  },
  sectionHeaderText: {
    fontSize: 28
  },
  emptyScreenEmoji: {
    fontSize: 60,
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
  emptyScreenQuoteBox: {
    backgroundColor: "#f1f1f1",
    marginTop: 50,
    paddingVertical: 30
  },
  emptyScreenQuoteText: {
    textAlign: "center",
    fontSize: 17,
    marginHorizontal: 30,
    fontStyle: "italic",
    color: "grey"
  },
  emptyScreenQuoteSource: {
    textAlign: "center",
    fontSize: 17,
    marginTop: 10,
    color: "grey"
  },
  rightAction: {
    backgroundColor: "red",
    justifyContent: 'center',
    flex:1
  },
  leftAction: {
    backgroundColor: "green",
    justifyContent: 'center',
    flex: 1
  },
  actionText: {
      color: "white",
      padding: 10,
      fontWeight: '600',
      fontSize: 14
  } 
});
