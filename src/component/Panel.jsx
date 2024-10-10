import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import AutoCompletionCustomStyles from "./AutoCompletionCustomStyles";
import instance from "./api";

const Panel = () => {
  const { control, watch } = useForm();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [businessInfo, setBusinessInfo] = useState([]);

  const [accountList, setAccountList] = useState([]);

  // Watching the title and product selected by the user
  const selectedAcc = watch("accountList");
  const selectedProduct = watch("product");
  useEffect(() => {
    instance
      .get("/account/")
      .then((response) => {
        console.log(response.data);
        setBusinessInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    instance
      .get("business-info/109436864933420290168")
      .then((response) => {
        console.log(response.data);
        setAccountList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // Filtering logic for products based on the selected title
  useEffect(() => {
    if (selectedAcc) {
      // Get the selected title ID
      const titleId = accountList.find(
        (title) => title.name === selectedAcc.label
      )?.id;

      if (titleId) {
        // Filter businessInfo based on the selected title
        const filtered = businessInfo.filter(
          (category) => category.id === titleId
        );

        setFilteredProducts(filtered); // Set filtered products
      } else {
        setFilteredProducts([]);
      }
    } else {
      setFilteredProducts([]);
    }
  }, [selectedAcc]);

  return (
    <div className="mx-5">
      <div className="d-flex justify-content-center py-3">
        <h3>Google Performance Dashboard</h3>
      </div>
      <form>
        <div className="d-flex justify-content-center gap-5">
          <div className="w-25">
            <label>Account Name</label>
            <div>
              <Controller
                name="accountList"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Select
                    placeholder="Select title"
                    options={accountList.map((account) => ({
                      label: account.AccountName,
                      value: account.name,
                    }))}
                    value={
                      field.value
                        ? { label: field.value.label, value: field.value.value }
                        : null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                    }}
                    isSearchable
                    noOptionsMessage={() => "..."}
                    styles={AutoCompletionCustomStyles}
                  />
                )}
              />
            </div>
          </div>
          <div className="w-25">
            <label>Business Information</label>
            <div>
              <Controller
                name="product"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    placeholder="Select category"
                    options={filteredProducts.map((cat) => ({
                      value: cat.name,
                      label: cat.name,
                      hour: cat.openHour,
                      add: cat.address,
                    }))}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                    }}
                    isSearchable
                    noOptionsMessage={() => "..."}
                    styles={AutoCompletionCustomStyles}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Displaying the selected product */}

      {selectedProduct && (
        <div
          className="d-flex flex-column align-items-center py-3 my-5 border border-2 rounded"
          style={{
            width: "600px",
            height: "300px",
          }}
        >
          <div className="d-flex gap-2">
            <p>Account name:</p>
            <p>{selectedProduct.label}</p>
          </div>
          <div className="d-flex gap-2">
            <p>Open hour:</p>
            <p>{selectedProduct.hour}</p>
          </div>
          <div className="d-flex gap-2">
            <p>Address:</p>
            <p>{selectedProduct.add}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panel;
