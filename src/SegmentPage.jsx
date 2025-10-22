import { useState, useEffect } from "react";
const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];
const defaultSchemas = ["first_name", "account_name"];
const SegmentPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [tempSchema, setTempSchema] = useState("");
  const [errors, setErrors] = useState({
    segmentName: "",
    addSchema: "",
  });

  // Set default schema
  useEffect(() => {
    if (showPopup && selectedSchemas.length === 0) {
      setSelectedSchemas(defaultSchemas);
    }
  }, [showPopup]);

  const openPopup = () => setShowPopup(true);

  const closePopup = () => {
    setShowPopup(false);
    setSegmentName("");
    setSelectedSchemas([]);
    setTempSchema("");
  };

  const handleAddSchema = () => {
    if (tempSchema && !selectedSchemas.includes(tempSchema)) {
      setSelectedSchemas((prev) => [...prev, tempSchema]);
      setTempSchema("");
    }
  };

  const handleSchemaChange = (index, value) => {
    const updated = [...selectedSchemas];
    updated[index] = value;
    setSelectedSchemas(updated);
  };

  const handleRemoveSchema = (index) => {
    // if (defaultSchemas.includes(selectedSchemas[index])) return;
    setSelectedSchemas(selectedSchemas.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!segmentName.trim()) {
      setErrors((prev) => ({
        ...prev,
        segmentName: "Please enter segment name!",
      }));
      return;
    }
    const payload = {
      segment_name: segmentName,
      schema: selectedSchemas.map((key) => {
        const item = schemaOptions.find((s) => s.value === key);
        return { [key]: item?.label || key };
      }),
    };

    console.log("Sending data to server:", payload);
    const formattedPayload = JSON.stringify(payload, null, 2);

    alert(`Sending data to server:\n\n${formattedPayload}`);
    setErrors({ segmentName: "", addSchema: "" });
    closePopup();
    const offcanvasEl = document.getElementById("offcanvasRight");
    const offcanvas = window.bootstrap?.Offcanvas.getInstance(offcanvasEl);
    offcanvas?.hide();
  };

  const getAvailableOptions = (currentValue) => {
    return schemaOptions.filter(
      (option) =>
        !selectedSchemas.includes(option.value) || option.value === currentValue
    );
  };

  const handleCancel = () => {
    setSelectedSchemas(defaultSchemas);
    setTempSchema("");
  };

  return (
    <>
      <button
        className="btn saveseg bg-green text-white fw-bold"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
        onClick={openPopup}
      >
        Save Segment
      </button>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header text-light">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
          <h5 className="offcanvas-title ms-3" id="offcanvasRightLabel">
            Saving Segment
          </h5>
        </div>
        <div className="offcanvas-body ">
          <div className="h-100 d-flex flex-column justify-content-between">
            <>
              {/* Name of the segement */}
              <label htmlFor="segmentName">Enter the Name of the Segment</label>
              <input
                type="text"
                id="segmentName"
                className="form-control mt-3"
                placeholder="Name of the segment"
                value={segmentName}
                onChange={(e) => {
                  setSegmentName(e.target.value);
                  if (errors.segmentName && e.target.value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, segmentName: "" })); // hide error
                  }
                }}
              />
              {errors.segmentName && (
                <div className="text-danger small py-1">
                  {errors.segmentName}
                </div>
              )}
              <p>
                To save your segment, you need to add the schemas to build the
                query
              </p>
              {/* Identifiers */}
              <div className="d-flex justify-content-end gap-3 mb-3">
                <p>
                  <i className="fa-solid fa-circle icon-size text-success"></i>-
                  User Traits
                </p>
                <p>
                  <i className="fa-solid fa-circle icon-size text-danger"></i> -
                  Group Traits
                </p>
              </div>
              {showPopup && (
                <>
                  {/* Schema Dropdowns */}
                  <div className="all-schemas p-3 mb-3">
                    {selectedSchemas.map((schema, index) => {
                      const availableOptions = getAvailableOptions(schema);
                      const isUserTrait = [
                        "first_name",
                        "last_name",
                        "gender",
                        "age",
                      ].includes(schema);
                      const isGroupTrait = [
                        "account_name",
                        "city",
                        "state",
                      ].includes(schema);

                      const circleColor = isUserTrait
                        ? "text-success"
                        : isGroupTrait
                        ? "text-danger"
                        : "text-secondary";

                      return (
                        <div
                          key={index}
                          className="schema-row mb-2 d-flex align-items-center justify-content-between"
                        >
                          <i
                            className={`fa-solid fa-circle me-2 icon-size ${circleColor}`}
                          ></i>
                          <select
                            className="form-select border border-secondary rounded-0"
                            value={schema}
                            onChange={(e) =>
                              handleSchemaChange(index, e.target.value)
                            }
                          >
                            {availableOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          {/* {!defaultSchemas.includes(schema) && ( */}
                          <button
                            className="btn bg-light-teal-green px-2 ms-2"
                            onClick={() => handleRemoveSchema(index)}
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          {/* )} */}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Schema */}
                  <div className="add-schema mt-3">
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-circle me-2 text-secondary icon-size"></i>
                      <select
                        className="form-select"
                        value={tempSchema}
                        onChange={(e) => {
                          setTempSchema(e.target.value);
                          if (errors.addSchema && e.target.value) {
                            setErrors((prev) => ({ ...prev, addSchema: "" }));
                          }
                        }}
                      >
                        <option value="">Add schema to segment</option>
                        {schemaOptions
                          .filter((opt) => !selectedSchemas.includes(opt.value))
                          .map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                      <button
                        className="btn bg-light-teal-green px-2 ms-2"
                        // onClick={() => handleRemoveSchema(index)}
                        onClick={() => {
                          if (!tempSchema) {
                            setErrors((prev) => ({
                              ...prev,
                              addSchema:
                                "Please select a schema before removing!",
                            }));
                            return;
                          }
                          setTempSchema("");
                          setErrors((prev) => ({ ...prev, addSchema: "" }));
                        }}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                    </div>
                    {errors.addSchema && (
                      <div className="text-danger small py-1">
                        {errors.addSchema}
                      </div>
                    )}

                    <button
                      className="btn btn-link text-green ms-2 "
                      onClick={handleAddSchema}
                    >
                      + Add new schema
                    </button>
                  </div>
                </>
              )}
            </>

            {/* Actions */}
            <div className=" d-flex gap-3 bg-light-gray  px-3 py-4 mt-4 ">
              <button
                className="btn bg-green text-white fw-bold"
                onClick={handleSave}
              >
                Save the Segment
              </button>
              <button
                className="btn bg-white text-danger fw-bold"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>

            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SegmentPage;
