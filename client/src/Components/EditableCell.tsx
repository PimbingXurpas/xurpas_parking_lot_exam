import React from "react";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import moment from "moment";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text" | "select" | "date";
  record: any;
  index: number;
  children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { Option } = Select;
  const dateFormat = "YYYY-MM-DD hh:mm A";
  const slotSizes = ["Small", "Medium", "Large"];
  const status = ["Available", "UnAvailable"];
  const inputNode = () => {
    switch (inputType) {
      case "number":
        return <InputNumber />;
      case "select":
        return (
          <Select placeholder="Select an option">
            {title == "Status"
              ? status.map((item) => <Option value={item}>{item}</Option>)
              : slotSizes.map((item) => <Option value={item}>{item}</Option>)}
          </Select>
        );
      // case "date":
      //   const value = moment(record[dataIndex]).format(dateFormat);
      //   return (
      //     <></>

      //     // <DatePicker defaultValue={moment(record[dataIndex])} format="YYYY-MM-DD hh:mm A" />
      //     // <DatePicker
      //     //   format="YYYY-MM-DD hh:mm A"
      //     //   value={moment(record[dataIndex])}
      //     //   showTime={true}
      //     //   size="large"
      //     //   style={{
      //     //     width: "100%",
      //     //   }}
      //     // />
      //   );
      default:
        return <Input />;
    }
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
