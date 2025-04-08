import { StyleSheet } from 'react-native';

export const styles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#181818' : '#fff',
    marginTop: 10,
    width: '100%',
    padding: 10,
  },
  scrollContainer: {
    width: '90%',
    backgroundColor: isDarkMode ? '#181818' : '#fff',
    margin: 2,
  },
  itemsContainer: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'stretch',
    backgroundColor: isDarkMode ? '#282828' : '#fff',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    margin: 10,
  },
  inputContainer: {
    flex: 1,
    marginTop: 30,
    marginLeft: '5%',
    width: '90%',
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: isDarkMode ? '#282828' : '#fff',
    borderRadius: 4
  },
  buttonsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#555' : '#CCC',
    paddingBottom: 10,
    marginTop: 10
  },
  input: {
    marginTop: 4,
    marginBottom: 4,
    marginHorizontal: 24,
    height: 60,
    backgroundColor: isDarkMode ? '#383838' : '#f0f0f0',
    borderRadius: 30,
    fontSize: 16,
    alignItems: 'stretch',
    color: isDarkMode ? '#fff' : '#000',
  },
  button: {
    marginTop: 4,
    marginBottom: 4,
    marginHorizontal: 24,
    height: 60,
    backgroundColor: isDarkMode ? "#3456A4" : "#567AFC",
    borderRadius: 30,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20,
    shadowOpacity: 20,
    shadowColor: isDarkMode ? '#000' : '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  buttonTextBig: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24
  },
  textItem: {
    fontSize: 20,
    color: isDarkMode ? '#fff' : '#000',
  },
  deleteButton: {
    backgroundColor: isDarkMode ? "#A40000" : "red",
    borderRadius: 30,
    padding: 15,
  },
  flatListItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 30,
    margin: 4,
    padding: 2,
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#f0f0f0',
    backgroundColor: isDarkMode ? '#282828' : '#fff',
  },
  flatListItemText: {
    flex: 1,
    flexWrap: "wrap",
    color: isDarkMode ? '#fff' : '#000',
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: isDarkMode ? "#3456A4" : "#567AFC",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: isDarkMode ? '#fff' : '#000',
  }
});