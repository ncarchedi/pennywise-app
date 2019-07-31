# Data model

```
{
  transactions: [
    {
      id: "1",
      date: "2019-07-25",
      name: "Amazon.com",
      amount: "-84.33",
      category: {
        id: "1",
        name: "Food"
      }
    }
  ],
  categories: [
    {
      id: "1",
      name: "Food"
      icon: "md-pizza"
    }
  ]
}
```

Let's use this to share context for now: https://stackoverflow.com/questions/51187582/how-should-the-new-context-api-work-with-react-native-navigator.
