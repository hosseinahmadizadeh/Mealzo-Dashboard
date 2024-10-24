import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import AutoCompletionCustomStyles from "./AutoCompletionCustomStyles";
import instance from "./api";

import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

import { IoIosArrowDown } from "react-icons/io";
import { LuPencil, LuPencilLine } from "react-icons/lu";

const Panel = () => {
  const { control, watch } = useForm();
  const [accountList, setAccountList] = useState([]);
  const [businessInfo, setBusinessInfo] = useState([]);

  const [open, setOpen] = useState(null);
  const [editOpen, setEditOpen] = useState(null);

  const handleEditOpen = (id) => {
    if (editOpen === id) {
      setEditOpen(null);
    } else {
      setEditOpen(id);
      setOpen(null);
    }
  };

  const handleOpen = (id) => {
    if (open === id) {
      setOpen(null);
    } else {
      setOpen(id);
      setEditOpen(null);
    }
  };

  const googleSearchData = [
    { name: "Desktop", value: 400 },
    { name: "Mobile", value: 300 },
  ];

  const googleMapData = [
    { name: "Desktop", value: 700 },
    { name: "Mobile", value: 300 },
  ];

  const [activeIndexSearch, setActiveIndexSearch] = useState(0);
  const onPieEnterSearch = (_, index) => setActiveIndexSearch(index);

  const [activeIndexMap, setActiveIndexMap] = useState(0);
  const onPieEnterMap = (_, index) => setActiveIndexMap(index);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${value}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const selectedAcc = watch("selectedAccount");
  const selectedBusInfo = watch("businessInformation");

  useEffect(() => {
    instance
      .get("account/")
      .then((response) => {
        setAccountList(response.data.accounts);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedAcc) {
      const accountId = selectedAcc.value.split("/")[1];
      if (accountId) {
        instance
          .get(`business-info/${accountId}`)
          .then((response) => {
            setBusinessInfo(response.data);
            console.log(response.data);
          })

          .catch((error) => console.error(error));
      }
    }
  }, [selectedAcc]);

  useEffect(() => {
    if (selectedBusInfo) {
      const locationId = selectedBusInfo.value.split("/")[1];
      if (locationId) {
        instance
          .get(`performance/${locationId}`)
          .then((response) => {
            console.log(response.data);
            setSearchInsightsValue(response.data.allResults);
          })

          .catch((error) => console.error(error));
      }
    }
  }, [selectedBusInfo]);

  useEffect(() => {
    if (selectedBusInfo) {
      const locationId = selectedBusInfo.value.split("/")[1];
      if (locationId) {
        instance
          .get(`verifications/${locationId}`)

          .then((response) => {
            console.log(response.data.verifications[0].state);
          })

          .catch((error) => console.error(error));
      }
    }
  }, [selectedBusInfo]);

  const openHours = [
    { day: "Sunday", opening: "8 AM", closing: "5 PM" },
    { day: "Monday", opening: "8 AM", closing: "5 PM" },
    { day: "Tuesday", opening: "8 AM", closing: "5 PM" },
    { day: "Wednesday", opening: "8 AM", closing: "5 PM" },
    { day: "Thursday", opening: "8 AM", closing: "5 PM" },
    { day: "Friday", opening: "8 AM", closing: "5 PM" },
    { day: "Saturday", opening: "8 AM", closing: "5 PM" },
  ];

  const [searchInsightsValue, setSearchInsightsValue] = useState([]);
  console.log(searchInsightsValue);

  const [sortConfig, setSortConfig] = useState([]);

  const handleSort = (key) => {
    const currentSort = sortConfig.find((sort) => sort.key === key);
    let newDirection = "ascending";

    if (currentSort && currentSort.direction === "ascending") {
      newDirection = "descending";
    }

    const newSortConfig = [
      { key, direction: newDirection },
      ...sortConfig.filter((sort) => sort.key !== key),
    ];

    setSortConfig(newSortConfig);

    const sortedData = [...searchInsightsValue].sort((a, b) => {
      for (let { key, direction } of newSortConfig) {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSearchInsightsValue(sortedData);
  };

  // Function to get the sorting direction for a column
  const getSortDirection = (key) => {
    const sort = sortConfig.find((sort) => sort.key === key);
    return sort ? sort.direction : null;
  };

  return (
    <div className="mx-12">
      <div className="flex py-10 px-8 my-6 bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-900 rounded-2xl border-solid">
        <p className="text-3xl font-semibold text-violet-200">
          Google Performance Dashboard
        </p>
      </div>
      <div className="grid grid-cols-6 grid-rows-10 gap-4">
        <div className="col-span-2 row-span-1">
          <p className="text-lg font-medium mb-2">Account Name</p>
          <Controller
            name="selectedAccount"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <Select
                placeholder="Select Account"
                classNames={{
                  control: (state) =>
                    state.isFocused ? "border-red-600" : "border-grey-300",
                }}
                options={accountList.map((account) => ({
                  label: account.accountName,
                  value: account.name,
                }))}
                value={
                  field.value
                    ? { label: field.value.label, value: field.value.value }
                    : null
                }
                onChange={field.onChange}
                isSearchable
                noOptionsMessage={() => "..."}
                styles={AutoCompletionCustomStyles}
              />
            )}
          />
        </div>
        <div className="col-span-2 row-span-1 col-start-3">
          <p className="text-lg font-medium mb-2">Business Information</p>
          <Controller
            name="businessInformation"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Business Info"
                options={businessInfo.map((info) => ({
                  value: info.name,
                  label: info.title,
                }))}
                onChange={field.onChange}
                isSearchable
                noOptionsMessage={() => "..."}
                styles={AutoCompletionCustomStyles}
              />
            )}
          />
        </div>
        <div className="col-span-2 row-span-6 col-start-5 rounded-2xl border-solid border-zinc-600 border-2">
          <div className="flex flex-col px-4 pt-4">
            <div className="h-10 flex gap-2 justify-center border-zinc-600 border-b-2">
              {!selectedBusInfo && (
                <p className="text-zinc-500 text-sm font-light text-center">
                  Select the account name and the relevant business information
                </p>
              )}
              {selectedBusInfo && selectedBusInfo.label.length < 45 ? (
                <p className="text-lg font-medium">{selectedBusInfo.label}</p>
              ) : null}
              {selectedBusInfo && selectedBusInfo.label.length > 45 ? (
                <p className="text-base font-medium">{selectedBusInfo.label}</p>
              ) : null}
            </div>
            <div>
              <div className="border-b">
                <div className="flex justify-between items-center py-2">
                  <span className="text-base">Open Hour</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOpen(1)}
                      className={`flex justify-between items-center py-2 px-2 text-lg font-medium text-left border-2 rounded-xl hover:border-violet-400 ${editOpen === 1 ? "focus : border-violet-500" : ""} transition ease-in delay-190`}
                    >
                      <span>
                        {editOpen === 1 ? <LuPencilLine /> : <LuPencil />}
                      </span>
                    </button>
                    <button
                      onClick={() => handleOpen(1)}
                      className={`flex justify-between items-center py-2 px-2 text-lg font-medium text-left border-2 rounded-xl hover:border-violet-400 ${open === 1 ? "focus : border-violet-500" : ""} transition ease-in delay-190`}
                    >
                      <span>
                        {open === 1 ? (
                          <IoIosArrowDown
                            style={{ transform: "rotate(180deg)" }}
                          />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </span>
                    </button>
                  </div>
                </div>
                {open === 1 && (
                  <div className="flex flex-col gap-2 py-2 text-zinc-700 max-h-72 overflow-auto">
                    {openHours.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between bg-violet-200 py-1 px-4 rounded-lg"
                      >
                        <span>{item.day}</span>
                        <div className="flex gap-4">
                          <span>{item.opening}</span>
                          <span>to</span>
                          <span>{item.closing}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {editOpen === 1 && (
                  <div className="flex flex-col gap-2 py-2 text-zinc-700 max-h-72 overflow-y-auto overflow-x-hidden">
                    <form
                      // onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col gap-2"
                    >
                      {openHours.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex justify-between bg-violet-200 py-2 px-4 rounded-lg"
                        >
                          <span>{item.day}</span>
                          <div className="flex gap-4">
                            <input
                              // {...register(`openHours.${index}.opening`)}
                              defaultValue={item.opening}
                              className="bg-white px-2 py-1 w-16 rounded"
                            />
                            <span>to</span>
                            <input
                              // {...register(`openHours.${index}.closing`)}
                              defaultValue={item.closing}
                              className="bg-white px-2 py-1 w-16 rounded"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Button to add a new time slot for a specific day */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          // onClick={() => addNewTimeSlot("Sunday")}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Add New Time Slot for Sunday
                        </button>
                        {/* Additional buttons or dropdowns for each day can be added here */}
                      </div>

                      {/* Submit button to save changes */}
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <div className="border-b">
                <div className="flex justify-between items-center py-2">
                  <span className="text-base">Phone Number</span>
                  <button
                    onClick={() => handleOpen(2)}
                    className={`flex justify-between items-center py-2 px-2 text-lg font-medium text-left border-2 rounded-xl hover:border-violet-400 ${open === 2 ? "focus : border-violet-500" : ""} transition ease-in delay-190`}
                  >
                    <span>
                      {open === 2 ? (
                        <IoIosArrowDown
                          style={{ transform: "rotate(180deg)" }}
                        />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </span>
                  </button>
                </div>
                {open === 2 && (
                  <div className="px-4 py-2 bg-zinc-100 text-zinc-700">
                    Accordion content for item 2. You can put any text, images,
                    or elements here.
                  </div>
                )}
              </div>

              <div className="border-b">
                <div className="flex justify-between items-center py-2">
                  <span className="text-base">Address</span>
                  <button
                    onClick={() => handleOpen(3)}
                    className={`flex justify-between items-center py-2 px-2 text-lg font-medium text-left border-2 rounded-xl hover:border-violet-400 ${open === 3 ? "focus : border-violet-500" : ""} transition ease-in delay-190`}
                  >
                    <span>
                      {open === 3 ? (
                        <IoIosArrowDown
                          style={{ transform: "rotate(180deg)" }}
                        />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </span>
                  </button>
                </div>
                {open === 3 && (
                  <div className="px-4 py-2 bg-zinc-100 text-zinc-700">
                    Accordion content for item 3. You can put any text, images,
                    or elements here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full px-2 flex flex-col col-span-2 row-span-5 row-start-2 rounded-2xl border-solid border-zinc-600 border-2">
          <div className="flex justify-center py-2 border-b-2">
            <p className="text-lg font-medium">By searching on Google</p>
          </div>
          <ResponsiveContainer>
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndexSearch}
                activeShape={renderActiveShape}
                data={googleSearchData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnterSearch}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-full w-full px-2 flex flex-col col-span-2 row-span-5 col-start-3 row-start-2 rounded-2xl border-solid border-zinc-600 border-2">
          <div className="flex justify-center py-2 border-b-2">
            <p className="text-lg font-medium">By using Google map service</p>
          </div>
          <ResponsiveContainer>
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndexMap}
                activeShape={renderActiveShape}
                data={googleMapData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnterMap}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="col-span-4 row-span-4 row-start-7 rounded-2xl border-solid border-zinc-600 border-2 p-2">
          <div className="flex justify-center py-2">
            <p className="text-lg font-medium caption-top pb-2">
              Keywords Analytics
            </p>
          </div>
          <div className="max-h-72 overflow-auto">
            <table className="w-full bg-white">
              <thead className="">
                <tr className="sticky top-0 bg-violet-200">
                  <th
                    onClick={() => handleSort("name")}
                    className="py-2 px-4 text-start cursor-pointer border-b-2 border-zinc-200"
                  >
                    No
                  </th>
                  <th
                    onClick={() => handleSort("name")}
                    className="py-2 px-4 text-start cursor-pointer border-b-2 border-zinc-200"
                  >
                    Keyword
                    {getSortDirection("name") === "ascending" && " ↑"}
                    {getSortDirection("name") === "descending" && " ↓"}
                  </th>
                  <th
                    onClick={() => handleSort("age")}
                    className="py-2 px-4 text-center cursor-pointer border-b-2 border-zinc-200"
                  >
                    Search Volume
                    {getSortDirection("age") === "ascending" && " ↑"}
                    {getSortDirection("age") === "descending" && " ↓"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchInsightsValue.map((item, index) => (
                  <tr key={index} className="border-2 rounded-lg">
                    <td className="py-2 px-4 text-start">{index + 1}</td>
                    <td className="py-2 px-4 text-start">
                      {item.searchKeyword}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {item.insightsValue.value
                        ? item.insightsValue.value
                        : item.insightsValue.threshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-2 row-span-4 col-start-5 row-start-7 rounded-2xl border-solid border-zinc-600 border-2">
          7
        </div>
      </div>
    </div>
  );
};

export default Panel;
