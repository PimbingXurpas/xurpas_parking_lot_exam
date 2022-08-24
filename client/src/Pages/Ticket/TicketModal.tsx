import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Button, DatePicker, Form, Input, Modal, Radio, Select } from "antd";
import { Interface } from "readline";
import moment from "moment";
import { api } from "../../utils/api";

interface IModal {
  visible: any;
  onCreate: any;
  onCancel: any;
}
interface IEntrance {
  name: string;
}
export const TicketModal = ({ visible, onCreate, onCancel }: IModal) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [state, setstate] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const entrances = await api.get("nearest-entrance");
      setstate(entrances);
    };
    fetchData();
  }, []);

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  return (
    <>
      <Modal
        visible={visible}
        title="Add Ticket"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            timeIn: moment(new Date()),
          }}
          validateMessages={validateMessages}
        >
          <Form.Item name="vechicleSize" label="Vechicle Size" required>
            <Select placeholder="Select an option" allowClear>
              <Option value="Small">Small</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Large">Large</Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeIn" label="Time In" required>
            <DatePicker
              format="YYYY-MM-DD hh:mm A"
              showTime={true}
              size="large"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item name="entrance" label="Entrance" required>
            <Select placeholder="Select an option" allowClear>
              {state.map((item: IEntrance) => (
                <Option value={item.name}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="plate_number" label="Plate Number" required>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
