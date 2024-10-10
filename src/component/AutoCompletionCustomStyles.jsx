const AutoCompletionCustomStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "0px",
    height: "45px",
    backgroundColor: "var(--white)",
    borderRadius: "5px",
    alignItems: "center",
    borderColor: state.isFocused ? "rgb(198, 198, 198)" : "#ced4da",
    boxShadow: state.isFocused ? "0 0 0 0.1rem rgba(0,123,255,.25)" : null,
    "@media screen and (max-width: 540px)": {
      height: "45px",
      fontSize: "13px",
      padding: "0px",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
    "@media screen and (max-width: 540px)": {
      marginBottom: "15px",
    },
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    "@media screen and (max-width: 540px)": {
      marginBottom: "15px",
    },
  }),
};

export default AutoCompletionCustomStyles;
