const AutoCompletionCustomStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "0px",
    height: "45px",
    borderRadius: "10px",
    borderWidth: "3px",
    alignItems: "center",
    borderColor: state.isFocused ? "rgb(82 82 91)" : "rgb(113 113 122)",
    boxShadow: state.isFocused
      ? "0 0 0 0.2rem rgba(139 ,92 ,246, 0.7)"
      : "none",
    "&:hover": {
      borderColor: "rgb(139 ,92 ,246)", // Hover border color
    },
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
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "rgb(107 114 128)"
      : state.isFocused
        ? "rgb(229 231 235)"
        : "rgb(249 250 251)",
    color: state.isSelected ? "#fff" : "#333",
    padding: 10,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "rgb(249 250 251)",
    borderRadius: "10px",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 200,
    overflowY: "auto",
    borderRadius: "10px",
    borderWidth: "1px",
    borderColor: "rgb(229 231 235)",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    "@media screen and (max-width: 540px)": {
      marginBottom: "15px",
    },
  }),
};

export default AutoCompletionCustomStyles;
